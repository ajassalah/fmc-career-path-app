import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { TwoColLayout } from '../components/TwoColLayout';
import { login } from '../lib/api';

export default function PortalLogin() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login(username.trim(), password);
      localStorage.setItem('pathora_token', token);
      localStorage.setItem('pathora_user', username.trim());

      // Seed welcome chat if not exists
      const chatKey = `pathora_chat_${username.trim()}`;
      const details = (() => { try { return JSON.parse(localStorage.getItem('pathora_details') || '{}'); } catch { return {}; } })();
      const firstName = details.name?.split(' ')[0] || username.trim();
      if (!localStorage.getItem(chatKey)) {
        const welcome = [{ id: '0', from: 'staff', body: t.portal.chatWelcome(firstName), ts: Date.now() }];
        localStorage.setItem(chatKey, JSON.stringify(welcome));
      }
      navigate('/portal');
    } catch {
      setError(t.login.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TwoColLayout title={t.login.title} caption="Your personalised report and career guidance is waiting." step={0}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.75rem' }}>
        {t.login.title}
      </h1>

      {/* Demo hint */}
      <div style={{ background: 'rgba(217,164,65,0.1)', border: '1px solid rgba(217,164,65,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-ink)' }}>
        💡 {t.login.hint}
      </div>

      <form id="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="input-label" htmlFor="login-username">{t.login.username}</label>
          <input
            id="login-username"
            className={`input${error ? ' error' : ''}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor="login-password">{t.login.password}</label>
          <input
            id="login-password"
            type="password"
            className={`input${error ? ' error' : ''}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{error}</p>}

        <button type="submit" id="login-submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.25rem' }}>
          {loading ? 'Logging in…' : t.login.cta}
        </button>
      </form>
    </TwoColLayout>
  );
}
