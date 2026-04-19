<?php

namespace App\Controller\Api;

use App\Dto\RecommendationRequest;
use App\Service\Api\RecommendationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RecommendationController extends AbstractController
{
    public function __construct(
        private RecommendationService $recommendationService,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('/api/recommendations', name: 'app_recommendations', methods: ['POST'])]
    public function getRecommendations(Request $request): JsonResponse
    {
        $content = $request->getContent();

        if (empty($content)) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Request body is required',
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $recommendationRequest = $this->serializer->deserialize(
                $content,
                RecommendationRequest::class,
                'json'
            );
        } catch (\Exception $e) {
            return new JsonResponse([
                'errors' => true,
                'data' => null,
                'message' => 'Invalid JSON format',
            ], Response::HTTP_BAD_REQUEST);
        }

        $violations = $this->validator->validate($recommendationRequest);

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

        $recommendations = $this->recommendationService->getRecommendations($recommendationRequest);

        $result = array_map(function ($recommendation) {
            $schoolData = json_decode(
                $this->serializer->serialize($recommendation['school'], 'json', ['groups' => ['school:list']]),
                true
            );

            return [
                'school' => $schoolData,
                'score' => $recommendation['score'],
                'matchPercentage' => $recommendation['matchPercentage'],
                'reasons' => $recommendation['reasons'],
            ];
        }, $recommendations);

        return new JsonResponse([
            'errors' => false,
            'recommendations' => $result,
        ], Response::HTTP_OK);
    }
}
