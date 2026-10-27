import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { getNextQuestion, submitAnswer, undoAnswer, isQuestion } from '../lib/api';

const SUSPENSE = [
  'Interesting…',
  'Your answers point somewhere unexpected.',
  'One more thing…',
  "We're getting close.",
];

interface QuestionData {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
}

export default function Quiz() {
  const { t } = useLang();
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('pathora_session') || '';

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [suspense, setSuspense] = useState('');
  const [slideDir, setSlideDir] = useState<'right' | 'left'>('right');
  const [answerCount, setAnswerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    if (!sessionId) { navigate('/start'); return; }
    try {
      const result = await getNextQuestion(sessionId);
      if (!isQuestion(result)) {
        navigate('/teaser');
        return;
      }
      setQuestion(result.question);
      setProgress(result.progress);
      setSuspense(SUSPENSE[answerCount % SUSPENSE.length]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, navigate, answerCount]);

  useEffect(() => { loadQuestion(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleOption(optionId: string) {
    if (selected || !question) return;
    setSelected(optionId);
    await submitAnswer(sessionId, question.id, optionId);
    await new Promise(r => setTimeout(r, 400));
    setAnswerCount(c => c + 1);
    setSlideDir('right');
    await loadQuestion();
  }

  async function handleBack() {
    if (answerCount === 0) { navigate('/start'); return; }
    await undoAnswer(sessionId);
    setAnswerCount(c => Math.max(0, c - 1));
    setSlideDir('left');
    await loadQuestion();
  }

  const displayProgress = Math.min(100, Math.round(progress * 100));

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Progress bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5a7b85', marginBottom: '0.5rem' }}>
            <span>{answerCount} / 7 answered</span>
            <span>{displayProgress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${displayProgress}%` }} />
          </div>
        </div>

        {/* Suspense line */}
        {answerCount > 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-teal)', fontStyle: 'italic', marginBottom: '0.875rem', textAlign: 'center' }}>
            {suspense}
          </p>
        )}

        {/* Question card */}
        <div
          className={`card ${slideDir === 'right' ? 'slide-right' : 'slide-left'}`}
          key={question?.id}
          style={{ padding: '2rem 1.5rem' }}
        >
          {loading ? (
            <div>
              <div className="skeleton" style={{ height: 24, width: '80%', marginBottom: 24 }} />
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 56, marginBottom: 12, borderRadius: 12 }} />)}
            </div>
          ) : question ? (
            <>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.375rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: '1.5rem',
                lineHeight: 1.35,
              }}>
                {question.prompt}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    id={`quiz-opt-${opt.id}`}
                    className={`option-card${selected === opt.id ? ' selected' : ''}`}
                    onClick={() => handleOption(opt.id)}
                    disabled={!!selected}
                    aria-pressed={selected === opt.id}
                  >
                    {selected === opt.id ? (
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </span>
                    ) : (
                      <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(14,124,134,0.3)', flexShrink: 0 }} />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Back button */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            id="quiz-back"
            className="btn-ghost"
            onClick={handleBack}
            style={{ minHeight: 40, padding: '0 1rem', fontSize: '0.875rem' }}
            aria-label={t.quiz.back}
          >
            ← {t.quiz.back}
          </button>
        </div>
      </div>
    </div>
  );
}
