export type AppTheme = 'cyber' | 'luminous' | 'dark';

const THEME_KEY = 'job_search_os_theme_v3';

export const getStoredTheme = (): AppTheme => {
  try {
    localStorage.removeItem('job_search_os_theme');
    localStorage.removeItem('job_search_os_theme_v2');
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'luminous') {
      // Migrate luminous to cyber so the user gets the true full-width tactical dark UI
      localStorage.setItem(THEME_KEY, 'cyber');
      return 'cyber';
    }
    if (saved === 'cyber' || saved === 'dark') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'cyber'; // Default to the AAA Tactical High-Contrast Console
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
