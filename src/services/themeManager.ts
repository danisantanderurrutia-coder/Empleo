export type AppTheme = 'luminous' | 'cyber' | 'dark';

const THEME_KEY = 'job_search_os_theme_v2';

export const getStoredTheme = (): AppTheme => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'luminous' || saved === 'cyber' || saved === 'dark') {
    return saved;
  }
  return 'luminous'; // Default to the fresh, crisp, luminous command console
};

export const saveStoredTheme = (theme: AppTheme): void => {
  localStorage.setItem(THEME_KEY, theme);
  applyThemeToDOM(theme);
};

export const applyThemeToDOM = (theme: AppTheme): void => {
  const root = document.documentElement;
  root.classList.remove('theme-luminous', 'theme-cyber', 'theme-dark');
  root.classList.add(`theme-${theme}`);
  root.setAttribute('data-theme', theme);
};
