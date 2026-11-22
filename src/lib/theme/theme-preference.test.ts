import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSystemTheme,
  readStoredTheme,
  subscribeToSystemTheme,
  writeStoredTheme,
} from './theme-preference';

const STORAGE_KEY = 'pulp-ui-theme';

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('Unit: readStoredTheme', { tags: ['unit'] }, () => {
  it.each(['dark', 'light'])('reads a stored %s value', (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    expect(readStoredTheme()).toStrictEqual(theme);
  });

  it.each(['blue', 'DARK', ''])(
    'returns null for invalid stored value %s',
    (value) => {
      window.localStorage.setItem(STORAGE_KEY, value);
      expect(readStoredTheme()).toStrictEqual(null);
    },
  );
});

describe('Unit: writeStoredTheme', { tags: ['unit'] }, () => {
  it.each(['dark', 'light'] as const)('persists %s to storage', (theme) => {
    writeStoredTheme(theme);
    expect(window.localStorage.getItem(STORAGE_KEY)).toStrictEqual(theme);
  });

  it('removes the key when given null', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark');
    writeStoredTheme(null);
    expect(window.localStorage.getItem(STORAGE_KEY)).toStrictEqual(null);
  });
});

const createFakeMediaQueryList = (matches = false): MediaQueryList => {
  const target = new EventTarget();

  return {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    // NOTE: Deprecated from the web standard. Only added to satifiy the type.
    // REF: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/removeListener
    addListener: () => undefined,
    removeListener: () => undefined,
  };
};

const dispatchMediaChange = (
  mediaQueryList: MediaQueryList,
  matches: boolean,
): void => {
  mediaQueryList.dispatchEvent(Object.assign(new Event('change'), { matches }));
};

describe('Unit: subscribeToSystemTheme', { tags: ['unit'] }, () => {
  it('invokes the callback with "dark" when the media query matches', () => {
    const mediaQueryList = createFakeMediaQueryList();
    vi.spyOn(window, 'matchMedia').mockReturnValueOnce(mediaQueryList);

    const onChange = vi.fn();
    subscribeToSystemTheme(onChange);

    dispatchMediaChange(mediaQueryList, true);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('dark');
  });

  it('invokes the callback "light" when the media query does not match', () => {
    const mediaQueryList = createFakeMediaQueryList();
    vi.spyOn(window, 'matchMedia').mockReturnValueOnce(mediaQueryList);

    const onChange = vi.fn();
    subscribeToSystemTheme(onChange);

    dispatchMediaChange(mediaQueryList, false);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('light');
  });

  it('stops invoking the callback after the returned cleanup is called', () => {
    const mediaQueryList = createFakeMediaQueryList();
    vi.spyOn(window, 'matchMedia').mockReturnValueOnce(mediaQueryList);

    const onChange = vi.fn();
    const unsubscribe = subscribeToSystemTheme(onChange);
    unsubscribe();

    dispatchMediaChange(mediaQueryList, true);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Unit: getSystemTheme', { tags: ['unit'] }, () => {
  it.each([
    [true, 'dark'],
    [false, 'light'],
  ])('returns %s when matchMedia.matches is %s', (matches, expected) => {
    vi.spyOn(window, 'matchMedia').mockReturnValueOnce(
      createFakeMediaQueryList(matches),
    );
    expect(getSystemTheme()).toStrictEqual(expected);
  });
});
