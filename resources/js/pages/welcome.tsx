import { Head, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'

export default function Welcome() {
  const { t, dir } = useTranslation()
  const { props } = usePage()
  const auth = (props as any).auth || { user: null }
  const canRegister = (props as any).canRegister !== false
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])

  return (
    <>
      <Head title={t('welcome')}>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </Head>

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-modern bg-white">
        <div className="container py-2">

          {/* LOGO */}
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <i className="bi bi-check2-square text-primary fs-4"></i>
            <span className="fs-5">TaskFlowPro</span>
          </a>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3 ms-auto">

            {/* DESKTOP LINKS */}
            <div className="d-none d-lg-flex align-items-center gap-4">
              <a href="#features" className="nav-link nav-link-modern">
                {t('features')}
              </a>
              <a href="#pricing" className="nav-link nav-link-modern">
                {t('pricing')}
              </a>
              <a href="#contact" className="nav-link nav-link-modern">
                {t('contact')}
              </a>
            </div>

            {/* LANGUAGE */}
            <div className="lang-pill">
              <LanguageSwitcher variant="select" />
            </div>

            {/* AUTH */}
            {auth.user ? (
              <a href="/dashboard" className="btn btn-primary btn-sm px-3">
                {t('dashboard')}
              </a>
            ) : (
              <>
                <a href="/login" className="btn btn-outline-primary btn-sm px-3">
                  {t('login')}
                </a>
                {canRegister && (
                  <a href="/register" className="btn btn-primary btn-sm px-3">
                    {t('sign_up_free')}
                  </a>
                )}
              </>
            )}

            {/* MOBILE TOGGLE */}
            <button
              className="navbar-toggler border-0"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <i className="bi bi-list fs-3"></i>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="mobile-menu">
            <div className="container py-3 d-flex flex-column gap-3">
              <a href="#features" className="nav-link">{t('features')}</a>
              <a href="#pricing" className="nav-link">{t('pricing')}</a>
              <a href="#contact" className="nav-link">{t('contact')}</a>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="min-vh-100 d-flex align-items-center text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '120px',
        }}
      >
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <span className="badge bg-warning text-dark px-3 py-2 mb-3">
                {t('hero_badge')}
              </span>

              <h1 className="display-4 fw-bold mb-4">
                {t('hero_title')}{' '}
                <span className="text-warning">{t('hero_subtitle')}</span>
              </h1>

              <p className="lead mb-4">
                {t('hero_description')}
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <a href="/register" className="btn btn-warning btn-lg">
                  {t('start_free_trial')}
                </a>
                <a href="/login" className="btn btn-light btn-lg">
                  {t('sign_in')}
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    {t('todays_tasks')}
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span className="text-decoration-line-through">
                        {t('task_design_landing')}
                      </span>
                      <span className="badge bg-success">
                        {t('completed')}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>{t('task_deploy_project')}</span>
                      <span className="badge bg-warning text-dark">
                        {t('ongoing')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t('powerful_features')}</h2>
            <p className="text-muted">{t('everything_team_needs')}</p>
          </div>

          <div className="row g-4">
            {[
              ['bi-list-check', t('task_management')],
              ['bi-people', t('team_collaboration')],
              ['bi-graph-up', t('analytics')],
              ['bi-shield-check', t('security')],
            ].map(([icon, label], i) => (
              <div className="col-md-3" key={i}>
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body">
                    <i className={`bi ${icon} display-5 text-primary mb-3`}></i>
                    <h6 className="fw-bold">{label}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <small>
            © {new Date().getFullYear()} TaskFlowPro — {t('all_rights_reserved')}
          </small>
        </div>
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        .navbar-modern {
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .nav-link-modern {
          font-weight: 500;
          color: #444;
          position: relative;
        }

        .nav-link-modern::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: #667eea;
          transition: width .3s ease;
        }

        .nav-link-modern:hover::after {
          width: 100%;
        }

        .lang-pill select {
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
        }

        .mobile-menu {
          background: white;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
      `}</style>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </>
  )
}
