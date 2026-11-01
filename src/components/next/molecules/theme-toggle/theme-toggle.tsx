import { Button } from '@patternfly/react-core';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import type { FC } from 'react';

const ThemeToggle: FC = () => {
  const isDark = false;
  return <Button>{isDark ? <SunIcon /> : <MoonIcon />}</Button>;
};

export { ThemeToggle };
