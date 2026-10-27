import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { engine, isQuestion } from '../lib/engine';
import { QUESTIONS } from '../data/questions';
import { submitAnswer } from '../lib/api';

// ─── Persona auto-play sequences ─────────────────────────────
type PersonaKey = '18-school' | '22-degree' | '28-work-switch' | '17-business' | 'unsure';

const PERSONAS: Record<PersonaKey, { label: string; ageBand: string; answers: string[] }> = {
  '18-school':     { label: '18, still studying',                 ageBand: '16-20', answers: ['q1a', 'q2a', 'q9a', 'q10a'] },
  '22-degree':     { label: '22, finished a degree',              ageBand: '21-25', answers: ['q1b', 'q3b', 'q9b', 'q10b'] },
  '28-work-switch':{ label: '28, working, wants a change',        ageBand: '26-30', answers: ['q1c', 'q4c', 'q5c', 'q9c', 'q10c'] },
  '17-business':   { label: '17, mature mindset (business)',       ageBand: '16-20', answers: ['q1d', 'q6b', 'q9b', 'q10a'] },
  'unsure':        { label: 'Not sure yet',                       ageBand: '21-25', answers: ['q1e', 'q7d', 'q8d', 'q9d', 'q10c'] },
};

// ─── Auto-answer helper that works with the mock engine directly ──
async function autoPlayPersona(persona: typeof PERSONAS[PersonaKey], navigate: (p: string) => void) {
  const { sessionId } = engine.createSession(persona.ageBand);
  localStorage.setItem('pathora_session', sessionId);

  for (const optionId of persona.answers) {
    const q = QUESTIONS.find(q => q.options.some(o => o.id === optionId));
    if (q) {
      const res = engine.getNextQuestion(sessionId);
      if (isQuestion(res)) {
        await submitAnswer(sessionId, res.question.id, optionId).catch(() => {});
      }
    }
  }
  navigate('/teaser');
}

export function DemoDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileFrame, setMobileFrame] = useState(false);
  const [personaKey, setPersonaKey] = useState<PersonaKey>('22-degree');

  function reset() {
    localStorage.clear();
    navigate('/');
  }

  function preFill() {
    const details = { name: 'Ahmed Al Mansoori', email: 'ahmed@email.com', phone: '+971 50 123 4567', country: 'UAE', consent: true };
    localStorage.setItem('pathora_details', JSON.stringify(details));
  }

  function skipToTeaser() {
    const sessionId = localStorage.getItem('pathora_session');
    if (sessionId) navigate('/teaser');
    else navigate('/start');
  }

  async function skipToReport() {
    const username = localStorage.getItem('pathora_username');
    if (username) {
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem('pathora_token', token);
      localStorage.setItem('pathora_user', username);
      navigate('/portal');
    } else {
      navigate('/report-ready');
    }
  }

  async function runPersona() {
    const persona = PERSONAS[personaKey];
    await autoPlayPersona(persona, navigate);
  }

  // Toggle frame wrapper
  if (mobileFrame) {
    const root = document.getElementById('root');
    if (root) {
      root.style.maxWidth = '390px';
      root.style.margin = '0 auto';
      root.style.height = '844px';
      root.style.overflow = 'auto';
      root.style.boxShadow = '0 0 0 12px #0B3C49, 0 0 0 15px #222, 0 32px 80px rgba(0,0,0,0.5)';
      root.style.borderRadius = '44px';
    }
  } else {
    const root = document.getElementById('root');
    if (root) { root.style.maxWidth = ''; root.style.margin = ''; root.style.height = ''; root.style.overflow = ''; root.style.boxShadow = ''; root.style.borderRadius = ''; }
  }

  return (
    <>
      {/* Floating button */}
      <button
        id="demo-toggle"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, insetInlineStart: 20, zIndex: 9990,
          background: '#0B3C49', color: 'white',
          border: 'none', borderRadius: 999, padding: '0.5rem 1rem',
          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          transition: 'opacity 0.2s',
          opacity: 0.9,
        }}
        aria-label="Toggle demo drawer"
      >
        🎬 Demo
      </button>

      {/* Drawer */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 70, insetInlineStart: 20, zIndex: 9991,
          background: 'white', borderRadius: 16, padding: '1.25rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)', width: 280,
          border: '1px solid rgba(11,60,73,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>🎬 Demo Controls</h2>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#8aabb0' }}>✕</button>
          </div>

          {/* Frame toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ink)' }}>📱 Mobile frame</span>
            <button
              id="demo-frame-toggle"
              onClick={() => setMobileFrame(f => !f)}
              style={{
                width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                background: mobileFrame ? 'var(--color-teal)' : 'rgba(11,60,73,0.15)',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, insetInlineStart: mobileFrame ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                transition: 'inset-inline-start 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          {/* Persona selector */}
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: '0.375rem' }}>
              🎭 Persona
            </label>
            <select
              id="demo-persona-select"
              value={personaKey}
              onChange={e => setPersonaKey(e.target.value as PersonaKey)}
              className="input"
              style={{ height: 38, fontSize: '0.8rem' }}
            >
              {(Object.keys(PERSONAS) as PersonaKey[]).map(k => (
                <option key={k} value={k}>{PERSONAS[k].label}</option>
              ))}
            </select>
            <button id="demo-run-persona" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', minHeight: 38, fontSize: '0.8rem' }} onClick={runPersona}>
              ▶ Run persona
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button id="demo-prefill" className="btn-ghost" style={{ minHeight: 36, fontSize: '0.8rem' }} onClick={preFill}>
              ✏️ Pre-fill details
            </button>
            <button id="demo-skip-teaser" className="btn-ghost" style={{ minHeight: 36, fontSize: '0.8rem' }} onClick={skipToTeaser}>
              ⏭ Skip to teaser
            </button>
            <button id="demo-skip-report" className="btn-ghost" style={{ minHeight: 36, fontSize: '0.8rem' }} onClick={skipToReport}>
              📊 Skip to report
            </button>
            <button
              id="demo-reset"
              onClick={reset}
              style={{
                minHeight: 36, border: 'none', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(229,62,62,0.1)', color: '#e53e3e', fontWeight: 600, fontSize: '0.8rem',
              }}
            >
              🔄 Reset demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
