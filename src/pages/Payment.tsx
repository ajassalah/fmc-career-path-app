import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { TwoColLayout } from '../components/TwoColLayout';
import { checkout } from '../lib/api';

const METHOD_ICONS: Record<string, string> = {
  'Card': '💳',
  'Mada': '🏧',
  'KNET': '🔷',
  'Apple Pay': '',
};

export default function Payment() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [method, setMethod] = useState('Card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNum, setCardNum] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/26');
  const [cardCvv, setCardCvv] = useState('123');

  async function handlePay() {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    try {
      const raw = localStorage.getItem('pathora_details');
      const details = raw ? JSON.parse(raw) : { name: 'Demo User', email: 'demo@email.com', phone: '+971501234567', country: 'UAE', consent: true };
      const sessionId = localStorage.getItem('pathora_session') || '';
      const result = await checkout(sessionId, details);

      localStorage.setItem('pathora_username', result.username);
      localStorage.setItem('pathora_password', result.password);
      localStorage.setItem('pathora_report', JSON.stringify(result.report));
      localStorage.setItem('pathora_user', result.username);

      // Trigger confetti via custom event
      window.dispatchEvent(new Event('pathora-confetti'));

      setSuccess(true);
      setTimeout(() => navigate('/report-ready'), 1800);
    } catch {
      setProcessing(false);
    }
  }

  return (
    <TwoColLayout title={t.payment.title} caption="Secure, encrypted payment. No card details stored." step={5}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.5rem' }}>
        {t.payment.title}
      </h1>

      {/* Order summary */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{t.payment.summary}</p>
          <p style={{ fontSize: '0.85rem', color: '#5a7b85' }}>{t.payment.desc}</p>
        </div>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-teal)' }}>AED 99</p>
      </div>

      {/* Payment methods */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {t.payment.methods.map(m => (
          <button
            key={m}
            id={`pay-method-${m.replace(' ', '-').toLowerCase()}`}
            onClick={() => setMethod(m)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: `2px solid ${method === m ? 'var(--color-teal)' : 'rgba(11,60,73,0.15)'}`,
              background: method === m ? 'rgba(14,124,134,0.08)' : 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: method === m ? 'var(--color-teal)' : 'var(--color-ink)',
              transition: 'all 0.15s',
            }}
          >
            {METHOD_ICONS[m]} {m}
          </button>
        ))}
      </div>

      {/* Card form (shown only for Card) */}
      {method === 'Card' && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.875rem' }}>
            <label className="input-label" htmlFor="card-number">Card number</label>
            <input id="card-number" className="input" value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="4242 4242 4242 4242" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label" htmlFor="card-exp">Expiry</label>
              <input id="card-exp" className="input" value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" />
            </div>
            <div>
              <label className="input-label" htmlFor="card-cvv">CVV</label>
              <input id="card-cvv" className="input" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="123" type="password" />
            </div>
          </div>
        </div>
      )}

      {/* Pay button */}
      {success ? (
        <div style={{
          textAlign: 'center', padding: '2rem', background: 'rgba(14,124,134,0.08)',
          borderRadius: 14, border: '2px solid rgba(14,124,134,0.2)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-teal)' }}>{t.payment.success}</p>
          <p style={{ color: '#5a7b85', fontSize: '0.875rem', marginTop: '0.375rem' }}>Preparing your report…</p>
        </div>
      ) : (
        <button
          id="pay-submit"
          className="btn-gold"
          style={{ width: '100%', fontSize: '1.05rem', opacity: processing ? 0.8 : 1 }}
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="9" cy="9" r="7" stroke="rgba(16,37,46,0.3)" strokeWidth="2"/>
                <path d="M9 2a7 7 0 0 1 7 7" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t.payment.processing}
            </span>
          ) : `🔐 ${t.payment.cta}`}
        </button>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8aabb0', marginTop: '0.75rem' }}>
        {t.payment.demo}
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </TwoColLayout>
  );
}
