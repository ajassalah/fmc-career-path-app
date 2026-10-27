import { useLang } from '../i18n/LangContext';

export function Footer({ style }: { style?: React.CSSProperties }) {
  const { t } = useLang();
  return (
    <footer
      className="no-print"
      style={{
        textAlign: 'center',
        padding: '1.25rem 1rem',
        fontSize: '0.8rem',
        color: 'currentColor',
        opacity: 0.55,
        borderTop: '1px solid currentColor',
        marginTop: 'auto',
        ...style,
      }}
    >
      {t.presentedBy}
    </footer>
  );
}
