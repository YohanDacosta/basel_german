<?php

namespace App\Service\Api;

use App\Entity\Schools;
use App\Repository\SchoolsRepository;
use Doctrine\Common\Collections\Collection;

class SchoolService
{
    public function __construct(private SchoolsRepository $schoolRepository)
    {
    }

    public function getAllSchools(): array
    {
        return $this->schoolRepository->findAll();
    }

    public function getSchoolBySlug(string $slug): ?Schools
    {
        return $this->schoolRepository->findOneBy(['slug' => $slug]);
    }

    public function getCoursesBySchoolSlug(string $slug): ?Collection
    {
        $school = $this->schoolRepository->findOneBy(['slug' => $slug]);

        return $school?->getCourses();
    }

    public function getReviewsBySchoolSlug(string $slug): ?Collection
    {
        $school = $this->schoolRepository->findOneBy(['slug' => $slug]);

        return $school?->getReviews();
    }
}
