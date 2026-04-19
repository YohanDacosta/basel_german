<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260416140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add email verification fields to reviews table';
    }

    public function up(Schema $schema): void
    {
        // First add columns as nullable
        $this->addSql('ALTER TABLE reviews ADD first_name VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE reviews ADD last_name VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE reviews ADD email VARCHAR(180) DEFAULT NULL');
        $this->addSql('ALTER TABLE reviews ADD is_verified TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE reviews ADD verification_token BINARY(16) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE reviews ADD token_expires_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE reviews ADD verified_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE reviews ADD course_id BINARY(16) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE reviews MODIFY user_id BINARY(16) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');

        // Update existing reviews to be verified and set display names
        $this->addSql('UPDATE reviews SET is_verified = 1, first_name = author, last_name = \'\', email = \'legacy@example.com\' WHERE first_name IS NULL');

        // Now make the required columns NOT NULL
        $this->addSql('ALTER TABLE reviews MODIFY first_name VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE reviews MODIFY last_name VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE reviews MODIFY email VARCHAR(180) NOT NULL');

        $this->addSql('CREATE UNIQUE INDEX UNIQ_6970EB0FC1CC006B ON reviews (verification_token)');
        $this->addSql('ALTER TABLE reviews ADD CONSTRAINT FK_6970EB0F591CC992 FOREIGN KEY (course_id) REFERENCES courses (id)');
        $this->addSql('CREATE INDEX IDX_6970EB0F591CC992 ON reviews (course_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE reviews DROP FOREIGN KEY FK_6970EB0F591CC992');
        $this->addSql('DROP INDEX IDX_6970EB0F591CC992 ON reviews');
        $this->addSql('DROP INDEX UNIQ_6970EB0FC1CC006B ON reviews');
        $this->addSql('ALTER TABLE reviews DROP first_name');
        $this->addSql('ALTER TABLE reviews DROP last_name');
        $this->addSql('ALTER TABLE reviews DROP email');
        $this->addSql('ALTER TABLE reviews DROP is_verified');
        $this->addSql('ALTER TABLE reviews DROP verification_token');
        $this->addSql('ALTER TABLE reviews DROP token_expires_at');
        $this->addSql('ALTER TABLE reviews DROP verified_at');
        $this->addSql('ALTER TABLE reviews DROP course_id');
        $this->addSql('ALTER TABLE reviews MODIFY user_id BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\'');
    }
}
