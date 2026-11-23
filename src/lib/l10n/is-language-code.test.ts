import { describe, expect, it } from 'vitest';
import { isLanguageCode } from './is-language-code';
import { languageNames } from './languages';

describe('Unit: isLanguageCode', { tags: ['unit'] }, () => {
  it.each(Object.keys(languageNames))(
    'accepts the supported code %s',
    (code) => {
      expect(isLanguageCode(code)).toStrictEqual(true);
    },
  );

  it.each(['', ' en', 'EN', 'en-US', 'english'])(
    'rejects the unsupported string %s',
    (value) => {
      expect(isLanguageCode(value)).toStrictEqual(false);
    },
  );

  it.each([undefined, null, 0, 56, true, {}, ['']])(
    'rejects the non-string value %s',
    (value) => {
      expect(isLanguageCode(value)).toStrictEqual(false);
    },
  );
});
