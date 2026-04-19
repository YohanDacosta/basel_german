<?php

namespace App\Command;

use App\Repository\SchoolsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:recalculate-school-stats',
    description: 'Recalculate school statistics (ratings and review counts) based on verified reviews',
)]
class RecalculateSchoolStatsCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SchoolsRepository $schoolsRepository,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Run without persisting to database')
            ->addOption('school', 's', InputOption::VALUE_OPTIONAL, 'Recalculate only for a specific school slug');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $dryRun = $input->getOption('dry-run');
        $schoolSlug = $input->getOption('school');

        if ($dryRun) {
            $io->note('Running in dry-run mode. No data will be persisted.');
        }

        $schools = $schoolSlug
            ? [$this->schoolsRepository->findOneBy(['slug' => $schoolSlug])]
            : $this->schoolsRepository->findAll();

        $schools = array_filter($schools);

        if (empty($schools)) {
            $io->error('No schools found.');
            return Command::FAILURE;
        }

        $io->title('Recalculating School Statistics');

        foreach ($schools as $school) {
            $io->section($school->getName());

            $reviews = $school->getReviews();
            $verifiedReviews = [];
            $totalRating = 0;

            foreach ($reviews as $review) {
                if ($review->isVerified() && $review->getRating() !== null) {
                    $verifiedReviews[] = $review;
                    $totalRating += $review->getRating();
                }
            }

            $reviewCount = count($verifiedReviews);
            $averageRating = $reviewCount > 0 ? round($totalRating / $reviewCount, 1) : null;

            $oldRating = $school->getRating();
            $oldCount = $school->getReviewCount();

            $io->table(
                ['', 'Rating', 'Review Count'],
                [
                    ['Old', $oldRating ?? 'NULL', $oldCount ?? 0],
                    ['New', $averageRating ?? 'NULL', $reviewCount],
                ]
            );

            if (!$dryRun) {
                $school->setRating($averageRating !== null ? (string) $averageRating : '0');
                $school->setReviewCount($reviewCount);
            }
        }

        if (!$dryRun) {
            $this->entityManager->flush();
            $io->success('School statistics updated successfully!');
        } else {
            $io->success('Dry run completed. No changes were made.');
        }

        return Command::SUCCESS;
    }
}
