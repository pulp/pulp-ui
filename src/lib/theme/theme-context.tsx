import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
} from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>(null);

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const isDark = true;

  const toggleTheme = (): void => {
    let s = null;
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
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
