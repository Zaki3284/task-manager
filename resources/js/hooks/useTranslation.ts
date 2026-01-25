import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import arTranslations from '@/locales/ar.json';

const translations = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

type Locale = 'en' | 'fr' | 'ar';
type TranslationKey = keyof typeof enTranslations;

export function useTranslation() {
  const { props } = usePage();
  const serverLocale = (props as any).locale || 'en';
  
  const [locale, setLocaleState] = useState<Locale>(serverLocale);
  const [t, setT] = useState(translations[serverLocale as Locale] || translations.en);

  useEffect(() => {
    const savedLocale = (localStorage.getItem('preferred_language') as Locale) || serverLocale;
    
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
      setT(translations[savedLocale]);
      document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLocale;
    }
  }, [serverLocale]);

  const setLocale = (newLocale: string) => {
    const typedLocale = newLocale as Locale;
    
    if (translations[typedLocale]) {
      setLocaleState(typedLocale);
      setT(translations[typedLocale]);
      localStorage.setItem('preferred_language', newLocale);
      document.documentElement.dir = typedLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = typedLocale;
    }
  };

  const translate = (key: string): string => {
    return (t as any)[key] || key;
  };

  return {
    t: translate,
    locale,
    setLocale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    translations: t,
  };
}