// NOTE: keep in sync with `locales` in lingui.config.js
const availableLanguages = ['en', 'es', 'fr', 'ko', 'nl', 'ja', 'zh'];
const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ko: '한국어',
  nl: 'Nederlands',
  ja: '日本語',
  zh: '中文',
};

type LanguageCode = keyof typeof languageNames;

export { availableLanguages, languageNames }
export type { LanguageCode }
