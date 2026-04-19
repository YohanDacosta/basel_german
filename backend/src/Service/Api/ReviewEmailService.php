<?php

namespace App\Service\Api;

use App\Entity\Reviews;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class ReviewEmailService
{
    public function __construct(
        private MailerInterface $mailer,
        private string $emailFrom,
        private string $emailFromName,
        private string $frontendBaseUrl
    ) {
    }

    public function sendVerificationEmail(Reviews $review): void
    {
        $verificationUrl = sprintf(
            '%s/verify-review?token=%s',
            rtrim($this->frontendBaseUrl, '/'),
            $review->getVerificationToken()->toRfc4122()
        );

        $email = (new TemplatedEmail())
            ->from(new Address($this->emailFrom, $this->emailFromName))
            ->to($review->getEmail())
            ->subject('Verify your review for ' . $review->getSchool()->getName())
            ->htmlTemplate('emails/review_verification.html.twig')
            ->context([
                'firstName' => $review->getFirstName(),
                'schoolName' => $review->getSchool()->getName(),
                'verificationUrl' => $verificationUrl,
                'expiresAt' => $review->getTokenExpiresAt(),
            ]);

        $this->mailer->send($email);
    }
}
