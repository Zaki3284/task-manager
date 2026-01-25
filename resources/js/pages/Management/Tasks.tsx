import { Head, useForm, usePage, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { FaTasks, FaEdit, FaTrash, FaPlus, FaFilter } from 'react-icons/fa'
import AppLayout from '@/layouts/app-layout'
import { useTranslation } from '@/hooks/useTranslation'
import type { BreadcrumbItem } from '@/types'
import 'bootstrap/dist/css/bootstrap.min.css'

type TaskStatus = 'Pending' | 'Ongoing' | 'Completed'

type Project = {
    id: number
    name: string
}

type User = {
    id: number
    name: string
    role: 'Admin' | 'Developer' | 'Chef de projet'
}

type Task = {
    id: number
    name: string
    project_id: number
    user_id: number
    status: TaskStatus
    due_date: string
    project?: Project
    user?: User
}

type TaskFormData = {
    name: string
    project_id: number | ''
    user_id: number | ''
    status: TaskStatus
    due_date: string
}

type PageProps = {
    tasks: Task[]
    projects: Project[]
    users: User[]
    auth: {
        user: {
            role: 'Admin' | 'Developer' | 'Chef de projet'
        }
    }
    filters: {
        status: string
        project: string
    }
}

export default function Tasks({ tasks, projects, users, filters }: PageProps) {
    const { t, dir } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [selectedProject, setSelectedProject] = useState<string>(filters.project || 'all')
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all')
    const { flash, auth } = usePage().props as any

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('tasks'), href: '/tasks' },
    ]

    const userRole = auth.user.role
    const isDeveloper = userRole === 'Developer'
    const canManageTasks = !isDeveloper

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm<TaskFormData>({
        name: '',
        project_id: '',
        user_id: '',
        status: 'Pending',
        due_date: '',
    })

    const { data: statusData, setData: setStatusData, put: updateStatus, processing: updatingStatus } = useForm({
        status: 'Pending' as TaskStatus,
    })

    useEffect(() => {
        if (flash?.success) {
            console.log('Success:', flash.success)
        }
        if (flash?.error) {
            console.error('Error:', flash.error)
        }
    }, [flash])

    const handleFilterChange = () => {
        router.get('/tasks', {
            status: selectedStatus,
            project: selectedProject,
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    useEffect(() => {
        handleFilterChange()
    }, [selectedStatus, selectedProject])

    const openModal = (task: Task | null = null) => {
        if (!canManageTasks) return
        
        clearErrors()
        if (task) {
            setEditingTask(task)
            setData({
                name: task.name,
                project_id: task.project_id,
                user_id: task.user_id,
                status: task.status,
                due_date: task.due_date,
            })
        } else {
            setEditingTask(null)
            reset()
        }
        setModalOpen(true)
    }

    const closeModal = () => {
        reset()
        clearErrors()
        setEditingTask(null)
        setModalOpen(false)
    }

    const openStatusModal = (task: Task) => {
        setEditingTask(task)
        setStatusData('status', task.status)
        setStatusModalOpen(true)
    }

    const closeStatusModal = () => {
        setEditingTask(null)
        setStatusModalOpen(false)
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!canManageTasks) return
        
        if (editingTask) {
            put(`/tasks/${editingTask.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal()
                },
                onError: (errors) => {
                    console.error('Update errors:', errors)
                }
            })
        } else {
            post('/tasks', {
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

    const submitStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!editingTask) return
        
        updateStatus(`/tasks/${editingTask.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeStatusModal()
            },
        })
    }

    const deleteTask = (id: number) => {
        if (!canManageTasks) return
        
        if (window.confirm(t('delete_confirmation'))) {
            router.delete(`/tasks/${id}`, {
                preserveScroll: true,
            })
        }
    }

    const getStatusBadgeClass = (status: TaskStatus) => {
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

    const translateStatus = (status: TaskStatus) => {
        const statusMap: Record<TaskStatus, string> = {
            'Pending': t('pending'),
            'Ongoing': t('ongoing'),
            'Completed': t('completed')
        }
        return statusMap[status] || status
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tasks')} />
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
                    <h1 className="h3 mb-0">{t('tasks')}</h1>
                    <div className="d-flex gap-2">
                        {/* Status Filter */}
                        <select 
                            className="form-select" 
                            style={{ width: '150px' }}
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">{t('all_status')}</option>
                            <option value="Pending">{t('pending')}</option>
                            <option value="Ongoing">{t('ongoing')}</option>
                            <option value="Completed">{t('completed')}</option>
                        </select>

                        {/* Project Filter */}
                        <select 
                            className="form-select" 
                            style={{ width: '200px' }}
                            value={selectedProject} 
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="all">{t('all_projects')}</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        {canManageTasks && (
                            <button className="btn btn-primary d-flex align-items-center" onClick={() => openModal()}>
                                <FaPlus className="me-2" /> {t('add_task')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4 g-3">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <FaTasks size={30} className="text-primary me-3" />
                                <div>
                                    <h5 className="mb-0 fw-bold">{projects.length}</h5>
                                    <small className="text-muted">{t('projects')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <FaTasks size={30} className="text-success me-3" />
                                <div>
                                    <h5 className="mb-0 fw-bold">{tasks.length}</h5>
                                    <small className="text-muted">{t('total_tasks')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <FaTasks size={30} className="text-warning me-3" />
                                <div>
                                    <h5 className="mb-0 fw-bold">
                                        {tasks.filter(t => t.status === 'Ongoing').length}
                                    </h5>
                                    <small className="text-muted">{t('ongoing_tasks')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4">#</th>
                                        <th>{t('task_name')}</th>
                                        <th>{t('project')}</th>
                                        <th>{t('developer')}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('due_date')}</th>
                                        <th className="text-end px-4">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length > 0 ? (
                                        tasks.map(task => (
                                            <tr key={task.id}>
                                                <td className="px-4">{task.id}</td>
                                                <td className="fw-semibold">{task.name}</td>
                                                <td>{task.project?.name || 'N/A'}</td>
                                                <td>{task.user?.name || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                        {translateStatus(task.status)}
                                                    </span>
                                                </td>
                                                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                                                <td className="text-end px-4">
                                                    {canManageTasks ? (
                                                        <>
                                                            <button 
                                                                className="btn btn-sm btn-outline-warning me-2" 
                                                                onClick={() => openModal(task)}
                                                                title={t('edit')}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger" 
                                                                onClick={() => deleteTask(task.id)}
                                                                title={t('delete')}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary" 
                                                            onClick={() => openStatusModal(task)}
                                                            title={t('update_status')}
                                                        >
                                                            {t('update_status')}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center text-muted py-5">
                                                <div className="py-4">
                                                    <p className="mb-2">{t('no_tasks')}</p>
                                                    {canManageTasks && (
                                                        <small>{t('add_task')}</small>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* CRUD Modal */}
                {modalOpen && canManageTasks && (
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
                                                {editingTask ? t('edit_task') : t('add_task')}
                                            </h5>
                                            <button 
                                                type="button" 
                                                className="btn-close" 
                                                onClick={closeModal}
                                                disabled={processing}
                                            />
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="name" className="form-label">
                                                    {t('task_name')} <span className="text-danger">*</span>
                                                </label>
                                                <input 
                                                    id="name"
                                                    type="text" 
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder={t('task_name')}
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
                                                <label htmlFor="project_id" className="form-label">
                                                    {t('project')} <span className="text-danger">*</span>
                                                </label>
                                                <select 
                                                    id="project_id"
                                                    className={`form-select ${errors.project_id ? 'is-invalid' : ''}`}
                                                    value={data.project_id}
                                                    onChange={e => setData('project_id', Number(e.target.value))}
                                                    disabled={processing}
                                                >
                                                    <option value="">{t('select_project')}</option>
                                                    {projects.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                                {errors.project_id && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.project_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="user_id" className="form-label">
                                                    {t('developer')} <span className="text-danger">*</span>
                                                </label>
                                                <select 
                                                    id="user_id"
                                                    className={`form-select ${errors.user_id ? 'is-invalid' : ''}`}
                                                    value={data.user_id}
                                                    onChange={e => setData('user_id', Number(e.target.value))}
                                                    disabled={processing}
                                                >
                                                    <option value="">{t('select_developer')}</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                                {errors.user_id && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.user_id}
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
                                                    onChange={e => setData('status', e.target.value as TaskStatus)}
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

                                            <div className="mb-3">
                                                <label htmlFor="due_date" className="form-label">
                                                    {t('due_date')} <span className="text-danger">*</span>
                                                </label>
                                                <input 
                                                    id="due_date"
                                                    type="date" 
                                                    className={`form-control ${errors.due_date ? 'is-invalid' : ''}`}
                                                    value={data.due_date}
                                                    onChange={e => setData('due_date', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    disabled={processing}
                                                />
                                                {errors.due_date && (
                                                    <div className="invalid-feedback d-block">
                                                        {errors.due_date}
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
                                                        {editingTask ? t('updating') : t('creating')}
                                                    </>
                                                ) : (
                                                    editingTask ? t('update') : t('create')
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Status Update Modal */}
                {statusModalOpen && isDeveloper && (
                    <>
                        <div 
                            className="modal-backdrop fade show" 
                            onClick={closeStatusModal}
                            style={{ zIndex: 1040 }}
                        />
                        <div 
                            className="modal fade show d-block" 
                            tabIndex={-1}
                            style={{ zIndex: 1050 }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <form onSubmit={submitStatusUpdate}>
                                        <div className="modal-header">
                                            <h5 className="modal-title">{t('update_task_status')}</h5>
                                            <button 
                                                type="button" 
                                                className="btn-close" 
                                                onClick={closeStatusModal}
                                                disabled={updatingStatus}
                                            />
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">{t('task_name')}</label>
                                                <p className="form-control-plaintext">{editingTask?.name}</p>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="status_update" className="form-label">
                                                    {t('status')} <span className="text-danger">*</span>
                                                </label>
                                                <select 
                                                    id="status_update"
                                                    className="form-select"
                                                    value={statusData.status}
                                                    onChange={e => setStatusData('status', e.target.value as TaskStatus)}
                                                    disabled={updatingStatus}
                                                    autoFocus
                                                >
                                                    <option value="Pending">{t('pending')}</option>
                                                    <option value="Ongoing">{t('ongoing')}</option>
                                                    <option value="Completed">{t('completed')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                onClick={closeStatusModal}
                                                disabled={updatingStatus}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={updatingStatus}
                                            >
                                                {updatingStatus ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                                        {t('updating')}
                                                    </>
                                                ) : (
                                                    t('update_status')
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