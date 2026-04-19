<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260416120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add link and description fields to courses table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE courses ADD link VARCHAR(500) DEFAULT NULL, ADD description LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE courses DROP link, DROP description');
    }
}
