<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260412105323 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE schools (id BINARY(16) NOT NULL, slug VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, short_description VARCHAR(500) DEFAULT NULL, price_range_min NUMERIC(10, 0) DEFAULT NULL, price_range_max NUMERIC(10, 0) DEFAULT NULL, rating NUMERIC(2, 1) NOT NULL, review_count INT NOT NULL, address VARCHAR(500) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, phone VARCHAR(50) DEFAULT NULL, course_types JSON DEFAULT NULL, levels JSON DEFAULT NULL, schedule JSON DEFAULT NULL, features JSON DEFAULT NULL, pros JSON DEFAULT NULL, cons JSON DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE schools');
    }
}
