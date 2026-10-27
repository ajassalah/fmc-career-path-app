import { useState, useEffect, useRef } from 'react';
import { useLang } from '../i18n/LangContext';
import { getStaffChats, staffReply } from '../lib/api';
import type { Message } from '../lib/api';

interface Chat { accountId: string; messages: Message[]; }

export default function Staff() {
  const { t } = useLang();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  function loadChats() {
    getStaffChats().then(setChats);
  }

  // Poll every 2 seconds for live updates
  useEffect(() => {
    loadChats();
    const iv = setInterval(loadChats, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected, chats]);

  async function handleReply() {
    if (!reply.trim() || !selected) return;
    await staffReply(selected, reply.trim());
    setReply('');
    loadChats();
  }

  const selectedChat = chats.find(c => c.accountId === selected);

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex' }}>
      {/* Left: chat list */}
      <aside style={{
        width: 280, flexShrink: 0,
        borderInlineEnd: '1px solid rgba(11,60,73,0.1)',
        background: 'white',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(11,60,73,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', flex: 1 }}>
              {t.staff.title}
            </h1>
            <span style={{
              fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
              background: '#e53e3e', color: 'white', padding: '2px 6px', borderRadius: 4,
            }}>
              {t.staff.badge}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8aabb0', marginTop: '0.25rem' }}>{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.length === 0 && (
            <p style={{ textAlign: 'center', color: '#8aabb0', fontSize: '0.8rem', padding: '2rem 1rem' }}>
              No chats yet. Complete the customer flow first.
            </p>
          )}
          {chats.map(chat => {
            const last = chat.messages[chat.messages.length - 1];
            const unread = chat.messages.filter(m => m.from === 'user').length;
            return (
              <button
                key={chat.accountId}
                id={`staff-chat-${chat.accountId}`}
                onClick={() => setSelected(chat.accountId)}
                style={{
                  width: '100%', textAlign: 'start', padding: '0.875rem 1.25rem',
                  background: selected === chat.accountId ? 'rgba(14,124,134,0.07)' : 'transparent',
                  border: 'none', borderBottom: '1px solid rgba(11,60,73,0.06)', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-ink)' }}>
                    @{chat.accountId}
                  </span>
                  {unread > 0 && (
                    <span style={{
                      background: 'var(--color-teal)', color: 'white', borderRadius: 999,
                      fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px',
                    }}>{unread}</span>
                  )}
                </div>
                {last && (
                  <p style={{ fontSize: '0.8rem', color: '#8aabb0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {last.body}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right: conversation */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-light)' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8aabb0', fontSize: '0.9375rem' }}>
            {t.staff.selectChat}
          </div>
        ) : (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {selectedChat?.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: '#8aabb0', marginBottom: '0.25rem', marginInline: '0.375rem' }}>
                    {msg.from === 'user' ? `@${selected}` : 'Sara (Staff)'}
                  </div>
                  <div className={msg.from === 'user' ? 'bubble-staff' : 'bubble-user'}>{msg.body}</div>
                  <span style={{ fontSize: '0.7rem', color: '#c0cdd0', marginTop: '0.25rem', marginInline: '0.375rem' }}>
                    {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Reply input */}
            <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid rgba(11,60,73,0.08)', display: 'flex', gap: '0.625rem' }}>
              <input
                id="staff-reply-input"
                className="input"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReply()}
                placeholder={t.staff.replyPlaceholder}
                style={{ flex: 1 }}
                aria-label="Staff reply input"
              />
              <button id="staff-reply-send" className="btn-primary" style={{ minWidth: 80, minHeight: 48 }} onClick={handleReply}>
                {t.staff.reply}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
