import { useLang } from '../i18n/LangContext';

export function FmcLogo({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        color: 'var(--color-teal)',
        letterSpacing: '-0.01em',
        fontSize: '0.95em',
      }}
      aria-label="Find My Career logo"
    >
      {t.findMyCareerId}
    </span>
  );
}
