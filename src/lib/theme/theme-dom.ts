const DARK_CLASS = 'pf-v5-theme-dark';

const applyThemeClass = (isDark: boolean): void => {
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
};

export { applyThemeClass };
