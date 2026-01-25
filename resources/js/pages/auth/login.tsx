import { Head, Link, useForm } from '@inertiajs/react'
import { FaTasks } from 'react-icons/fa'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
    status?: string
    canResetPassword: boolean
    canRegister: boolean
}

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const { t, dir } = useTranslation()
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('login', {
            onFinish: () => reset('password'),
        })
    }

    return (
        <>
            <Head title={t('login')} />

            {/* Bootstrap */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
                rel="stylesheet"
            />

            {/* Page */}
            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                dir={dir}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">

                            {/* Card */}
                            <div className="card border-0 shadow-lg rounded-4">
                                <div className="card-body p-4 p-md-5">

                                    {/* Logo */}
                                    <div className="text-center mb-4">
                                        <div
                                            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: 60,
                                                height: 60,
                                                background:
                                                    'linear-gradient(135deg, #667eea, #764ba2)',
                                            }}
                                        >
                                            <FaTasks size={28} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-1">
                                            TaskFlow<span className="text-primary">Pro</span>
                                        </h4>
                                        <p className="text-muted small mb-0">
                                            {t('welcome_back_login')}
                                        </p>
                                    </div>

                                    {/* Language Switcher - Global */}
                                    <div className="mb-3 d-flex justify-content-center">
                                        <LanguageSwitcher variant="select" />
                                    </div>

                                    {/* Status */}
                                    {status && (
                                        <div className="alert alert-success small">
                                            {status}
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form onSubmit={submit}>
                                        {/* Email */}
                                        <div className="mb-3">
                                            <label className="form-label small">
                                                {t('email')}
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="bi bi-envelope"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData('email', e.target.value)
                                                    }
                                                    placeholder={t('email_placeholder')}
                                                    required
                                                />
                                            </div>
                                            {errors.email && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between">
                                                <label className="form-label small">
                                                    {t('password')}
                                                </label>
                                                {canResetPassword && (
                                                    <Link
                                                        href="password.request"
                                                        className="small text-decoration-none"
                                                    >
                                                        {t('forgot_password')}
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="bi bi-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData('password', e.target.value)
                                                    }
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>

                                            {errors.password && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>

                                        {/* Remember */}
                                        <div className="form-check mb-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData('remember', e.target.checked)
                                                }
                                            />
                                            <label
                                                className="form-check-label small"
                                                htmlFor="remember"
                                            >
                                                {t('remember_me')}
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="btn w-100 text-white fw-semibold"
                                            disabled={processing}
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #667eea, #764ba2)',
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    {t('signing_in')}
                                                </>
                                            ) : (
                                                t('sign_in')
                                            )}
                                        </button>
                                    </form>

                                    {/* Register */}
                                    {canRegister && (
                                        <div className="text-center mt-4">
                                            <span className="text-muted small">
                                                {t('no_account')}
                                            </span>{' '}
                                            <Link
                                                href="register"
                                                className="fw-semibold text-decoration-none"
                                            >
                                                {t('create_one')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* /Card */}

                        </div>
                    </div>
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        </>
    )
}