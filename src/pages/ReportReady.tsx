import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { FmcLogo } from '../components/FmcLogo';
import type { Report } from '../lib/api';
import { ReportView } from '../components/ReportView';

export default function ReportReady() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);

  const username = localStorage.getItem('pathora_username') || 'user123';
  const password = localStorage.getItem('pathora_password') || 'Path1234!';
  const details = (() => { try { return JSON.parse(localStorage.getItem('pathora_details') || '{}'); } catch { return {}; } })();
  const firstName = details.name?.split(' ')[0] || 'there';

  useEffect(() => {
    const raw = localStorage.getItem('pathora_report');
    if (raw) { try { setReport(JSON.parse(raw)); } catch { /* ignore */ } }
  }, []);

  function handleLogin() {
    // Pre-set token for portal access
    const token = btoa(`${username}:${Date.now()}`);
    localStorage.setItem('pathora_token', token);
    localStorage.setItem('pathora_user', username);

    // Seed welcome chat
    const chatKey = `pathora_chat_${username}`;
    if (!localStorage.getItem(chatKey)) {
      const welcome = [{
        id: '0',
        from: 'staff',
        body: t.portal.chatWelcome(firstName),
        ts: Date.now(),
      }];
      localStorage.setItem(chatKey, JSON.stringify(welcome));
    }
    navigate('/portal');
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', padding: '2rem 1.25rem' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Email preview card */}
        <div className="card page-enter" style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
          {/* Email header */}
          <div style={{ background: 'linear-gradient(135deg, #0B3C49, #0E7C86)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✉️</div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>From: team@pathora.app</p>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.9375rem' }}>{t.reportReady.subject}</p>
            </div>
          </div>

          {/* Email body */}
          <div style={{ padding: '1.5rem' }}>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
              {t.reportReady.greeting} <strong>{firstName}</strong>,
            </p>
            <p style={{ color: '#5a7b85', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
              {t.reportReady.body}
            </p>

            <div style={{ background: 'var(--color-light)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#5a7b85' }}>Portal URL</span>
                <span style={{ color: 'var(--color-teal)', fontWeight: 500 }}>pathora.app/portal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#5a7b85' }}>Username</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{username}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#5a7b85' }}>Password</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{password}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#8aabb0', marginBottom: '1.25rem' }}>
              <FmcLogo />
              <span>· Presented by Find My Career</span>
            </div>

            <button id="report-ready-open-portal" className="btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
              {t.reportReady.openPortal} →
            </button>
          </div>
        </div>

        {/* Actual report preview */}
        {report && <ReportView report={report} />}
      </div>
    </div>
  );
}
