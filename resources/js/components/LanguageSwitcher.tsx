import { router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

interface LanguageSwitcherProps {
  onChange?: (lang: string) => void;
  variant?: 'dropdown' | 'flags' | 'minimal' | 'select';
  className?: string;
}

export default function LanguageSwitcher({ 
  onChange,
  variant = 'dropdown',
  className = ''
}: LanguageSwitcherProps) {
  const { props } = usePage();
  const serverLocale = (props as any).locale || 'en';
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(serverLocale);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  // Sync with server locale
  useEffect(() => {
    setSelectedLang(serverLocale);
  }, [serverLocale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    
    // Update DOM immediately for better UX
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = langCode;
    }
    
    // ✅ Check if we're in an Inertia context
    const isInertiaPage = window.location.pathname !== '/';
    
    if (isInertiaPage) {
      // Use Inertia routing for authenticated pages
      router.post('/change-language', { language: langCode }, {
        preserveScroll: true,
        preserveState: false,
      });
    } else {
      // ✅ Use regular form submission for welcome page
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/change-language';
      
      // CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      // Language input
      const langInput = document.createElement('input');
      langInput.type = 'hidden';
      langInput.name = 'language';
      langInput.value = langCode;
      form.appendChild(langInput);
      
      // Submit
      document.body.appendChild(form);
      form.submit();
    }
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(langCode);
    }
  };

  // Select variant (Bootstrap style)
  if (variant === 'select') {
    return (
      <select
        className={`form-select form-select-sm ${className}`}
        style={{ width: '120px' }}
        value={selectedLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`position-relative ${className}`} ref={dropdownRef}>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span className="d-none d-md-inline">{currentLanguage.nativeName}</span>
          <span className="d-md-none">{currentLanguage.flag}</span>
        </button>

        {isOpen && (
          <div 
            className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border-0"
            style={{ minWidth: '200px', zIndex: 1050 }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`dropdown-item d-flex align-items-center gap-3 py-2 px-3 ${
                  selectedLang === lang.code ? 'active bg-primary text-white' : ''
                }`}
                onClick={() => handleLanguageChange(lang.code)}
                type="button"
              >
                <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                <div className="d-flex flex-column align-items-start">
                  <span className="fw-semibold">{lang.nativeName}</span>
                  <small className={selectedLang === lang.code ? 'text-white-50' : 'text-muted'}>
                    {lang.name}
                  </small>
                </div>
                {selectedLang === lang.code && <span className="ms-auto">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Flags variant
  if (variant === 'flags') {
    return (
      <div className={`d-flex gap-2 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`btn btn-sm ${
              selectedLang === lang.code ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => handleLanguageChange(lang.code)}
            title={lang.nativeName}
            type="button"
            style={{ fontSize: '1.2rem', padding: '0.25rem 0.5rem' }}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  // Minimal variant
  return (
    <div className={`position-relative ${className}`} ref={dropdownRef}>
      <button
        className="btn btn-link text-decoration-none p-2"
        onClick={() => setIsOpen(!isOpen)}
        title={currentLanguage.nativeName}
        type="button"
      >
        <span style={{ fontSize: '1.5rem' }}>{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border-0"
          style={{ minWidth: '180px', zIndex: 1050 }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`dropdown-item d-flex align-items-center gap-2 py-2 ${
                selectedLang === lang.code ? 'active bg-primary text-white' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              type="button"
            >
              <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {selectedLang === lang.code && <span className="ms-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}