<?php

namespace App\Repository;

use App\Entity\Reviews;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Reviews>
 */
class ReviewsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reviews::class);
    }

    public function findPaginated(int $page = 1, int $limit = 10): Paginator
    {
        $query = $this->createQueryBuilder('r')
            ->orderBy('r.review_date', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        return new Paginator($query);
    }

    public function findVerifiedPaginated(int $page = 1, int $limit = 10): Paginator
    {
        $query = $this->createQueryBuilder('r')
            ->andWhere('r.is_verified = :verified')
            ->setParameter('verified', true)
            ->orderBy('r.review_date', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        return new Paginator($query);
    }

    public function findByUuid(Uuid $uuid): ?Reviews
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.id = :id')
            ->setParameter('id', $uuid->toBinary())
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByVerificationToken(Uuid $token): ?Reviews
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.verification_token = :token')
            ->setParameter('token', $token->toBinary())
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findUnverifiedByEmailAndSchool(string $email, Uuid $schoolId): ?Reviews
    {
        return $this->createQueryBuilder('r')
            ->leftJoin('r.school', 's')
            ->andWhere('r.email = :email')
            ->andWhere('s.id = :schoolId')
            ->andWhere('r.is_verified = :verified')
            ->setParameter('email', $email)
            ->setParameter('schoolId', $schoolId->toBinary())
            ->setParameter('verified', false)
            ->orderBy('r.created_at', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function hasRecentReview(string $email, Uuid $schoolId, int $days = 30): bool
    {
        $cutoffDate = new \DateTimeImmutable("-{$days} days");

        $result = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->leftJoin('r.school', 's')
            ->andWhere('r.email = :email')
            ->andWhere('s.id = :schoolId')
            ->andWhere('r.is_verified = :verified')
            ->andWhere('r.created_at >= :cutoffDate')
            ->setParameter('email', $email)
            ->setParameter('schoolId', $schoolId->toBinary())
            ->setParameter('verified', true)
            ->setParameter('cutoffDate', $cutoffDate)
            ->getQuery()
            ->getSingleScalarResult();

        return (int) $result > 0;
    }

    /**
     * @return Paginator<Reviews>
     */
    public function search(
        ?string $author = null,
        ?int $ratingMin = null,
        ?int $ratingMax = null,
        ?string $schoolSlug = null,
        ?\DateTime $dateFrom = null,
        ?\DateTime $dateTo = null,
        int $page = 1,
        int $limit = 10,
        bool $verifiedOnly = true
    ): Paginator {
        $qb = $this->createQueryBuilder('r')
            ->leftJoin('r.school', 's');

        if ($verifiedOnly) {
            $qb->andWhere('r.is_verified = :verified')
                ->setParameter('verified', true);
        }

        if ($author !== null) {
            $qb->andWhere('r.author LIKE :author')
                ->setParameter('author', '%' . $author . '%');
        }

        if ($ratingMin !== null) {
            $qb->andWhere('r.rating >= :ratingMin')
                ->setParameter('ratingMin', $ratingMin);
        }

        if ($ratingMax !== null) {
            $qb->andWhere('r.rating <= :ratingMax')
                ->setParameter('ratingMax', $ratingMax);
        }

        if ($schoolSlug !== null) {
            $qb->andWhere('s.slug = :schoolSlug')
                ->setParameter('schoolSlug', $schoolSlug);
        }

        if ($dateFrom !== null) {
            $qb->andWhere('r.review_date >= :dateFrom')
                ->setParameter('dateFrom', $dateFrom);
        }

        if ($dateTo !== null) {
            $qb->andWhere('r.review_date <= :dateTo')
                ->setParameter('dateTo', $dateTo);
        }

        $qb->orderBy('r.review_date', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new Paginator($qb->getQuery());
    }
}
