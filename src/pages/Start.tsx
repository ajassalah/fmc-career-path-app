import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { TwoColLayout } from '../components/TwoColLayout';
import { createSession } from '../lib/api';

const AGE_BANDS = ['16-20', '21-25', '26-30', '31-35', '36+'];
const AGE_EMOJIS = ['🌱', '📚', '🚀', '💼', '⭐'];
const AGE_LABELS = ['16–20', '21–25', '26–30', '31–35', '36+'];

export default function Start() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSelect(band: string) {
    setSelected(band);
    setLoading(true);
    try {
      const { sessionId } = await createSession(band);
      localStorage.setItem('pathora_session', sessionId);
      setTimeout(() => navigate('/quiz'), 400);
    } catch {
      setLoading(false);
      setSelected(null);
    }
  }

  return (
    <TwoColLayout
      title={t.start.title}
      caption={t.start.subtitle}
      step={1}
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
        {t.start.title}
      </h1>
      <p style={{ color: '#5a7b85', marginBottom: '1.75rem', fontSize: '0.9375rem' }}>{t.start.subtitle}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {AGE_BANDS.map((band, i) => (
          <button
            key={band}
            id={`age-option-${band}`}
            className={`option-card${selected === band ? ' selected' : ''}`}
            onClick={() => !loading && handleSelect(band)}
            disabled={loading}
            aria-pressed={selected === band}
            style={{ fontSize: '1.05rem' }}
          >
            <span style={{ fontSize: '1.5rem' }}>{AGE_EMOJIS[i]}</span>
            <span>{AGE_LABELS[i]}</span>
            {selected === band && loading && (
              <span style={{ marginInlineStart: 'auto', fontSize: '0.875rem', color: 'var(--color-teal)' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </TwoColLayout>
  );
}
