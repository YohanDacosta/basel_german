<?php

namespace App\Command;

use App\Entity\Courses;
use App\Entity\Schools;
use App\Repository\CoursesRepository;
use App\Repository\SchoolsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Uid\Uuid;

#[AsCommand(
    name: 'app:import-courses',
    description: 'Import courses from JSON files into the database',
)]
class ImportCoursesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SchoolsRepository $schoolsRepository,
        private CoursesRepository $coursesRepository,
        private string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('school', 's', InputOption::VALUE_OPTIONAL, 'Import only courses from a specific school slug (derived from filename, e.g. ecap, k5)')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Run without persisting to database')
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'Force re-import even if school already has courses');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $dryRun = $input->getOption('dry-run');
        $force = $input->getOption('force');
        $schoolFilter = $input->getOption('school');

        if ($dryRun) {
            $io->note('Running in dry-run mode. No data will be persisted.');
        }

        $resourcesDir = $this->projectDir . '/resources';
        $allFiles = $this->discoverSchoolFiles($resourcesDir);

        if (empty($allFiles)) {
            $io->warning('No courses-*.json files found in ' . $resourcesDir);
            return Command::SUCCESS;
        }

        $filesToProcess = $allFiles;
        if ($schoolFilter) {
            if (!isset($allFiles[$schoolFilter])) {
                $io->error(sprintf('Unknown school: %s. Available: %s', $schoolFilter, implode(', ', array_keys($allFiles))));
                return Command::FAILURE;
            }
            $filesToProcess = [$schoolFilter => $allFiles[$schoolFilter]];
        }
        $totalImported = 0;
        $totalSkipped = 0;
        $errors = [];

        foreach ($filesToProcess as $schoolSlug => $filename) {
            $io->section(sprintf('Processing %s (%s)', $schoolSlug, $filename));

            $school = $this->schoolsRepository->findOneBy(['slug' => $schoolSlug]);
            if (!$school) {
                $errors[] = sprintf('School with slug "%s" not found in database', $schoolSlug);
                $io->warning(sprintf('School "%s" not found. Skipping...', $schoolSlug));
                continue;
            }

            $existingCount = $this->coursesRepository->countBySchool($school);
            if ($existingCount > 0 && !$force) {
                $io->warning(sprintf(
                    'Skipping "%s" — already has %d course(s) in database. Use --force to re-import.',
                    $schoolSlug,
                    $existingCount
                ));
                $totalSkipped++;
                continue;
            }

            $filePath = $resourcesDir . '/' . $filename;
            if (!file_exists($filePath)) {
                $errors[] = sprintf('File not found: %s', $filePath);
                $io->warning(sprintf('File "%s" not found. Skipping...', $filename));
                continue;
            }

            $jsonContent = file_get_contents($filePath);
            $coursesData = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors[] = sprintf('Invalid JSON in %s: %s', $filename, json_last_error_msg());
                $io->warning(sprintf('Invalid JSON in "%s". Skipping...', $filename));
                continue;
            }

            $importedCount = 0;
            foreach ($coursesData as $courseData) {
                $course = $this->createCourseFromData($courseData, $school);

                if (!$dryRun) {
                    $this->entityManager->persist($course);
                }

                $importedCount++;
            }

            if (!$dryRun) {
                $this->entityManager->flush();
            }

            $io->success(sprintf('Imported %d course(s) from %s', $importedCount, $schoolSlug));
            $totalImported += $importedCount;
        }

        if (!empty($errors)) {
            $io->warning('The following errors occurred:');
            foreach ($errors as $error) {
                $io->text('  - ' . $error);
            }
        }

        $io->success(sprintf(
            'Import complete. Imported: %d course(s) | Skipped schools (already imported): %d',
            $totalImported,
            $totalSkipped
        ));

        return Command::SUCCESS;
    }

    private function discoverSchoolFiles(string $resourcesDir): array
    {
        $map = [];
        foreach (glob($resourcesDir . '/courses-*.json') ?: [] as $filePath) {
            $filename = basename($filePath);
            $slug = substr($filename, strlen('courses-'), -strlen('.json'));
            $map[$slug] = $filename;
        }
        ksort($map);
        return $map;
    }

    private function createCourseFromData(array $data, Schools $school): Courses
    {
        $course = new Courses();

        // Use reflection to set the UUID
        $reflection = new \ReflectionClass($course);
        $idProperty = $reflection->getProperty('id');
        $idProperty->setValue($course, Uuid::v4());

        $course->setSchool($school);
        $course->setName($data['title'] ?? '');
        $course->setLink($data['link'] ?? null);
        $course->setDescription($data['description'] ?? null);
        $course->setLevelDescription($data['level'] ?? null);
        $course->setLevels($this->parseLevels($data['level'] ?? null));
        $course->setPrice($data['price'] ?? '');
        $course->setLessons($data['lessons'] ?? null);
        $course->setDurationCourse($this->parseSchedule($data['schedule'] ?? null));

        $dates = $this->parseDates($data['dates'] ?? null);
        $course->setDateStart($dates['start']);
        $course->setDateEnd($dates['end']);

        $course->setCreatedAt(new \DateTimeImmutable());

        return $course;
    }

    private function parseLevels(?string $levelString): ?array
    {
        if ($levelString === null || trim($levelString) === '') {
            return null;
        }

        $levels = [];
        // Split by comma and clean up
        $parts = preg_split('/[,\s]+/', $levelString);

        foreach ($parts as $part) {
            $part = trim($part);
            if ($part === '') {
                continue;
            }

            // Extract the base level (A1, A2, B1, B2, C1, C2)
            if (preg_match('/^([ABC][12])/i', $part, $matches)) {
                $level = strtolower($matches[1]);
                if (!in_array($level, $levels)) {
                    $levels[] = $level;
                }
            }
        }

        return empty($levels) ? null : $levels;
    }

    private function parseDates(?string $dateString): array
    {
        $result = ['start' => null, 'end' => null];

        if ($dateString === null || trim($dateString) === '') {
            return $result;
        }

        // Format: "DD.MM.YYYY - DD.MM.YYYY" or "DD.MM.YYYY"
        $parts = explode(' - ', $dateString);

        if (count($parts) >= 1) {
            $result['start'] = $this->parseDate(trim($parts[0]));
        }

        if (count($parts) >= 2) {
            $result['end'] = $this->parseDate(trim($parts[1]));
        }

        return $result;
    }

    private function parseDate(string $dateStr): ?\DateTime
    {
        // Handle potential typos like "17.08.20265"
        $dateStr = preg_replace('/(\d{2}\.\d{2}\.\d{4})\d+/', '$1', $dateStr);

        $date = \DateTime::createFromFormat('d.m.Y', $dateStr);
        if ($date === false) {
            return null;
        }

        // Reset time to midnight
        $date->setTime(0, 0, 0);

        return $date;
    }

    private function parseSchedule(?array $schedule): ?string
    {
        if ($schedule === null || empty($schedule)) {
            return null;
        }

        // Filter out "ODER" entries and join with " | "
        $filtered = array_filter($schedule, fn($s) => trim($s) !== 'ODER');

        return implode(' | ', array_map('trim', $filtered));
    }
}
