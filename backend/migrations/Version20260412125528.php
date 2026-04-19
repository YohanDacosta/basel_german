<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260412125528 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE courses (id BINARY(16) NOT NULL, name VARCHAR(255) NOT NULL, levels JSON DEFAULT NULL, level_description VARCHAR(100) DEFAULT NULL, registration_deadline DATETIME DEFAULT NULL, duration_course VARCHAR(255) DEFAULT NULL, date_start DATETIME DEFAULT NULL, date_end DATETIME DEFAULT NULL, price VARCHAR(100) NOT NULL, lessons VARCHAR(100) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, school_id BINARY(16) DEFAULT NULL, INDEX IDX_A9A55A4CC32A47EE (school_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reviews (id BINARY(16) NOT NULL, author VARCHAR(100) NOT NULL, rating SMALLINT DEFAULT NULL, text LONGTEXT NOT NULL, review_date DATETIME NOT NULL, created_at DATETIME NOT NULL, school_id BINARY(16) DEFAULT NULL, user_id BINARY(16) NOT NULL, INDEX IDX_6970EB0FC32A47EE (school_id), INDEX IDX_6970EB0FA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id BINARY(16) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE courses ADD CONSTRAINT FK_A9A55A4CC32A47EE FOREIGN KEY (school_id) REFERENCES schools (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0FC32A47EE FOREIGN KEY (school_id) REFERENCES schools (id)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE courses DROP FOREIGN KEY FK_A9A55A4CC32A47EE');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0FC32A47EE');
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0FA76ED395');
        $this->addSql('DROP TABLE courses');
        $this->addSql('DROP TABLE reviews');
        $this->addSql('DROP TABLE user');
    }
}
