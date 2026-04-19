<?php

namespace App\Entity;

use App\Repository\SchoolsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: SchoolsRepository::class)]
class Schools
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true, nullable: false)]
    #[Groups(['school:list', 'school:read', 'course:list', 'course:read'])]
    private ?Uuid $id = null;

    /** @var Collection<int, Courses> */
    #[ORM\OneToMany(targetEntity: Courses::class, mappedBy: 'school')]
    private Collection $courses;

    /** @var Collection<int, Reviews> */
    #[ORM\OneToMany(targetEntity: Reviews::class, mappedBy: 'school')]
    private Collection $reviews;

    #[ORM\Column(length: 50)]
    #[Groups(['school:list', 'school:read', 'course:list', 'course:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    #[Groups(['school:list', 'school:read', 'course:list', 'course:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['school:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $short_description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 0, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $price_range_min = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 0, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $price_range_max = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 2, scale: 1)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $rating = null;

    #[ORM\Column]
    #[Groups(['school:list', 'school:read'])]
    private ?int $review_count = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $address = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $website = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?string $phone = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $course_types = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $levels = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $schedule = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $features = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $pros = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:list', 'school:read'])]
    private ?array $cons = null;

    #[ORM\Column]
    #[Groups(['school:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['school:read'])]
    private ?\DateTimeImmutable $updated_at = null;

    public function __construct()
    {
        $this->courses = new ArrayCollection();
        $this->reviews = new ArrayCollection();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getShortDescription(): ?string
    {
        return $this->short_description;
    }

    public function setShortDescription(?string $short_description): static
    {
        $this->short_description = $short_description;

        return $this;
    }

    public function getPriceRangeMin(): ?string
    {
        return $this->price_range_min;
    }

    public function setPriceRangeMin(?string $price_range_min): static
    {
        $this->price_range_min = $price_range_min;

        return $this;
    }

    public function getPriceRangeMax(): ?string
    {
        return $this->price_range_max;
    }

    public function setPriceRangeMax(?string $price_range_max): static
    {
        $this->price_range_max = $price_range_max;

        return $this;
    }

    public function getRating(): ?string
    {
        return $this->rating;
    }

    public function setRating(string $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getReviewCount(): ?int
    {
        return $this->review_count;
    }

    public function setReviewCount(int $review_count): static
    {
        $this->review_count = $review_count;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCourseTypes(): ?array
    {
        return $this->course_types;
    }

    public function setCourseTypes(?array $course_types): static
    {
        $this->course_types = $course_types;

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

    public function getSchedule(): ?array
    {
        return $this->schedule;
    }

    public function setSchedule(?array $schedule): static
    {
        $this->schedule = $schedule;

        return $this;
    }

    public function getFeatures(): ?array
    {
        return $this->features;
    }

    public function setFeatures(?array $features): static
    {
        $this->features = $features;

        return $this;
    }

    public function getPros(): ?array
    {
        return $this->pros;
    }

    public function setPros(?array $pros): static
    {
        $this->pros = $pros;

        return $this;
    }

    public function getCons(): ?array
    {
        return $this->cons;
    }

    public function setCons(?array $cons): static
    {
        $this->cons = $cons;

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

    /** @return Collection<int, Courses> */
    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function addCourse(Courses $course): static
    {
        if (!$this->courses->contains($course)) {
            $this->courses->add($course);
            $course->setSchool($this);
        }

        return $this;
    }

    public function removeCourse(Courses $course): static
    {
        if ($this->courses->removeElement($course)) {
            if ($course->getSchool() === $this) {
                $course->setSchool(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, Reviews> */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Reviews $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setSchool($this);
        }

        return $this;
    }

    public function removeReview(Reviews $review): static
    {
        if ($this->reviews->removeElement($review)) {
            if ($review->getSchool() === $this) {
                $review->setSchool(null);
            }
        }

        return $this;
    }
}
