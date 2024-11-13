import { createContext, useContext, useState } from 'react';
import { IntlProvider } from 'use-intl';
import translations from '../translations';

const initialState = {
  language: 'en',
  setLanguage: () => null,
};

const LanguageProviderContext = createContext(initialState);

export function LanguageProvider({
                                   children,
                                   defaultLanguage = 'en',
                                   storageKey = 'vite-ui-language',
                                   ...props
                                 }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(storageKey) || defaultLanguage
  );

  const value = {
    language,
    setLanguage: (lang) => {
      localStorage.setItem(storageKey, lang);
      setLanguage(lang);
    },
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      <IntlProvider locale={language} messages={translations[language]}>
        {children}
      </IntlProvider>
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider');

  return context;
};

