type Theme = 'dark' | 'light';

const STORAGE_KEY = 'pulp-ui-theme';

const readStoredTheme = (): Theme | null => {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  switch (stored) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    default:
      return null;
  }
};

const writeStoredTheme = (theme: Theme | null): void => {
  if (theme === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
};

const subscribeToSystemTheme = (
  onChange: (theme: Theme) => void,
): (() => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = (e: MediaQueryListEvent): void =>
    onChange(e.matches ? 'dark' : 'light');

  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
};

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export {
  readStoredTheme,
  writeStoredTheme,
  subscribeToSystemTheme,
  getSystemTheme,
};
export type { Theme };
