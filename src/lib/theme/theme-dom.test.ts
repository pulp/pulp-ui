import { afterEach, describe, expect, it } from 'vitest';
import { applyThemeClass } from './theme-dom';

afterEach(() => document.documentElement.classList.remove('pf-v5-theme-dark'));

describe('Unit: applyThemeClass', { tags: ['unit'] }, () => {
  it('adds the dark class when isDark is true', () => {
    applyThemeClass(true);
    expect(
      document.documentElement.classList.contains('pf-v5-theme-dark'),
    ).toStrictEqual(true);
  });

  it('removes the dark class when isDark is false', () => {
    document.documentElement.classList.add('pf-v5-theme-dark');
    applyThemeClass(false);
    expect(
      document.documentElement.classList.contains('pf-v5-theme-dark'),
    ).toStrictEqual(false);
  });
});
