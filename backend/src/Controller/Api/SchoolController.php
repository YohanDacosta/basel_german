<?php

namespace App\Controller\Api;

use App\Dto\CreateReviewRequest;
use App\Service\Api\ReviewService;
use App\Service\Api\SchoolService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class SchoolController extends AbstractController
{
    public function __construct(
        private SchoolService $schoolService,
        private ReviewService $reviewService,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    /**
     * @throws ExceptionInterface
     */
    #[Route('/api/schools', name: 'app_schools', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $schools = $this->schoolService->getAllSchools();
        $data = json_decode($this->serializer->serialize($schools, 'json', ['groups' => ['school:list']]), true);

        return new JsonResponse(['errors' => false, 'data' => $data], Response::HTTP_OK);
    }

    /**
     * @throws ExceptionInterface
     */
    #[Route('/api/schools/{slug}', name: 'app_school_by_slug', methods: ['GET'])]
    public function getSchoolBySlug(string $slug): JsonResponse
    {
        $school = $this->schoolService->getSchoolBySlug($slug);

        if (!$school) {
            return new JsonResponse(['errors' => true, 'data' => null, 'message' => 'School not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($this->serializer->serialize($school, 'json', ['groups' => ['school:read']]), true);

        return new JsonResponse(['errors' => false, 'data' => $data], Response::HTTP_OK);
    }

    /**
     * @throws ExceptionInterface
     */
    #[Route('/api/schools/{slug}/courses', name: 'app_school_courses', methods: ['GET'])]
    public function getCoursesBySlug(string $slug): JsonResponse
    {
        $courses = $this->schoolService->getCoursesBySchoolSlug($slug);

        if ($courses === null) {
            return new JsonResponse(['errors' => true, 'data' => null, 'message' => 'School not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($this->serializer->serialize($courses, 'json', ['groups' => ['course:list']]), true);

        return new JsonResponse(['errors' => false, 'data' => $data], Response::HTTP_OK);
    }

    /**
     * @throws ExceptionInterface
     */
    #[Route('/api/schools/{slug}/reviews', name: 'app_school_reviews', methods: ['GET'])]
    public function getReviewsBySlug(string $slug): JsonResponse
    {
        $reviews = $this->schoolService->getReviewsBySchoolSlug($slug);

        if ($reviews === null) {
            return new JsonResponse(['errors' => true, 'data' => null, 'message' => 'School not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($this->serializer->serialize($reviews, 'json', ['groups' => ['review:list']]), true);

        return new JsonResponse(['errors' => false, 'data' => $data], Response::HTTP_OK);
    }

    #[Route('/api/schools/{slug}/reviews', name: 'app_school_reviews_create', methods: ['POST'])]
    public function createReview(string $slug, Request $request): JsonResponse
    {
        $school = $this->schoolService->getSchoolBySlug($slug);

        if (!$school) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'School not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $content = $request->getContent();

        if (empty($content)) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Request body is required',
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $createReviewRequest = $this->serializer->deserialize(
                $content,
                CreateReviewRequest::class,
                'json'
            );
        } catch (\Exception $e) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Invalid JSON format',
            ], Response::HTTP_BAD_REQUEST);
        }

        $violations = $this->validator->validate($createReviewRequest);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }

            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Validation failed',
                'validationErrors' => $errors,
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->reviewService->createReview($school, $createReviewRequest);

        if (!$result['success']) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => $result['error'],
            ], Response::HTTP_BAD_REQUEST);
        }

        $data = json_decode($this->serializer->serialize($result['review'], 'json', ['groups' => ['review:read']]), true);

        return new JsonResponse([
            'errors' => false,
            'data' => $data,
            'message' => 'Review created successfully',
        ], Response::HTTP_CREATED);
    }
}
