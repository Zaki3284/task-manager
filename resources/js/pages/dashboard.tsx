import { Head } from '@inertiajs/react';
import { FaProjectDiagram, FaTasks, FaUsers } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DashboardProps = {
    counts: {
        projects: number;
        tasks: number;
        users: number;
    };
};

export default function Dashboard({ counts }: DashboardProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />

            <div className="container-fluid py-4">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="h3 mb-2">{t('dashboard')}</h1>
                    <p className="text-muted">{t('overview')}</p>
                </div>

                {/* Statistics Cards */}
                <div className="row g-4 mb-4">
                    {/* Projects Card */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaProjectDiagram size={30} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold">{counts.projects}</h3>
                                    <p className="text-muted mb-0">{t('projects')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Card */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaTasks size={30} className="text-success" />
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold">{counts.tasks}</h3>
                                    <p className="text-muted mb-0">{t('tasks')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Card */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaUsers size={30} className="text-info" />
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold">{counts.users}</h3>
                                    <p className="text-muted mb-0">{t('users')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h2 className="h4 mb-3">{t('welcome_message')}</h2>
                                <p className="text-muted mb-0">
                                    {t('dashboard_description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}