import { Head, Link, useForm } from '@inertiajs/react'
import { FaTasks } from 'react-icons/fa'

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('register', {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <>
            <Head title="Register" />

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
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 col-lg-5">

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
                                            Create your account
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={submit}>
                                        {/* Name */}
                                        <div className="mb-3">
                                            <label className="form-label small">
                                                Full name
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="bi bi-person"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                            {errors.name && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="mb-3">
                                            <label className="form-label small">
                                                Email address
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
                                                    placeholder="name@company.com"
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
                                            <label className="form-label small">
                                                Password
                                            </label>
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

                                        {/* Confirm Password */}
                                        <div className="mb-4">
                                            <label className="form-label small">
                                                Confirm password
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="bi bi-shield-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                                    value={data.password_confirmation}
                                                    onChange={(e) =>
                                                        setData(
                                                            'password_confirmation',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                            {errors.password_confirmation && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password_confirmation}
                                                </div>
                                            )}
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
                                                    Creating account...
                                                </>
                                            ) : (
                                                'Create account'
                                            )}
                                        </button>
                                    </form>

                                    {/* Login */}
                                    <div className="text-center mt-4">
                                        <span className="text-muted small">
                                            Already have an account?
                                        </span>{' '}
                                        <Link
                                            href="login"
                                            className="fw-semibold text-decoration-none"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
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
