/**
 * Resolves public asset URLs respecting Vite's base path and GitHub Pages repo hosting
 */
export function resolveAsset(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If running in browser and hosted on GitHub Pages under /Headhunter/
  if (typeof window !== 'undefined' && window.location) {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/([^/]+)(\/|$)/);
    if (match && match[1] && !match[1].includes('.') && (match[1].toLowerCase() === 'headhunter' || match[1].toLowerCase() === 'empleo')) {
      return `/${match[1]}/${cleanPath}`;
    }
  }

  const base = import.meta.env.BASE_URL || './';
  return `${base}${cleanPath}`;
}
