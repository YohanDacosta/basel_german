<?php

namespace App\Entity;

use App\Repository\ReviewsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ReviewsRepository::class)]
class Reviews
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true, nullable: false)]
    #[Groups(['review:list', 'review:read'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    private ?Schools $school = null;

    #[ORM\Column(length: 100)]
    #[Groups(['review:list', 'review:read'])]
    private ?string $author = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['review:list', 'review:read'])]
    private ?int $rating = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['review:list', 'review:read'])]
    private ?string $text = null;

    #[ORM\Column]
    #[Groups(['review:list', 'review:read'])]
    private ?\DateTime $review_date = null;

    #[ORM\Column]
    #[Groups(['review:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $user = null;

    #[ORM\Column(length: 50)]
    private ?string $first_name = null;

    #[ORM\Column(length: 50)]
    private ?string $last_name = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $is_verified = false;

    #[ORM\Column(type: 'uuid', unique: true, nullable: true)]
    private ?Uuid $verification_token = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $token_expires_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $verified_at = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Courses $course = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function setId(Uuid $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getSchool(): ?Schools
    {
        return $this->school;
    }

    public function setSchool(?Schools $school): static
    {
        $this->school = $school;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getReviewDate(): ?\DateTime
    {
        return $this->review_date;
    }

    public function setReviewDate(\DateTime $review_date): static
    {
        $this->review_date = $review_date;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): static
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): static
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->is_verified;
    }

    public function setIsVerified(bool $is_verified): static
    {
        $this->is_verified = $is_verified;

        return $this;
    }

    public function getVerificationToken(): ?Uuid
    {
        return $this->verification_token;
    }

    public function setVerificationToken(?Uuid $verification_token): static
    {
        $this->verification_token = $verification_token;

        return $this;
    }

    public function getTokenExpiresAt(): ?\DateTimeImmutable
    {
        return $this->token_expires_at;
    }

    public function setTokenExpiresAt(?\DateTimeImmutable $token_expires_at): static
    {
        $this->token_expires_at = $token_expires_at;

        return $this;
    }

    public function getVerifiedAt(): ?\DateTimeImmutable
    {
        return $this->verified_at;
    }

    public function setVerifiedAt(?\DateTimeImmutable $verified_at): static
    {
        $this->verified_at = $verified_at;

        return $this;
    }

    public function getCourse(): ?Courses
    {
        return $this->course;
    }

    public function setCourse(?Courses $course): static
    {
        $this->course = $course;

        return $this;
    }

    public function getDisplayAuthor(): string
    {
        if ($this->first_name && $this->last_name) {
            return $this->first_name . ' ' . substr($this->last_name, 0, 1) . '.';
        }
        return $this->author ?? 'Anonymous';
    }
}
