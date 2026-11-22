import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './theme-context';
import { applyThemeClass } from './theme-dom';
import {
  type Theme,
  getSystemTheme,
  readStoredTheme,
  subscribeToSystemTheme,
  writeStoredTheme,
} from './theme-preference';

vi.mock('./theme-preference');
vi.mock('./theme-dom');

afterEach(() => {
  vi.resetAllMocks();
});

const renderUseTheme = () =>
  renderHook(() => useTheme(), { wrapper: ThemeProvider });

describe('Component: ThemeProvider', { tags: ['component'] }, () => {
  it.each([
    ['dark', true],
    ['light', false],
  ] as const)('uses the stored preference %s as isDark', (stored, expected) => {
    vi.mocked(readStoredTheme).mockReturnValueOnce(stored);
    vi.mocked(getSystemTheme).mockReturnValueOnce('light');
    vi.mocked(subscribeToSystemTheme).mockReturnValueOnce(() => {});

    const { result } = renderUseTheme();

    expect(result.current.isDark).toStrictEqual(expected);
    expect(result.current.isSystemDefault).toStrictEqual(false);
  });

  it('falls back to the system theme when no preference is stored', () => {
    vi.mocked(readStoredTheme).mockReturnValueOnce(null);
    vi.mocked(getSystemTheme).mockReturnValueOnce('dark');
    vi.mocked(subscribeToSystemTheme).mockReturnValueOnce(() => {});

    const { result } = renderUseTheme();

    expect(result.current.isDark).toStrictEqual(true);
    expect(result.current.isSystemDefault).toStrictEqual(true);
  });

  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
  });

  it('applies the theme class on mount and whenever isDark changes', () => {
    vi.mocked(readStoredTheme).mockReturnValueOnce('light');
    vi.mocked(getSystemTheme).mockReturnValueOnce('light');
    vi.mocked(subscribeToSystemTheme).mockReturnValueOnce(() => {});

    const { result } = renderUseTheme();
    expect(applyThemeClass).toHaveBeenCalledExactlyOnceWith(false);
    vi.mocked(applyThemeClass).mockClear();

    act(() => result.current.toggleTheme());
    expect(applyThemeClass).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('ignores system theme changes once an explicit preference is set', () => {
    vi.mocked(readStoredTheme).mockReturnValueOnce('light');
    vi.mocked(getSystemTheme).mockReturnValueOnce('light');

    let onSystemChange: (theme: Theme) => void = () => {};
    vi.mocked(subscribeToSystemTheme).mockImplementationOnce((onChange) => {
      onSystemChange = onChange;
      return () => {};
    });

    const { result } = renderUseTheme();
    act(() => onSystemChange('dark'));

    expect(result.current.isDark).toStrictEqual(false);
  });

  it('updates isDark when the system theme changes while following system preference', () => {
    vi.mocked(readStoredTheme).mockReturnValueOnce(null);
    vi.mocked(getSystemTheme).mockReturnValueOnce('light');

    let onSystemChange: (theme: Theme) => void = () => {};
    vi.mocked(subscribeToSystemTheme).mockImplementationOnce((onChange) => {
      onSystemChange = onChange;
      return () => {};
    });

    const { result } = renderUseTheme();
    expect(result.current.isDark).toStrictEqual(false);

    act(() => onSystemChange('dark'));
    expect(result.current.isDark).toStrictEqual(true);
  });

  it('cycles light -> dark -> system -> light on successive toggles', () => {
    vi.mocked(readStoredTheme).mockReturnValueOnce('light');
    vi.mocked(getSystemTheme).mockReturnValueOnce('light');
    vi.mocked(subscribeToSystemTheme).mockReturnValueOnce(() => {});

    const { result } = renderUseTheme();

    act(() => result.current.toggleTheme());
    expect(result.current.isDark).toStrictEqual(true);
    expect(result.current.isSystemDefault).toStrictEqual(false);
    expect(writeStoredTheme).toHaveBeenNthCalledWith(1, 'dark');

    act(() => result.current.toggleTheme());
    expect(result.current.isDark).toStrictEqual(false);
    expect(result.current.isSystemDefault).toStrictEqual(true);
    expect(writeStoredTheme).toHaveBeenNthCalledWith(2, null);

    act(() => result.current.toggleTheme());
    expect(result.current.isDark).toStrictEqual(false);
    expect(result.current.isSystemDefault).toStrictEqual(false);
    expect(writeStoredTheme).toHaveBeenNthCalledWith(3, 'light');
  });
});
