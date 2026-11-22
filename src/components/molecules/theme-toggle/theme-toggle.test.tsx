import { MoonIconConfig, SunIconConfig } from '@patternfly/react-icons';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeContext } from '../../../lib/theme/theme-context';
import { ThemeToggle } from './theme-toggle';

afterEach(cleanup);

const renderWithTheme = (isDark: boolean, toggleTheme = vi.fn()) =>
  render(<ThemeToggle />, {
    wrapper: ({ children }) => (
      <ThemeContext.Provider
        value={{ isDark, isSystemDefault: false, toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    ),
  });

describe('Component: ThemeToggle', { tags: ['component'] }, () => {
  it('renders the moon icon in light mode', () => {
    renderWithTheme(false);
    const buttonPath = screen.getByRole('button').querySelector('path');
    expect(buttonPath.getAttribute('d')).toStrictEqual(MoonIconConfig.svgPath);
  });

  it('renders the sun icon in dark mode', () => {
    renderWithTheme(true);
    const buttonPath = screen.getByRole('button').querySelector('path');
    expect(buttonPath.getAttribute('d')).toStrictEqual(SunIconConfig.svgPath);
  });

  it('calls toggleTheme when clicked', () => {
    const toggleTheme = vi.fn();
    renderWithTheme(false, toggleTheme);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it('applies the pulp-theme-toggle class', () => {
    renderWithTheme(false);
    const button = screen.getByRole('button');
    expect(button.classList.contains('pulp-theme-toggle')).toStrictEqual(true);
  });

  it.each([
    [false, 'Switch to dark mode'],
    [true, 'Switch to light mode'],
  ])('has an acessible label for isDark=%s', (isDark, expected) => {
    renderWithTheme(isDark);
    const button = screen.getByRole('button', { name: expected });
    expect(button).toBeTruthy();
  });
});
