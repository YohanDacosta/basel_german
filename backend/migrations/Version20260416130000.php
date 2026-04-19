<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260416130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Increase duration_course column length to TEXT';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE courses MODIFY duration_course LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE courses MODIFY duration_course VARCHAR(255) DEFAULT NULL');
    }
}
