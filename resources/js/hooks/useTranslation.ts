import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import arTranslations from '@/locales/ar.json';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';

const translations = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

type Locale = 'en' | 'fr' | 'ar';
type TranslationKey = keyof typeof enTranslations;

export function useTranslation() {
  const { props } = usePage();
  
  // ✅ Get locale from server props (passed from Laravel)
  const serverLocale = (props as any).locale || 'en';
  
  const [locale, setLocaleState] = useState<Locale>(serverLocale);
  const [t, setT] = useState(translations[serverLocale as Locale] || translations.en);

  // ✅ Update translations when server locale changes
  useEffect(() => {
    if (serverLocale && translations[serverLocale as Locale]) {
      setLocaleState(serverLocale);
      setT(translations[serverLocale]);
      
      // Update DOM attributes
      document.documentElement.dir = serverLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = serverLocale;
    }
  }, [serverLocale]);

  const setLocale = (newLocale: string) => {
    const typedLocale = newLocale as Locale;
    
    if (translations[typedLocale]) {
      setLocaleState(typedLocale);
      setT(translations[typedLocale]);
      
      // Update DOM immediately for better UX
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