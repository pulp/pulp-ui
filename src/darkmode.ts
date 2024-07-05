export const reflectPreference = (value: 'dark' | 'light') => {
  const html = document.firstElementChild.classList;

  if (value === 'dark') {
    html.add('pf-v5-theme-dark');
  } else {
    html.remove('pf-v5-theme-dark');
  }
};

export const getUserChoice: () => 'dark' | 'light' | null = () =>
  ['dark', 'light'].includes(window.localStorage.getItem('pulp-darkmode'))
    ? (window.localStorage.getItem('pulp-darkmode') as 'dark' | 'light')
    : null;

export const getBrowserDefault: () => 'dark' | 'light' = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

reflectPreference(getUserChoice() || getBrowserDefault());
