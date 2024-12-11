import { t } from '@lingui/core/macro';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import { useEffect, useState } from 'react';
import { StatefulDropdown } from 'src/components';
import {
  getBrowserDefault,
  getUserChoice,
  reflectPreference,
} from 'src/darkmode';

export function DarkmodeSwitcher(_props) {
  const [userChoice, setUserChoice] = useState(getUserChoice());
  const [browserDefault, setBrowserDefault] = useState(getBrowserDefault());

  useEffect(() => {
    const onBrowserChange = ({ matches: newIsDark }) =>
      setBrowserDefault(newIsDark ? 'dark' : 'light');

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', onBrowserChange);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onBrowserChange);
  }, []);

  const isDark = (userChoice || browserDefault) === 'dark';
  useEffect(() => reflectPreference(isDark ? 'dark' : 'light'), [isDark]);

  const set = (value: 'dark' | 'light' | null) => {
    window.localStorage.setItem('pulp-darkmode', value);
    setUserChoice(value);
  };

  const currentOrDefault = (value) =>
    userChoice === value && browserDefault === value
      ? t`(current, default)`
      : userChoice === value
        ? t`(current)`
        : browserDefault === value
          ? t`(default)`
          : null;

  return (
    <StatefulDropdown
      ariaLabel={isDark ? t`Switch to light mode` : t`Switch to dark mode`}
      data-cy='darkmode-dropdown'
      defaultText={isDark ? <MoonIcon /> : <SunIcon />}
      toggleType='icon'
      items={[
        <DropdownItem
          key={'light'}
          onClick={() => set('light')}
          isDisabled={userChoice === 'light'}
          icon={<SunIcon />}
        >
          {t`Light`} {currentOrDefault('light')}
        </DropdownItem>,
        <DropdownItem
          key={'dark'}
          onClick={() => set('dark')}
          isDisabled={userChoice === 'dark'}
          icon={<MoonIcon />}
        >
          {t`Dark`} {currentOrDefault('dark')}
        </DropdownItem>,
        <DropdownItem
          key='unset'
          onClick={() => set(null)}
          isDisabled={!userChoice}
        >
          {t`Reset`}
        </DropdownItem>,
      ]}
    />
  );
}
