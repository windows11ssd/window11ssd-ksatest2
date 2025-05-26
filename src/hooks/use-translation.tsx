"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Language } from '@/lib/types';
import enMessages from '@/locales/en.json';
import arMessages from '@/locales/ar.json';
import useLocalStorage from './use-local-storage';

type Messages = typeof enMessages;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: keyof Messages, replacements?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messages: Record<Language, Messages> = {
  en: enMessages,
  ar: arMessages,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => { // Changed children prop type
  const [language, setLanguageState] = useLocalStorage<Language>('app-language', 'ar'); // Default to Arabic
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // The useEffect below will handle updating document.documentElement attributes
    // when `language` state (from useLocalStorage) changes.
  };
  
  useEffect(() => {
    if (isMounted && typeof document !== 'undefined') {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, isMounted]);


  const translate = (key: keyof Messages, replacements?: Record<string, string | number>): string => {
    let message = messages[language][key] || messages['en'][key] || String(key); // Fallback to English then key
    if (replacements) {
      Object.keys(replacements).forEach(pKey => {
        message = message.replace(new RegExp(`{${pKey}}`, 'g'), String(replacements[pKey]));
      });
    }
    return message;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // The provider should always render. Client-side effects depending on `isMounted`
  // are handled within their respective useEffects.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, dir }}>
      {children} {/* Render children directly */}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
