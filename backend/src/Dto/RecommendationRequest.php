<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class RecommendationRequest
{
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['fulltime', 'parttime', 'no'])]
    public ?string $isWorking = null;

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['mornings', 'afternoons', 'evenings', 'weekends'])]
    public ?string $timeAvailable = null;

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['integration', 'career', 'certificate', 'conversation'])]
    public ?string $goal = null;

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['none', 'alpha', 'a1', 'a2', 'b1', 'b2'])]
    public ?string $currentLevel = null;

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['low', 'medium', 'high'])]
    public ?string $budget = null;

    #[Assert\NotNull]
    #[Assert\Type('bool')]
    public ?bool $hasChildren = null;
}
