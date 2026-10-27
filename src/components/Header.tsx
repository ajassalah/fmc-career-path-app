import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

export function Header() {
  const { t, lang, setLang } = useLang();
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(11,60,73,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Wordmark */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Pathora
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Lang toggle */}
          <button
            id="lang-toggle"
            aria-label={`Switch to ${lang === 'en' ? 'Arabic' : 'English'}`}
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: '4px 10px',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
          >
            {t.nav.langToggle}
          </button>

          {/* Login / Logout */}
          {isPortal ? (
            <button
              id="logout-btn"
              onClick={() => {
                localStorage.removeItem('pathora_token');
                localStorage.removeItem('pathora_user');
                window.location.href = '/';
              }}
              className="btn-ghost"
              style={{ minHeight: 36, padding: '0 0.875rem', fontSize: '0.85rem' }}
            >
              {t.nav.logout}
            </button>
          ) : (
            <Link
              to="/portal/login"
              id="nav-login-link"
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}
            >
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
