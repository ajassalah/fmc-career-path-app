// ─── Two-column layout used on all customer flow screens ──────
import React from 'react';

interface Props {
  title: string;
  caption?: string;
  children: React.ReactNode;
  step?: number;
}

const STEP_ICONS = ['🔍', '❓', '✨', '📝', '💳', '📬', '🏠'];

export function TwoColLayout({ title, caption, children, step = 0 }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 60px)',
        alignItems: 'stretch',
      }}
    >
      {/* Left: brand panel (desktop only) */}
      <aside
        className="no-print"
        style={{
          display: 'none',
          width: '38%',
          maxWidth: 420,
          flexShrink: 0,
          background: 'linear-gradient(160deg, #0B3C49 0%, #0E7C86 100%)',
          padding: '3.5rem 2.5rem',
          position: 'sticky',
          top: 60,
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        id="brand-panel"
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{STEP_ICONS[step] || '✨'}</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '0.875rem' }}>
          {title}
        </h2>
        {caption && (
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>
            {caption}
          </p>
        )}
        <div style={{ marginTop: 'auto', paddingTop: '3rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          Presented by Find My Career
        </div>
      </aside>

      {/* Right: main content */}
      <main
        style={{
          flex: 1,
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: 520 }} className="page-enter">
          {children}
        </div>
      </main>

      {/* Show left panel on desktop via inline style — avoid Tailwind dependency */}
      <style>{`@media (min-width: 768px) { #brand-panel { display: flex !important; } }`}</style>
    </div>
  );
}
