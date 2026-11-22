import { Button } from '@patternfly/react-core';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import type { FC } from 'react';
import { useTheme } from '../../../lib/theme/theme-context';
import './theme-toggle.css';

const ThemeToggle: FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      className='pulp-theme-toggle'
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export { ThemeToggle };
