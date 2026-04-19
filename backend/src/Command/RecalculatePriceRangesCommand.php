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
    name: 'app:recalculate-price-ranges',
    description: 'Recalculate price ranges for all schools based on their course prices',
)]
class RecalculatePriceRangesCommand extends Command
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

        $io->title('Recalculating Price Ranges');

        foreach ($schools as $school) {
            $io->section($school->getName());

            $courses = $school->getCourses();
            $allPrices = [];

            foreach ($courses as $course) {
                $priceString = $course->getPrice();
                if (!$priceString) {
                    continue;
                }

                $prices = $this->extractPrices($priceString);
                $allPrices = array_merge($allPrices, $prices);
            }

            if (empty($allPrices)) {
                $io->warning(sprintf('No valid prices found for %s', $school->getName()));
                continue;
            }

            $minPrice = min($allPrices);
            $maxPrice = max($allPrices);

            $oldMin = $school->getPriceRangeMin();
            $oldMax = $school->getPriceRangeMax();

            $io->table(
                ['', 'Min', 'Max'],
                [
                    ['Old', $oldMin ?? 'NULL', $oldMax ?? 'NULL'],
                    ['New', $minPrice, $maxPrice],
                ]
            );

            if (!$dryRun) {
                $school->setPriceRangeMin((string) $minPrice);
                $school->setPriceRangeMax((string) $maxPrice);
            }

            $io->text(sprintf(
                'Found %d prices from %d courses. Range: CHF %d - %d',
                count($allPrices),
                count($courses),
                $minPrice,
                $maxPrice
            ));
        }

        if (!$dryRun) {
            $this->entityManager->flush();
            $io->success('Price ranges updated successfully!');
        } else {
            $io->success('Dry run completed. No changes were made.');
        }

        return Command::SUCCESS;
    }

    /**
     * Extract numeric prices from a price string
     * Handles formats like:
     * - "CHF 90.– bis 440.–"
     * - "CHF 90.– bis CHF 440.–"
     * - "CHF 150.–"
     * - "CHF 1'240.–" (with apostrophe for thousands)
     * - "CHF 130.- bis CHF 1'160.–"
     * - "CHF 318.50 - 455.00" (with decimals)
     *
     * @return int[]
     */
    private function extractPrices(string $priceString): array
    {
        $prices = [];

        // Remove "CHF" and normalize - remove thousand separators (apostrophe, right single quote)
        $normalized = str_replace('CHF', '', $priceString);
        $normalized = preg_replace("/['\\x{2019}]/u", '', $normalized);

        // Match prices: integers or decimals (e.g., 318.50, 455.00, 90, 1240)
        // This captures the full number including decimals
        preg_match_all('/(\d+)(?:\.(\d{2}))?/', $normalized, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $integerPart = (int) $match[1];

            // If there's a decimal part (like .50), it's a price with cents
            // If the decimal is .– or .- it's just formatting, treat as integer
            if (isset($match[2]) && is_numeric($match[2])) {
                // It's a decimal price like 318.50 - round to nearest integer
                $price = (int) round($integerPart + ((int) $match[2] / 100));
            } else {
                $price = $integerPart;
            }

            // Only include reasonable prices (> 10 CHF to avoid capturing small numbers)
            if ($price >= 10) {
                $prices[] = $price;
            }
        }

        return array_unique($prices);
    }
}
