<?php

namespace App\Controller\Api;

use App\Service\Api\CourseService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class CourseController extends AbstractController
{
    public function __construct(
        private CourseService $courseService,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/api/courses/search', name: 'app_courses_search', methods: ['GET'], priority: 10)]
    public function search(Request $request): JsonResponse
    {
        $name = $request->query->get('name');
        $levels = $request->query->all('levels');
        $priceMin = $request->query->get('price_min');
        $priceMax = $request->query->get('price_max');
        $schoolSlug = $request->query->get('school');
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $limit = min($limit, 100);
        $page = max($page, 1);

        $result = $this->courseService->searchCourses(
            $name,
            !empty($levels) ? $levels : null,
            $priceMin,
            $priceMax,
            $schoolSlug,
            $page,
            $limit
        );

        $data = json_decode($this->serializer->serialize(iterator_to_array($result['data']), 'json', ['groups' => ['course:list']]), true);

        return new JsonResponse([
            'errors' => false,
            'data' => $data,
            'meta' => [
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit'],
                'pages' => $result['pages'],
            ],
        ], Response::HTTP_OK);
    }

    #[Route('/api/courses', name: 'app_courses', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $limit = min($limit, 100);
        $page = max($page, 1);

        $result = $this->courseService->getAllCourses($page, $limit);
        $data = json_decode($this->serializer->serialize(iterator_to_array($result['data']), 'json', ['groups' => ['course:list']]), true);

        return new JsonResponse([
            'errors' => false,
            'data' => $data,
            'meta' => [
                'total' => $result['total'],
                'page' => $result['page'],
                'limit' => $result['limit'],
                'pages' => $result['pages'],
            ],
        ], Response::HTTP_OK);
    }

    #[Route('/api/courses/{id}', name: 'app_course_by_id', methods: ['GET'])]
    public function getCourseById(string $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);

        if (!$course) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Course not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($this->serializer->serialize($course, 'json', ['groups' => ['course:read']]), true);

        return new JsonResponse([
            'errors' => false,
            'data' => $data,
        ], Response::HTTP_OK);
    }
}
