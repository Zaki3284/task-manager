import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { FaUsers, FaEdit, FaTrash, FaLock } from 'react-icons/fa'
import { useTranslation } from '@/hooks/useTranslation'
import AppLayout from '@/layouts/app-layout'
import type { BreadcrumbItem } from '@/types'
import 'bootstrap/dist/css/bootstrap.min.css'

type User = {
    id: number
    name: string
    email: string
    role: string
    status: 'Active' | 'Inactive'
}

type PageProps = {
    users: User[]
}

export default function Users({ users }: PageProps) {
    const { t, dir } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('users'), href: '/' },
    ]

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '',
        email: '',
        role: 'Developer',
        status: 'Active',
        password: '',
        password_confirmation: '',
    })

    const openModal = (user: User | null = null) => {
        setEditingUser(user)

        if (user) {
            setData({
                ...data,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                password: '',
                password_confirmation: '',
            })
        } else {
            reset()
        }

        setModalOpen(true)
    }

    const closeModal = () => {
        setEditingUser(null)
        reset()
        setModalOpen(false)
    }

    const submit = () => {
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: closeModal,
            })
        } else {
            post('/users', {
                onSuccess: closeModal,
            })
        }
    }

    const removeUser = (id: number) => {
        if (confirm(t('delete_confirmation'))) {
            destroy(`/users/${id}`)
        }
    }

    const translateRole = (role: string) => {
        const roleMap: Record<string, string> = {
            'Admin': t('admin'),
            'Developer': t('developer'),
            'Chef de projet': t('chef_de_projet')
        }
        return roleMap[role] || role
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users')} />

            <div className="container-fluid py-4" dir={dir}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3">{t('users_management')}</h1>
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <FaUsers className="me-2" />
                        {t('add_user')}
                    </button>
                </div>

                {/* Stats */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <FaUsers size={30} className="text-primary me-3" />
                                <div>
                                    <h5 className="mb-0">{users.length}</h5>
                                    <small>{t('total_users')}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <FaLock size={30} className="text-success me-3" />
                                <div>
                                    <h5 className="mb-0">
                                        {users.filter(u => u.status === 'Active').length}
                                    </h5>
                                    <small>{t('active_users')}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <FaLock size={30} className="text-warning me-3" />
                                <div>
                                    <h5 className="mb-0">
                                        {users.filter(u => u.status === 'Inactive').length}
                                    </h5>
                                    <small>{t('inactive_users')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card shadow-sm">
                    <div className="card-body table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>{t('name')}</th>
                                    <th>{t('email')}</th>
                                    <th>{t('role')}</th>
                                    <th>{t('status')}</th>
                                    <th className="text-end">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{translateRole(user.role)}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    user.status === 'Active'
                                                        ? 'bg-success'
                                                        : 'bg-secondary'
                                                }`}
                                            >
                                                {user.status === 'Active' ? t('active') : t('inactive')}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => openModal(user)}
                                                title={t('edit')}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeUser(user.id)}
                                                title={t('delete')}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">
                                            {t('no_users')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {modalOpen && (
                    <>
                        <div className="modal-backdrop fade show" />
                        <div className="modal show d-block">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            {editingUser ? t('edit_user') : t('add_user')}
                                        </h5>
                                        <button className="btn-close" onClick={closeModal} />
                                    </div>

                                    <div className="modal-body">
                                        <input
                                            className="form-control mb-3"
                                            placeholder={t('name')}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />

                                        <input
                                            className="form-control mb-3"
                                            placeholder={t('email')}
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />

                                        <select
                                            className="form-select mb-3"
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                        >
                                            <option value="Admin">{t('admin')}</option>
                                            <option value="Developer">{t('developer')}</option>
                                            <option value="Chef de projet">{t('chef_de_projet')}</option>
                                        </select>

                                        <select
                                            className="form-select mb-3"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                        >
                                            <option value="Active">{t('active')}</option>
                                            <option value="Inactive">{t('inactive')}</option>
                                        </select>

                                        {!editingUser && (
                                            <>
                                                <input
                                                    type="password"
                                                    className="form-control mb-3"
                                                    placeholder={t('password')}
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                />

                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder={t('confirm_password')}
                                                    value={data.password_confirmation}
                                                    onChange={e =>
                                                        setData(
                                                            'password_confirmation',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            {t('cancel')}
                                        </button>
                                        <button className="btn btn-primary" onClick={submit}>
                                            {editingUser ? t('update') : t('create')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    )
}