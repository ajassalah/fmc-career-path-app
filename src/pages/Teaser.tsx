import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { TwoColLayout } from '../components/TwoColLayout';
import { getTeaser } from '../lib/api';

export default function Teaser() {
  const { t } = useLang();
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('pathora_session') || '';
  const [teaser, setTeaser] = useState<{ teaser: string; price: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { navigate('/start'); return; }
    getTeaser(sessionId).then(r => { setTeaser(r); setLoading(false); });
  }, [sessionId, navigate]);

  function handleUnlock() {
    navigate('/details');
  }

  return (
    <TwoColLayout title={t.teaser.heading} caption="Your results are in. Unlock your full personalised report." step={3}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
        {t.teaser.heading}
      </h1>
      <p style={{ color: '#5a7b85', marginBottom: '1.75rem', fontSize: '0.9375rem' }}>
        Unlock your full report to see careers, pathway and action plan.
      </p>

      {/* Teaser card */}
      <div style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, #0B3C49 0%, #0E7C86 100%)',
        padding: '2rem 1.5rem',
        marginBottom: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(217,164,65,0.12)' }} />

        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          {t.teaser.subheading}
        </p>

        {loading ? (
          <div className="skeleton" style={{ height: 36, width: '70%', margin: '0.5rem 0 1rem' }} />
        ) : (
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
            {teaser?.teaser}
          </p>
        )}

        {/* Blurred skeleton rows */}
        <div className="blur-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[80, 60, 45].map((w, i) => (
            <div key={i} style={{ height: 14, width: `${w}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 6 }} />
          ))}
        </div>
      </div>

      {/* Bullets */}
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {t.teaser.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: 'var(--color-ink)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(14,124,134,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', color: 'var(--color-teal)' }}>✓</span>
            {b}
          </li>
        ))}
      </ul>

      {/* Unlock button */}
      <button
        id="teaser-unlock"
        className="btn-gold"
        style={{ width: '100%', fontSize: '1.05rem' }}
        onClick={handleUnlock}
      >
        🔓 {t.teaser.unlock} ({teaser ? `${teaser.currency} ${teaser.price}` : t.teaser.price})
      </button>
    </TwoColLayout>
  );
}
