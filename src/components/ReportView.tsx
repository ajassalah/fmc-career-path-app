import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Report } from '../lib/api';

interface Props { report: Report; }

const DOMAIN_COLORS: Record<string, string> = {
  tech:     '#0E7C86',
  business: '#D9A441',
  health:   '#22a16a',
  creative: '#9b59b6',
  service:  '#e67e22',
};

export function ReportView({ report }: Props) {
  const { t } = useLang();
  const [planTab, setPlanTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const planKeys = Object.keys(report.plan) as (keyof typeof report.plan)[];

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div id="report-view" className="page-enter">
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #0B3C49, #0E7C86)', color: 'white' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.375rem' }}>
          {t.report.profileLabel}
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.625rem', fontWeight: 700 }}>
          "{report.profile}"
        </h2>
      </div>

      {/* Top careers */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-ink)' }}>
          {t.report.topCareers}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {report.top.map((item, i) => {
            const color = DOMAIN_COLORS[item.domain] || 'var(--color-teal)';
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{item.career}</span>
                    <span style={{ fontSize: '0.75rem', color: '#8aabb0', marginInlineStart: '0.5rem', textTransform: 'capitalize' }}>({item.domain})</span>
                  </div>
                  <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{item.match}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.match}%`, background: color, transition: 'width 1s ease' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pathway */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: '0.875rem', color: 'var(--color-ink)' }}>
          {t.report.pathway}
        </h3>
        <p style={{ color: '#3d5f6a', lineHeight: 1.7, fontSize: '0.9375rem' }}>{report.pathway}</p>
      </div>

      {/* Action plan tabs */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-ink)' }}>
          {t.report.plan}
        </h3>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--color-light)', borderRadius: 10, padding: 4 }}>
          {t.report.planTabs.map((tab, i) => (
            <button
              key={tab}
              id={`plan-tab-${i}`}
              onClick={() => setPlanTab(i)}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem',
                background: planTab === i ? 'white' : 'transparent',
                color: planTab === i ? 'var(--color-teal)' : '#8aabb0',
                boxShadow: planTab === i ? '0 2px 8px rgba(11,60,73,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <p style={{ color: '#3d5f6a', lineHeight: 1.7, fontSize: '0.9375rem', minHeight: 60 }}>
          {report.plan[planKeys[planTab]]}
        </p>
      </div>

      {/* Actions */}
      <div className="no-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button id="report-download-pdf" className="btn-primary" onClick={handlePrint} style={{ flex: 1, minWidth: 140 }}>
          📄 {t.report.downloadPdf}
        </button>
        <button id="report-share" className="btn-ghost" onClick={handleShare} style={{ flex: 1, minWidth: 140 }}>
          {copied ? `✓ ${t.report.copied}` : `🔗 ${t.report.share}`}
        </button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          #report-view .no-print { display: none !important; }
          body { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}
