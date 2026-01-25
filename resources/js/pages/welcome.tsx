import { router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Welcome() {
  const { t, locale, setLocale, dir } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const auth = { user: null }
  const canRegister = true

  // Change language handler that updates server
  const changeLanguage = (lang: string) => {
    setLocale(lang)
    
    // Update server-side language preference
    router.post('/change-language', { language: lang }, {
      preserveScroll: true,
      preserveState: true
    })
  }

  // Tasks with translations
  const tasks = [
    { task: t('task_design_landing'), done: true },
    { task: t('task_fix_login'), done: true },
    { task: t('task_deploy_project'), done: false },
  ]

  return (
    <>
      {/* Bootstrap */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container" dir={dir}>
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-check2-square me-2"></i>
            TaskFlowPro
          </a>

          <button
            className="navbar-toggler"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${
              isMenuOpen ? 'show' : ''
            }`}
          >
            <div className="d-flex align-items-center gap-3 ms-auto">
              <a className="nav-link" href="#features">
                <i className="bi bi-stars me-1"></i>
                {t('features')}
              </a>
              <a className="nav-link" href="#pricing">
                <i className="bi bi-tags me-1"></i>
                {t('pricing')}
              </a>
              <a className="nav-link" href="#contact">
                <i className="bi bi-envelope me-1"></i>
                {t('contact')}
              </a>

              {/* Language Select */}
              <select
                className="form-select form-select-sm"
                style={{ width: '120px' }}
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>

              {auth.user ? (
                <a
                  href="/dashboard"
                  className="btn btn-primary"
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  {t('dashboard')}
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    {t('login')}
                  </a>
                  {canRegister && (
                    <a
                      href="/register"
                      className="btn btn-primary"
                    >
                      <i className="bi bi-person-plus me-1"></i>
                      {t('sign_up_free')}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="min-vh-100 d-flex align-items-center text-white"
        style={{
          background:
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '80px',
        }}
        dir={dir}
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="mb-3">
                <span className="badge bg-warning text-dark px-3 py-2">
                  {t('hero_badge')}
                </span>
              </div>

              <h1 className="display-4 fw-bold mb-4">
                {t('hero_title')}{' '}
                <span className="text-warning">
                  {t('hero_subtitle')}
                </span>
              </h1>

              <p className="lead mb-4">
                {t('hero_description')}
              </p>

              <div className="d-flex gap-3">
                <a
                  href="/register"
                  className="btn btn-warning btn-lg"
                >
                  <i className="bi bi-play-circle me-1"></i>
                  {t('start_free_trial')}
                </a>
                <a
                  href="/login"
                  className="btn btn-light btn-lg"
                >
                  {t('sign_in')}
                </a>
              </div>
            </div>

            {/* TASKS CARD */}
            <div className="col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-list-check me-1"></i>
                    {t('todays_tasks')}
                  </h5>

                  <ul className="list-group list-group-flush">
                    {tasks.map((task, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span
                          style={{
                            textDecoration: task.done
                              ? 'line-through'
                              : 'none',
                          }}
                        >
                          {task.task}
                        </span>

                        <span
                          className={`badge ${
                            task.done
                              ? 'bg-success'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {task.done
                            ? t('completed')
                            : t('ongoing')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-5 bg-light" dir={dir}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">{t('powerful_features')}</h2>
            <p className="lead text-muted">{t('everything_team_needs')}</p>
          </div>

          <div className="row g-4">
            {[
              { icon: 'bi-list-check', title: t('task_management') },
              { icon: 'bi-people', title: t('team_collaboration') },
              { icon: 'bi-graph-up', title: t('analytics') },
              { icon: 'bi-calendar-event', title: t('scheduling') },
              { icon: 'bi-bell', title: t('notifications') },
              { icon: 'bi-shield-check', title: t('security') },
            ].map((feature, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className={`${feature.icon} display-4 text-primary mb-3`}></i>
                    <h5 className="fw-bold">{feature.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-4" dir={dir}>
        <div className="container text-center">
          <small>
            © {new Date().getFullYear()} TaskFlow Pro —{' '}
            {t('all_rights_reserved')}
          </small>
        </div>
      </footer>
    </>
  )
}