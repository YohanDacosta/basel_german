<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateReviewRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 1, max: 100)]
    public ?string $author = null;

    #[Assert\NotNull]
    #[Assert\Range(min: 1, max: 5)]
    public ?int $rating = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 5000)]
    public ?string $text = null;

    #[Assert\NotBlank]
    #[Assert\Uuid]
    public ?string $userId = null;
}
