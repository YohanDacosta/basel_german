<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class SubmitReviewRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 50)]
    public ?string $firstName = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 50)]
    public ?string $lastName = null;

    #[Assert\NotBlank]
    #[Assert\Email]
    public ?string $email = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 5000)]
    public ?string $comment = null;

    #[Assert\NotBlank]
    #[Assert\Uuid]
    public ?string $schoolId = null;

    #[Assert\Uuid]
    public ?string $courseId = null;

    #[Assert\NotNull]
    #[Assert\Range(min: 1, max: 5)]
    public ?int $rating = null;
}
