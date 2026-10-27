import React, { createContext, useContext, useState } from 'react';
import en from './en';
import ar from './ar';
import type { I18n } from './en';

type Lang = 'en' | 'ar';

interface LangCtx {
  lang: Lang;
  t: I18n;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: 'en', t: en, setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };

  const t = lang === 'ar' ? ar as unknown as I18n : en;

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
