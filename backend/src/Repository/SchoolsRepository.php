<?php

namespace App\Repository;

use App\Entity\Schools;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Schools>
 */
class SchoolsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Schools::class);
    }

    public function getCourseBySlug(string $slug): ?Schools
    {
        return $this-$this->createQueryBuilder('s')
            ->leftJoin('s.courses', 'c')
            ->where('c.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return Schools[] Returns an array of Schools objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Schools
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
