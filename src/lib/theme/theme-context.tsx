import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { applyThemeClass } from './theme-dom';
import {
  type Theme,
  getSystemTheme,
  readStoredTheme,
  subscribeToSystemTheme,
  writeStoredTheme,
} from './theme-preference';

interface ThemeContextProps {
  isDark: boolean;
  isSystemDefault: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [preference, setPreference] = useState<Theme | null>(() =>
    readStoredTheme(),
  );
  const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme());

  useEffect(() => subscribeToSystemTheme(setSystemTheme), []);

  const isSystemDefault = preference === null;
  const isDark = (preference ?? systemTheme) === 'dark';

  useEffect(() => applyThemeClass(isDark), [isDark]);

  const toggleTheme = (): void => {
    let nextTheme: Theme | null = null;

    switch (preference) {
      case 'light':
        nextTheme = 'dark';
        break;
      case 'dark':
        nextTheme = null;
        break;
      default:
        nextTheme = 'light';
        break;
    }

    writeStoredTheme(nextTheme);
    setPreference(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, isSystemDefault, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (): ThemeContextProps => {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return ctx;
};

export { ThemeProvider, useTheme };
