<?php

namespace App\Entity;

use App\Repository\CoursesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: CoursesRepository::class)]
class Courses
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true, nullable: false)]
    #[Groups(['course:list', 'course:read'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'courses')]
    #[Groups(['course:list', 'course:read'])]
    private ?Schools $school = null;

    #[ORM\Column(length: 255)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?array $levels = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $level_description = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?\DateTime $registration_deadline = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $duration_course = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?\DateTime $date_start = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?\DateTime $date_end = null;

    #[ORM\Column(length: 100)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $price = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $lessons = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $link = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['course:list', 'course:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['course:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['course:read'])]
    private ?\DateTimeImmutable $updated_at = null;

    public function getId(): ?Uuid
    {
        return $this->id;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLevels(): ?array
    {
        return $this->levels;
    }

    public function setLevels(?array $levels): static
    {
        $this->levels = $levels;

        return $this;
    }

    public function getLevelDescription(): ?string
    {
        return $this->level_description;
    }

    public function setLevelDescription(?string $level_description): static
    {
        $this->level_description = $level_description;

        return $this;
    }

    public function getRegistrationDeadline(): ?\DateTime
    {
        return $this->registration_deadline;
    }

    public function setRegistrationDeadline(?\DateTime $registration_deadline): static
    {
        $this->registration_deadline = $registration_deadline;

        return $this;
    }

    public function getDurationCourse(): ?string
    {
        return $this->duration_course;
    }

    public function setDurationCourse(?string $duration_course): static
    {
        $this->duration_course = $duration_course;

        return $this;
    }

    public function getDateStart(): ?\DateTime
    {
        return $this->date_start;
    }

    public function setDateStart(?\DateTime $date_start): static
    {
        $this->date_start = $date_start;

        return $this;
    }

    public function getDateEnd(): ?\DateTime
    {
        return $this->date_end;
    }

    public function setDateEnd(?\DateTime $date_end): static
    {
        $this->date_end = $date_end;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getLessons(): ?string
    {
        return $this->lessons;
    }

    public function setLessons(?string $lessons): static
    {
        $this->lessons = $lessons;

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
