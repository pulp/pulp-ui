import { Button } from '@patternfly/react-core';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import type { FC } from 'react';
import { useTheme } from '../../../lib/theme/theme-context';

const ThemeToggle: FC = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme}>{isDark ? <SunIcon /> : <MoonIcon />}</Button>
  );
};

export { ThemeToggle };
