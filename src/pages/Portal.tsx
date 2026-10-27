import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { getReport, getChat, sendChat } from '../lib/api';
import { ReportView } from '../components/ReportView';
import type { Report, Message } from '../lib/api';

const PLAN_ITEMS = [
  { key: '30d', label: 'Research the top career and talk to 2 people in it.', period: '30 days' },
  { key: '90d', label: 'Take one short course or build one small project.', period: '90 days' },
  { key: '1yr', label: 'Complete a certification or first real experience.', period: '1 year' },
];

export default function Portal() {
  const { t } = useLang();
  const navigate = useNavigate();
  const username = localStorage.getItem('pathora_user') || '';
  const [activeTab, setActiveTab] = useState(0);
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('pathora_token')) { navigate('/portal/login'); }
  }, [navigate]);

  // Load report
  useEffect(() => {
    getReport().then(setReport).catch(() => navigate('/portal/login'));
  }, [navigate]);

  // Load plan state from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`pathora_plan_${username}`) || '{}');
      setChecked(saved);
    } catch { /* ignore */ }
  }, [username]);

  // Poll chat every 2 seconds
  useEffect(() => {
    const load = () => getChat().then(setMessages).catch(() => {});
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  function toggleCheck(key: string) {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    localStorage.setItem(`pathora_plan_${username}`, JSON.stringify(next));
  }

  async function handleSend() {
    if (!chatInput.trim()) return;
    const body = chatInput.trim();
    setChatInput('');
    await sendChat(body);
    const updated = await getChat();
    setMessages(updated);
  }

  const completedCount = PLAN_ITEMS.filter(i => checked[i.key]).length;
  const ringPct = (completedCount / PLAN_ITEMS.length) * 100;

  const details = (() => { try { return JSON.parse(localStorage.getItem('pathora_details') || '{}'); } catch { return {}; } })();
  const firstName = details.name?.split(' ')[0] || username;

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', maxWidth: 720, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#8aabb0', fontSize: '0.875rem' }}>{t.portal.greeting},</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>
          {firstName} 👋
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(11,60,73,0.06)', borderRadius: 12, padding: 4, marginBottom: '1.5rem', gap: 4 }}>
        {t.portal.tabs.map((tab, i) => (
          <button
            key={tab}
            id={`portal-tab-${i}`}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1, padding: '0.625rem 0.5rem', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 600, fontSize: '0.8rem',
              background: activeTab === i ? 'white' : 'transparent',
              color: activeTab === i ? 'var(--color-teal)' : '#8aabb0',
              boxShadow: activeTab === i ? '0 2px 8px rgba(11,60,73,0.12)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && report && <ReportView report={report} />}

      {activeTab === 1 && (
        <div className="page-enter">
          {/* Progress ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(11,60,73,0.08)' }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" stroke="rgba(14,124,134,0.12)" strokeWidth="8" fill="none"/>
              <circle cx="36" cy="36" r="30" stroke="var(--color-teal)" strokeWidth="8" fill="none"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - ringPct / 100)}`}
                strokeLinecap="round"
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="36" y="41" textAnchor="middle" fill="var(--color-teal)" fontSize="14" fontWeight="700">{completedCount}/{PLAN_ITEMS.length}</text>
            </svg>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>My action plan</p>
              <p style={{ fontSize: '0.875rem', color: '#8aabb0' }}>{completedCount} of {PLAN_ITEMS.length} milestones completed</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PLAN_ITEMS.map(item => (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '1rem 1.25rem',
                  background: 'white', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${checked[item.key] ? 'rgba(14,124,134,0.3)' : 'rgba(11,60,73,0.07)'}`,
                  transition: 'all 0.15s',
                  opacity: checked[item.key] ? 0.7 : 1,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, border: '2px solid',
                  borderColor: checked[item.key] ? 'var(--color-teal)' : 'rgba(11,60,73,0.25)',
                  background: checked[item.key] ? 'var(--color-teal)' : 'transparent',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                  transition: 'all 0.15s',
                }}>
                  {checked[item.key] && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.period}</span>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink)', lineHeight: 1.5, textDecoration: checked[item.key] ? 'line-through' : 'none' }}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 400 }}>
          {/* Chat messages */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem',
            padding: '1rem', background: 'white', borderRadius: 14, marginBottom: '0.75rem',
            border: '1px solid rgba(11,60,73,0.07)',
          }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: '#8aabb0', fontSize: '0.875rem', margin: 'auto' }}>No messages yet</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={msg.from === 'user' ? 'bubble-user' : 'bubble-staff'}>{msg.body}</div>
                <span style={{ fontSize: '0.7rem', color: '#c0cdd0', marginTop: '0.25rem', marginInline: '0.375rem' }}>
                  {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8aabb0', textAlign: 'center', marginBottom: '0.5rem' }}>{t.portal.staffNote}</p>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <input
              id="portal-chat-input"
              className="input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={t.portal.chatPlaceholder}
              style={{ flex: 1 }}
              aria-label="Chat input"
            />
            <button id="portal-chat-send" className="btn-primary" style={{ minWidth: 80, minHeight: 48 }} onClick={handleSend}>
              {t.portal.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
