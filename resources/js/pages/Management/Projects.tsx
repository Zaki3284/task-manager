import { Head, useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import AppLayout from '@/layouts/app-layout'
import { useTranslation } from '@/hooks/useTranslation'
import type { BreadcrumbItem } from '@/types'
import 'bootstrap/dist/css/bootstrap.min.css'

type ProjectStatus = 'Pending' | 'Ongoing' | 'Completed'

type Project = {
    id: number
    name: string
    description: string | null
    status: ProjectStatus
}

type ProjectFormData = {
    name: string
    description: string
    status: ProjectStatus
}

type PageProps = {
    projects: Project[]
}

export default function Projects({ projects }: PageProps) {
    const { t, dir } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const { flash } = usePage().props as any

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('projects'), href: '/projects' },
    ]

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm<ProjectFormData>({
        name: '',
        description: '',
        status: 'Pending',
    })

    useEffect(() => {
        if (flash?.success) {
            console.log('Success:', flash.success)
        }
        if (flash?.error) {
            console.error('Error:', flash.error)
        }
    }, [flash])

    const openModal = (project: Project | null = null) => {
        clearErrors()
        if (project) {
            setEditingProject(project)
            setData({
                name: project.name,
                description: project.description ?? '',
                status: project.status,
            })
        } else {
            setEditingProject(null)
            reset()
        }
        setModalOpen(true)
    }

    const closeModal = () => {
        reset()
        clearErrors()
        setEditingProject(null)
        setModalOpen(false)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (editingProject) {
            put(`/projects/${editingProject.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal()
                },
                onError: (errors) => {
                    console.error('Update errors:', errors)
                }
            })
        } else {
            post('/projects', {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal()
                },
                onError: (errors) => {
                    console.error('Create errors:', errors)
                }
            })
        }
    }

    const deleteProject = (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            destroy(`/projects/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Project deleted successfully')
                }
            })
        }
    }

    const getStatusBadgeClass = (status: ProjectStatus) => {
        switch (status) {
            case 'Pending':
                return 'bg-warning text-dark'
            case 'Ongoing':
                return 'bg-primary'
            case 'Completed':
                return 'bg-success'
            default:
                return 'bg-secondary'
        }
    }

    const translateStatus = (status: ProjectStatus) => {
        const statusMap: Record<ProjectStatus, string> = {
            'Pending': t('pending'),
            'Ongoing': t('ongoing'),
            'Completed': t('completed')
        }
        return statusMap[status] || status
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('projects')} />

            <div className="container-fluid py-4" dir={dir}>
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                        {flash.error}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">{t('projects')}</h1>
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => openModal()}>
                        <FaPlus className="me-2" /> {t('add_project')}
                    </button>
                </div>

                {/* Stats */}
                <div className="row mb-4 g-3">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="mb-1 fw-bold">{projects.length}</h5>
                                <small className="text-muted">{t('total_projects')}</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="mb-1 fw-bold text-primary">
                                    {projects.filter(p => p.status === 'Ongoing').length}
                                </h5>
                                <small className="text-muted">{t('ongoing')}</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="mb-1 fw-bold text-success">
                                    {projects.filter(p => p.status === 'Completed').length}
                                </h5>
                                <small className="text-muted">{t('completed')}</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4">#</th>
                                        <th>{t('name')}</th>
                                        <th>{t('description')}</th>
                                        <th>{t('status')}</th>
                                        <th className="text-end px-4">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length > 0 ? (
                                        projects.map(project => (
                                            <tr key={project.id}>
                                                <td className="px-4">{project.id}</td>
                                                <td className="fw-semibold">{project.name}</td>
                                                <td>
                                                    {project.description || (
                                                        <span className="text-muted fst-italic">
                                                            {t('no_description')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                                                        {translateStatus(project.status)}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-2"
                                                        onClick={() => openModal(project)}
                                                        title={t('edit')}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => deleteProject(project.id)}
                                                        title={t('delete')}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-5">
                                                <div className="py-4">
                                                    <p className="mb-2">{t('no_projects')}</p>
                                                    <small>{t('add_project')}</small>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {modalOpen && (
                    <>
                        <div 
                            className="modal-backdrop fade show" 
                            onClick={closeModal}
                            style={{ zIndex: 1040 }}
                        />
                        <div 
                            className="modal fade show d-block" 
                            tabIndex={-1}
                            style={{ zIndex: 1050 }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <form onSubmit={submit}>
                                        <div className="modal-header">
                                            <h5 className="modal-title">
                                                {editingProject ? t('edit_project') : t('add_project')}
                                            </h5>
                                            <button 
                                                type="button"
                                                className="btn-close" 
                                                onClick={closeModal}
                                                aria-label="Close"
                                                disabled={processing}
                                            />
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">
                                                    {t('project_name')} <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder={t('project_name')}
                                                    autoFocus
                                                    disabled={processing}
                                                />
                                                {errors.name && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">
                                                    {t('description')}
                                                </label>
                                                <textarea
                                                    id="description"
                                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    placeholder={t('description')}
                                                    rows={3}
                                                    disabled={processing}
                                                />
                                                {errors.description && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.description}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="status" className="form-label">
                                                    {t('status')} <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    id="status"
                                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                                    value={data.status}
                                                    onChange={e => setData('status', e.target.value as ProjectStatus)}
                                                    disabled={processing}
                                                >
                                                    <option value="Pending">{t('pending')}</option>
                                                    <option value="Ongoing">{t('ongoing')}</option>
                                                    <option value="Completed">{t('completed')}</option>
                                                </select>
                                                {errors.status && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.status}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button 
                                                type="button"
                                                className="btn btn-secondary" 
                                                onClick={closeModal}
                                                disabled={processing}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                                        {editingProject ? t('update') + '...' : t('create') + '...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        {editingProject ? t('update') : t('create')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    )
}