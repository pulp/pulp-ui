import { type LanguageCode, languageNames } from './languages';

const isLanguageCode = (value: unknown): value is LanguageCode =>
  typeof value === 'string' && Object.keys(languageNames).includes(value);

export { isLanguageCode };
