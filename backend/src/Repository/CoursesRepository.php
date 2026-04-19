<?php

namespace App\Repository;

use App\Entity\Courses;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Courses>
 */
class CoursesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Courses::class);
    }

    public function findPaginated(int $page = 1, int $limit = 10): Paginator
    {
        $query = $this->createQueryBuilder('c')
            ->orderBy('c.created_at', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        return new Paginator($query);
    }

    public function findByUuid(Uuid $uuid): ?Courses
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.id = :id')
            ->setParameter('id', $uuid->toBinary())
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @return Paginator<Courses>
     */
    public function search(
        ?string $name = null,
        ?array $levels = null,
        ?string $priceMin = null,
        ?string $priceMax = null,
        ?string $schoolSlug = null,
        int $page = 1,
        int $limit = 10
    ): Paginator {
        $qb = $this->createQueryBuilder('c')
            ->leftJoin('c.school', 's');

        if ($name !== null) {
            $qb->andWhere('c.name LIKE :name')
                ->setParameter('name', '%' . $name . '%');
        }

        if ($levels !== null && count($levels) > 0) {
            $orX = $qb->expr()->orX();
            foreach ($levels as $index => $level) {
                $orX->add("JSON_CONTAINS(c.levels, :level{$index}) = 1");
                $qb->setParameter("level{$index}", json_encode($level));
            }
            $qb->andWhere($orX);
        }

        if ($priceMin !== null) {
            $qb->andWhere('CAST(c.price AS DECIMAL) >= :priceMin')
                ->setParameter('priceMin', $priceMin);
        }

        if ($priceMax !== null) {
            $qb->andWhere('CAST(c.price AS DECIMAL) <= :priceMax')
                ->setParameter('priceMax', $priceMax);
        }

        if ($schoolSlug !== null) {
            $qb->andWhere('s.slug = :schoolSlug')
                ->setParameter('schoolSlug', $schoolSlug);
        }

        $qb->orderBy('c.created_at', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new Paginator($qb->getQuery());
    }
}
