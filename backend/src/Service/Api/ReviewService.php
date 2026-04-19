<?php

namespace App\Service\Api;

use App\Dto\CreateReviewRequest;
use App\Dto\SubmitReviewRequest;
use App\Entity\Courses;
use App\Entity\Reviews;
use App\Entity\Schools;
use App\Entity\User;
use App\Repository\CoursesRepository;
use App\Repository\ReviewsRepository;
use App\Repository\SchoolsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Component\Uid\Uuid;

class ReviewService
{
    public function __construct(
        private ReviewsRepository $reviewsRepository,
        private UserRepository $userRepository,
        private SchoolsRepository $schoolsRepository,
        private CoursesRepository $coursesRepository,
        private ReviewEmailService $reviewEmailService,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @return array{data: Paginator<Reviews>, total: int, page: int, limit: int, pages: int}
     */
    public function getAllReviews(int $page = 1, int $limit = 10, bool $verifiedOnly = true): array
    {
        $paginator = $verifiedOnly
            ? $this->reviewsRepository->findVerifiedPaginated($page, $limit)
            : $this->reviewsRepository->findPaginated($page, $limit);
        $total = count($paginator);

        return [
            'data' => $paginator,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => (int) ceil($total / $limit),
        ];
    }

    public function getReviewById(string $id): ?Reviews
    {
        if (!Uuid::isValid($id)) {
            return null;
        }

        return $this->reviewsRepository->findByUuid(Uuid::fromString($id));
    }

    /**
     * @return array{data: Paginator<Reviews>, total: int, page: int, limit: int, pages: int}
     */
    public function searchReviews(
        ?string $author = null,
        ?int $ratingMin = null,
        ?int $ratingMax = null,
        ?string $schoolSlug = null,
        ?string $dateFrom = null,
        ?string $dateTo = null,
        int $page = 1,
        int $limit = 10,
        bool $verifiedOnly = true
    ): array {
        $dateFromParsed = $dateFrom ? \DateTime::createFromFormat('Y-m-d', $dateFrom) ?: null : null;
        $dateToParsed = $dateTo ? \DateTime::createFromFormat('Y-m-d', $dateTo) ?: null : null;

        $paginator = $this->reviewsRepository->search(
            $author,
            $ratingMin,
            $ratingMax,
            $schoolSlug,
            $dateFromParsed,
            $dateToParsed,
            $page,
            $limit,
            $verifiedOnly
        );
        $total = count($paginator);

        return [
            'data' => $paginator,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => (int) ceil($total / $limit),
        ];
    }

    /**
     * @return array{success: bool, review?: Reviews, error?: string}
     */
    public function createReview(Schools $school, CreateReviewRequest $request): array
    {
        if (!Uuid::isValid($request->userId)) {
            return ['success' => false, 'error' => 'Invalid user ID format'];
        }

        $user = $this->userRepository->find(Uuid::fromString($request->userId));

        if (!$user) {
            return ['success' => false, 'error' => 'User not found'];
        }

        $review = new Reviews();
        $review->setId(Uuid::v4());
        $review->setSchool($school);
        $review->setUser($user);
        $review->setAuthor($request->author);
        $review->setRating($request->rating);
        $review->setText($request->text);
        $review->setReviewDate(new \DateTime());
        $review->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($review);
        $this->entityManager->flush();

        // Update school review count
        $school->setReviewCount($school->getReviewCount() + 1);
        $this->updateSchoolRating($school);
        $this->entityManager->flush();

        return ['success' => true, 'review' => $review];
    }

    private function updateSchoolRating(Schools $school): void
    {
        $reviews = $school->getReviews();
        $totalRating = 0;
        $count = 0;

        foreach ($reviews as $review) {
            if ($review->getRating() !== null && $review->isVerified()) {
                $totalRating += $review->getRating();
                $count++;
            }
        }

        if ($count > 0) {
            $averageRating = round($totalRating / $count, 1);
            $school->setRating((string) $averageRating);
        }

        $school->setReviewCount($count);
    }

    /**
     * @return array{success: bool, error?: string}
     */
    public function submitReview(SubmitReviewRequest $request): array
    {
        if (!Uuid::isValid($request->schoolId)) {
            return ['success' => false, 'error' => 'Invalid school ID format'];
        }

        $school = $this->schoolsRepository->find(Uuid::fromString($request->schoolId));
        if (!$school) {
            return ['success' => false, 'error' => 'School not found'];
        }

        $schoolUuid = Uuid::fromString($request->schoolId);

        // Check for recent verified review from same email
        if ($this->reviewsRepository->hasRecentReview($request->email, $schoolUuid)) {
            return ['success' => false, 'error' => 'You have already submitted a review for this school within the last 30 days'];
        }

        // Check if there's an existing unverified review - delete it and create new one
        $existingUnverified = $this->reviewsRepository->findUnverifiedByEmailAndSchool($request->email, $schoolUuid);
        if ($existingUnverified) {
            $this->entityManager->remove($existingUnverified);
        }

        $course = null;
        if ($request->courseId && Uuid::isValid($request->courseId)) {
            $course = $this->coursesRepository->find(Uuid::fromString($request->courseId));
        }

        $review = new Reviews();
        $review->setId(Uuid::v4());
        $review->setSchool($school);
        $review->setFirstName($request->firstName);
        $review->setLastName($request->lastName);
        $review->setEmail($request->email);
        $review->setAuthor($request->firstName . ' ' . substr($request->lastName, 0, 1) . '.');
        $review->setRating($request->rating);
        $review->setText($request->comment);
        $review->setReviewDate(new \DateTime());
        $review->setCreatedAt(new \DateTimeImmutable());
        $review->setIsVerified(false);
        $review->setVerificationToken(Uuid::v4());
        $review->setTokenExpiresAt(new \DateTimeImmutable('+48 hours'));
        $review->setCourse($course);

        $this->entityManager->persist($review);
        $this->entityManager->flush();

        $this->reviewEmailService->sendVerificationEmail($review);

        return ['success' => true];
    }

    /**
     * @return array{success: bool, error?: string}
     */
    public function verifyReview(string $token): array
    {
        if (!Uuid::isValid($token)) {
            return ['success' => false, 'error' => 'Invalid verification token'];
        }

        $review = $this->reviewsRepository->findByVerificationToken(Uuid::fromString($token));

        if (!$review) {
            return ['success' => false, 'error' => 'Invalid or expired verification token'];
        }

        if ($review->isVerified()) {
            return ['success' => false, 'error' => 'Review has already been verified'];
        }

        if ($review->getTokenExpiresAt() < new \DateTimeImmutable()) {
            return ['success' => false, 'error' => 'Verification token has expired'];
        }

        $review->setIsVerified(true);
        $review->setVerifiedAt(new \DateTimeImmutable());
        $review->setVerificationToken(null);
        $review->setTokenExpiresAt(null);

        $this->entityManager->flush();

        // Update school rating with the new verified review
        $this->updateSchoolRating($review->getSchool());
        $this->entityManager->flush();

        return ['success' => true];
    }

    /**
     * @return array{success: bool, error?: string}
     */
    public function resendVerification(string $email, string $schoolId): array
    {
        if (!Uuid::isValid($schoolId)) {
            return ['success' => false, 'error' => 'Invalid school ID format'];
        }

        $review = $this->reviewsRepository->findUnverifiedByEmailAndSchool(
            $email,
            Uuid::fromString($schoolId)
        );

        if (!$review) {
            return ['success' => false, 'error' => 'No pending review found for this email and school'];
        }

        // Generate new token
        $review->setVerificationToken(Uuid::v4());
        $review->setTokenExpiresAt(new \DateTimeImmutable('+48 hours'));

        $this->entityManager->flush();

        $this->reviewEmailService->sendVerificationEmail($review);

        return ['success' => true];
    }
}
