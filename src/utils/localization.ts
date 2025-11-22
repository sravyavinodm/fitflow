
// Supported locales
export const supportedLocales = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
} as const;

export type SupportedLocale = keyof typeof supportedLocales;

// Default locale
export const defaultLocale: SupportedLocale = 'en';

// Get user's preferred locale
export const getUserLocale = (): SupportedLocale => {
  // Check localStorage first
  const storedLocale = localStorage.getItem('fitflow-locale') as SupportedLocale;
  if (storedLocale && supportedLocales[storedLocale]) {
    return storedLocale;
  }

  // Check browser language
  const browserLocale = navigator.language.split('-')[0] as SupportedLocale;
  if (browserLocale && supportedLocales[browserLocale]) {
    return browserLocale;
  }

  // Fallback to default
  return defaultLocale;
};

