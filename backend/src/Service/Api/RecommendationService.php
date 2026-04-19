<?php

namespace App\Service\Api;

use App\Dto\RecommendationRequest;
use App\Entity\Schools;
use App\Repository\SchoolsRepository;

class RecommendationService
{
    private const BUDGET_RANGES = [
        'low' => ['min' => 0, 'max' => 500],
        'medium' => ['min' => 500, 'max' => 1000],
        'high' => ['min' => 1000, 'max' => PHP_INT_MAX],
    ];

    private const LEVEL_MAP = [
        'none' => 'A1',
        'alpha' => 'A1',
        'a1' => 'A1',
        'a2' => 'A2',
        'b1' => 'B1',
        'b2' => 'B2',
    ];

    private const TIME_SCHEDULE_MAP = [
        'mornings' => ['morning', 'vormittag'],
        'afternoons' => ['afternoon', 'nachmittag'],
        'evenings' => ['evening', 'abend'],
        'weekends' => ['weekend', 'samstag', 'sunday', 'wochenende'],
    ];

    private const GOAL_COURSE_TYPE_MAP = [
        'integration' => ['integration', 'intensiv', 'intensive'],
        'career' => ['business', 'beruf', 'professional'],
        'certificate' => ['telc', 'goethe', 'fide', 'certificate', 'prüfung'],
        'conversation' => ['conversation', 'konversation', 'speaking'],
    ];

    public function __construct(private SchoolsRepository $schoolsRepository)
    {
    }

    /**
     * @return array<array{school: Schools, score: int, matchPercentage: int, reasons: array<string>}>
     */
    public function getRecommendations(RecommendationRequest $request): array
    {
        $schools = $this->schoolsRepository->findAll();
        $recommendations = [];

        foreach ($schools as $school) {
            $result = $this->calculateScore($school, $request);

            if ($result['score'] > 0) {
                $recommendations[] = [
                    'school' => $school,
                    'score' => $result['score'],
                    'matchPercentage' => $result['matchPercentage'],
                    'reasons' => $result['reasons'],
                ];
            }
        }

        usort($recommendations, fn($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($recommendations, 0, 10);
    }

    /**
     * @return array{score: int, matchPercentage: int, reasons: array<string>}
     */
    private function calculateScore(Schools $school, RecommendationRequest $request): array
    {
        $score = 0;
        $maxScore = 0;
        $reasons = [];

        // Budget matching (weight: 25)
        $maxScore += 25;
        $budgetScore = $this->scoreBudget($school, $request->budget);
        $score += $budgetScore;
        if ($budgetScore > 0) {
            $reasons[] = $this->getBudgetReason($request->budget);
        }

        // Schedule matching (weight: 25)
        $maxScore += 25;
        $scheduleScore = $this->scoreSchedule($school, $request->timeAvailable, $request->isWorking);
        $score += $scheduleScore;
        if ($scheduleScore > 0) {
            $reasons[] = $this->getScheduleReason($request->timeAvailable);
        }

        // Level matching (weight: 20)
        $maxScore += 20;
        $levelScore = $this->scoreLevel($school, $request->currentLevel);
        $score += $levelScore;
        if ($levelScore > 0) {
            $reasons[] = 'Offers courses at your level';
        }

        // Goal matching (weight: 20)
        $maxScore += 20;
        $goalScore = $this->scoreGoal($school, $request->goal);
        $score += $goalScore;
        if ($goalScore > 0) {
            $reasons[] = $this->getGoalReason($request->goal);
        }

        // Rating bonus (weight: 10)
        $maxScore += 10;
        $ratingScore = $this->scoreRating($school);
        $score += $ratingScore;
        if ($ratingScore >= 8) {
            $reasons[] = 'Highly rated by students';
        }

        // Children-friendly bonus
        if ($request->hasChildren) {
            $childrenScore = $this->scoreChildrenFriendly($school);
            if ($childrenScore > 0) {
                $score += 5;
                $maxScore += 5;
                $reasons[] = 'Family-friendly options available';
            }
        }

        $matchPercentage = $maxScore > 0 ? (int) round(($score / $maxScore) * 100) : 0;

        return [
            'score' => $score,
            'matchPercentage' => $matchPercentage,
            'reasons' => $reasons,
        ];
    }

    private function scoreBudget(Schools $school, string $budget): int
    {
        $range = self::BUDGET_RANGES[$budget] ?? self::BUDGET_RANGES['medium'];
        $minPrice = (float) ($school->getPriceRangeMin() ?? 0);
        $maxPrice = (float) ($school->getPriceRangeMax() ?? $minPrice);

        if ($minPrice <= $range['max'] && $maxPrice >= $range['min']) {
            if ($minPrice >= $range['min'] && $maxPrice <= $range['max']) {
                return 25;
            }
            return 15;
        }

        return 0;
    }

    private function scoreSchedule(Schools $school, string $timeAvailable, string $isWorking): int
    {
        $schedule = $school->getSchedule() ?? [];
        $scheduleStr = strtolower(implode(' ', array_map(fn($s) => is_array($s) ? implode(' ', $s) : (string) $s, $schedule)));

        $keywords = self::TIME_SCHEDULE_MAP[$timeAvailable] ?? [];

        foreach ($keywords as $keyword) {
            if (str_contains($scheduleStr, $keyword)) {
                if ($isWorking === 'fulltime' && in_array($timeAvailable, ['evenings', 'weekends'])) {
                    return 25;
                }
                return 20;
            }
        }

        return 0;
    }

    private function scoreLevel(Schools $school, string $currentLevel): int
    {
        $levels = $school->getLevels() ?? [];
        $targetLevel = self::LEVEL_MAP[$currentLevel] ?? 'A1';

        $levelsStr = strtoupper(implode(' ', $levels));

        if (str_contains($levelsStr, $targetLevel)) {
            return 20;
        }

        return 0;
    }

    private function scoreGoal(Schools $school, string $goal): int
    {
        $courseTypes = $school->getCourseTypes() ?? [];
        $courseTypesStr = strtolower(implode(' ', $courseTypes));

        $keywords = self::GOAL_COURSE_TYPE_MAP[$goal] ?? [];

        foreach ($keywords as $keyword) {
            if (str_contains($courseTypesStr, $keyword)) {
                return 20;
            }
        }

        // Check features as fallback
        $features = $school->getFeatures() ?? [];
        $featuresStr = strtolower(implode(' ', $features));

        foreach ($keywords as $keyword) {
            if (str_contains($featuresStr, $keyword)) {
                return 15;
            }
        }

        return 0;
    }

    private function scoreRating(Schools $school): int
    {
        $rating = (float) ($school->getRating() ?? 0);

        if ($rating >= 4.5) {
            return 10;
        } elseif ($rating >= 4.0) {
            return 8;
        } elseif ($rating >= 3.5) {
            return 5;
        }

        return 0;
    }

    private function scoreChildrenFriendly(Schools $school): int
    {
        $features = $school->getFeatures() ?? [];
        $featuresStr = strtolower(implode(' ', $features));

        $childKeywords = ['child', 'kinder', 'family', 'familie', 'childcare', 'kinderbetreuung'];

        foreach ($childKeywords as $keyword) {
            if (str_contains($featuresStr, $keyword)) {
                return 5;
            }
        }

        return 0;
    }

    private function getBudgetReason(string $budget): string
    {
        return match ($budget) {
            'low' => 'Budget-friendly pricing',
            'medium' => 'Moderate pricing within your budget',
            'high' => 'Premium courses available',
            default => 'Fits your budget',
        };
    }

    private function getScheduleReason(string $timeAvailable): string
    {
        return match ($timeAvailable) {
            'mornings' => 'Morning courses available',
            'afternoons' => 'Afternoon courses available',
            'evenings' => 'Evening courses available',
            'weekends' => 'Weekend courses available',
            default => 'Flexible schedule options',
        };
    }

    private function getGoalReason(string $goal): string
    {
        return match ($goal) {
            'integration' => 'Offers integration courses',
            'career' => 'Business German courses available',
            'certificate' => 'Exam preparation courses available',
            'conversation' => 'Conversation-focused courses',
            default => 'Matches your learning goals',
        };
    }
}
