<?php

namespace App\Controller\Api;

use App\Dto\SubmitReviewRequest;
use App\Service\Api\ReviewService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ReviewController extends AbstractController
{
    public function __construct(
        private ReviewService $reviewService,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('/api/reviews/verify', name: 'app_reviews_verify', methods: ['GET'], priority: 20)]
    public function verifyReview(Request $request): JsonResponse
    {
        $token = $request->query->get('token');

        if (!$token) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Verification token is required',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->reviewService->verifyReview($token);

        if (!$result['success']) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => $result['error'],
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'errors' => false,
            'data' => null,
            'message' => 'Review verified successfully!',
        ], Response::HTTP_OK);
    }

    #[Route('/api/reviews/resend-verification', name: 'app_reviews_resend_verification', methods: ['POST'], priority: 15)]
    public function resendVerification(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $schoolId = $data['schoolId'] ?? null;

        if (!$email || !$schoolId) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Email and school ID are required',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->reviewService->resendVerification($email, $schoolId);

        if (!$result['success']) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => $result['error'],
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'errors' => false,
            'data' => null,
            'message' => 'Verification email has been resent. Please check your inbox.',
        ], Response::HTTP_OK);
    }

    #[Route('/api/reviews/search', name: 'app_reviews_search', methods: ['GET'], priority: 10)]
    public function search(Request $request): JsonResponse
    {
        $author = $request->query->get('author');
        $ratingMin = $request->query->get('rating_min');
        $ratingMax = $request->query->get('rating_max');
        $schoolSlug = $request->query->get('school');
        $dateFrom = $request->query->get('date_from');
        $dateTo = $request->query->get('date_to');
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $limit = min($limit, 100);
        $page = max($page, 1);

        $result = $this->reviewService->searchReviews(
            $author,
            $ratingMin !== null ? (int) $ratingMin : null,
            $ratingMax !== null ? (int) $ratingMax : null,
            $schoolSlug,
            $dateFrom,
            $dateTo,
            $page,
            $limit
        );

        $data = json_decode($this->serializer->serialize(iterator_to_array($result['data']), 'json', ['groups' => ['review:list']]), true);

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

    #[Route('/api/reviews', name: 'app_reviews', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $limit = min($limit, 100);
        $page = max($page, 1);

        $result = $this->reviewService->getAllReviews($page, $limit);
        $data = json_decode($this->serializer->serialize(iterator_to_array($result['data']), 'json', ['groups' => ['review:list']]), true);

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

    #[Route('/api/reviews', name: 'app_reviews_submit', methods: ['POST'])]
    public function submitReview(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $reviewRequest = new SubmitReviewRequest();
        $reviewRequest->firstName = $data['firstName'] ?? null;
        $reviewRequest->lastName = $data['lastName'] ?? null;
        $reviewRequest->email = $data['email'] ?? null;
        $reviewRequest->comment = $data['comment'] ?? null;
        $reviewRequest->schoolId = $data['schoolId'] ?? null;
        $reviewRequest->courseId = $data['courseId'] ?? null;
        $reviewRequest->rating = isset($data['rating']) ? (int) $data['rating'] : null;

        $errors = $this->validator->validate($reviewRequest);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return new JsonResponse([
                'errors' => true,
                'data' => $errorMessages,
                'message' => 'Validation failed',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->reviewService->submitReview($reviewRequest);

        if (!$result['success']) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => $result['error'],
            ], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse([
            'errors' => false,
            'data' => null,
            'message' => 'Review submitted. Please check your email to verify.',
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/reviews/{id}', name: 'app_review_by_id', methods: ['GET'])]
    public function getReviewById(string $id): JsonResponse
    {
        $review = $this->reviewService->getReviewById($id);

        if (!$review) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Review not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($this->serializer->serialize($review, 'json', ['groups' => ['review:read']]), true);

        return new JsonResponse([
            'errors' => false,
            'data' => $data,
        ], Response::HTTP_OK);
    }
}
