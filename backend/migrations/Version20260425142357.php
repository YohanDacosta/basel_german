<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260425142357 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE courses (id BINARY(16) NOT NULL, name VARCHAR(255) NOT NULL, levels JSON DEFAULT NULL, level_description VARCHAR(100) DEFAULT NULL, registration_deadline DATETIME DEFAULT NULL, duration_course LONGTEXT DEFAULT NULL, date_start DATETIME DEFAULT NULL, date_end DATETIME DEFAULT NULL, price VARCHAR(100) NOT NULL, lessons VARCHAR(100) DEFAULT NULL, link VARCHAR(500) DEFAULT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, school_id BINARY(16) DEFAULT NULL, INDEX IDX_A9A55A4CC32A47EE (school_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reviews (id BINARY(16) NOT NULL, author VARCHAR(100) NOT NULL, rating SMALLINT DEFAULT NULL, text LONGTEXT NOT NULL, review_date DATETIME NOT NULL, created_at DATETIME NOT NULL, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(180) NOT NULL, is_verified TINYINT DEFAULT 0 NOT NULL, verification_token BINARY(16) DEFAULT NULL, token_expires_at DATETIME DEFAULT NULL, verified_at DATETIME DEFAULT NULL, school_id BINARY(16) DEFAULT NULL, user_id BINARY(16) DEFAULT NULL, course_id BINARY(16) DEFAULT NULL, UNIQUE INDEX UNIQ_6970EB0FC1CC006B (verification_token), INDEX IDX_6970EB0FC32A47EE (school_id), INDEX IDX_6970EB0FA76ED395 (user_id), INDEX IDX_6970EB0F591CC992 (course_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE schools (id BINARY(16) NOT NULL, slug VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, short_description VARCHAR(500) DEFAULT NULL, price_range_min NUMERIC(10, 0) DEFAULT NULL, price_range_max NUMERIC(10, 0) DEFAULT NULL, rating NUMERIC(2, 1) NOT NULL, review_count INT NOT NULL, address VARCHAR(500) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, phone VARCHAR(50) DEFAULT NULL, course_types JSON DEFAULT NULL, levels JSON DEFAULT NULL, schedule JSON DEFAULT NULL, features JSON DEFAULT NULL, pros JSON DEFAULT NULL, cons JSON DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id BINARY(16) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE courses ADD CONSTRAINT FK_A9A55A4CC32A47EE FOREIGN KEY (school_id) REFERENCES schools (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0FC32A47EE FOREIGN KEY (school_id) REFERENCES schools (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0F591CC992 FOREIGN KEY (course_id) REFERENCES courses (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courses DROP FOREIGN KEY FK_A9A55A4CC32A47EE');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0FC32A47EE');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0FA76ED395');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0F591CC992');
        $this->addSql('DROP TABLE courses');
        $this->addSql('DROP TABLE reviews');
        $this->addSql('DROP TABLE schools');
        $this->addSql('DROP TABLE user');
    }
}
