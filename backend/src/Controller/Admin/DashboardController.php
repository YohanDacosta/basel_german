<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public function index(): Response
    {
        return $this->redirect('admin/schools');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('German School in Basel');
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::section('Schools'),
            MenuItem::linkToDashboard('Schools', 'fa fa-home'),

            MenuItem::section('Courses'),
            MenuItem::linkTo(CoursesCrudController::class, 'Courses', 'fas fa-file'),

            MenuItem::section('Reviews'),
            MenuItem::linkTo(ReviewsCrudController::class, 'Reviews', 'fas fa-comments'),
        ];
        // yield MenuItem::linkTo(SomeCrudController::class, 'The Label', 'fas fa-list');
    }
}
