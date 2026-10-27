import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { FmcLogo } from '../components/FmcLogo';
import { Footer } from '../components/Footer';

const BENEFIT_ICONS = ['🧠', '📄', '💬'];

export default function Landing() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 60px)',
        background: 'linear-gradient(180deg, #051318 0%, #071e25 40%, #0a2730 100%)',
        color: '#EAF2F3',
      }}
    >
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(180deg, rgba(5, 19, 24, 0.72) 0%, rgba(7, 30, 37, 0.82) 45%, #051318 100%), url("/hero-bg.jpg") center top / cover no-repeat',
          padding: '5.5rem 1.5rem 4.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Ambient atmospheric glow highlights */}
        <div
          style={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 164, 65, 0.12) 0%, transparent 70%)',
            top: -100,
            right: '15%',
            pointerEvents: 'none',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 124, 134, 0.25) 0%, transparent 70%)',
            bottom: -50,
            left: '10%',
            pointerEvents: 'none',
            filter: 'blur(40px)',
          }}
        />

        <div style={{ maxWidth: 740, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* FMC badge */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: 999,
                padding: '0.35rem 1rem',
                fontSize: '0.85rem',
                color: '#5eead4',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ opacity: 0.75, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Powered by</span>
              <FmcLogo />
            </span>
          </div>

          {/* Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(217, 164, 65, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(217, 164, 65, 0.45)',
              borderRadius: 999,
              padding: '0.4rem 1.25rem',
              marginBottom: '1.75rem',
              boxShadow: '0 4px 20px rgba(217, 164, 65, 0.15)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D9A441', display: 'inline-block' }} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#F4CA64',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {t.landing.pill}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5.5vw, 3.6rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
              textShadow: '0 2px 24px rgba(0, 0, 0, 0.6)',
            }}
          >
            {t.landing.hero}
          </h1>

          <p
            style={{
              color: 'rgba(234, 242, 243, 0.85)',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: 520,
              margin: '0 auto 2.5rem',
              textShadow: '0 1px 10px rgba(0, 0, 0, 0.4)',
            }}
          >
            Answer a few quick questions and we'll match you with the career path that fits your life, skills and ambitions.
          </p>

          <button
            id="landing-cta"
            className="btn-gold"
            style={{
              fontSize: '1.15rem',
              padding: '0 2.75rem',
              minHeight: 60,
              boxShadow: '0 8px 32px rgba(217, 164, 65, 0.45)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/start')}
          >
            {t.landing.cta} →
          </button>

          {/* Quick trust highlights */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
              fontSize: '0.85rem',
              color: 'rgba(234, 242, 243, 0.65)',
            }}
          >
            <span>✦ Adaptive Diagnostic</span>
            <span>✦ Tailored Gulf Pathways</span>
            <span>✦ Actionable 30/90-Day Plan</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: 1040, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {t.landing.benefits.map((b, i) => (
            <div
              key={i}
              style={{
                padding: '2rem 1.75rem',
                borderRadius: 'var(--radius-card)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.25s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-6px)';
                el.style.background = 'rgba(255, 255, 255, 0.07)';
                el.style.borderColor = 'rgba(217, 164, 65, 0.35)';
                el.style.boxShadow = '0 16px 40px rgba(11, 60, 73, 0.35), 0 0 20px rgba(217, 164, 65, 0.15)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = '';
                el.style.background = 'rgba(255, 255, 255, 0.04)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  marginBottom: '1.25rem',
                  background: 'rgba(14, 124, 134, 0.2)',
                  border: '1px solid rgba(14, 124, 134, 0.35)',
                }}
              >
                {BENEFIT_ICONS[i]}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.625rem',
                  color: '#FFFFFF',
                }}
              >
                {b.title}
              </h3>
              <p style={{ color: '#9ec1c7', fontSize: '0.95rem', lineHeight: 1.65 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Login link */}
      <div style={{ textAlign: 'center', paddingBottom: '2.5rem' }}>
        <a
          href="/portal/login"
          id="landing-login-link"
          style={{
            color: '#2dd4bf',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#F4CA64')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#2dd4bf')}
        >
          {t.nav.login} →
        </a>
      </div>

      <Footer style={{ borderTopColor: 'rgba(255, 255, 255, 0.08)' }} />
    </div>
  );
}
