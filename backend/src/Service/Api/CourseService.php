<?php

namespace App\Service\Api;

use App\Entity\Courses;
use App\Repository\CoursesRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Component\Uid\Uuid;

class CourseService
{
    public function __construct(private CoursesRepository $coursesRepository)
    {
    }

    /**
     * @return array{data: Paginator<Courses>, total: int, page: int, limit: int, pages: int}
     */
    public function getAllCourses(int $page = 1, int $limit = 10): array
    {
        $paginator = $this->coursesRepository->findPaginated($page, $limit);
        $total = count($paginator);

        return [
            'data' => $paginator,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => (int) ceil($total / $limit),
        ];
    }

    public function getCourseById(string $id): ?Courses
    {
        if (!Uuid::isValid($id)) {
            return null;
        }

        return $this->coursesRepository->findByUuid(Uuid::fromString($id));
    }

    /**
     * @return array{data: Paginator<Courses>, total: int, page: int, limit: int, pages: int}
     */
    public function searchCourses(
        ?string $name = null,
        ?array $levels = null,
        ?string $priceMin = null,
        ?string $priceMax = null,
        ?string $schoolSlug = null,
        int $page = 1,
        int $limit = 10
    ): array {
        $paginator = $this->coursesRepository->search(
            $name,
            $levels,
            $priceMin,
            $priceMax,
            $schoolSlug,
            $page,
            $limit
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
}
