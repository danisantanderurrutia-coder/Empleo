import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Strict Blacklist for UI Navigation Junk
const JUNK_TITLE_EXACT = new Set([
  'inicio', 'home', 'registro', 'registrarse', 'register', 'login', 'acceso', 'acceso candidatos',
  'contacto', 'contact', 'contactar', 'sobre nosotros', 'about us', 'quiénes somos', 'servicios',
  'aviso legal', 'legal notice', 'privacidad', 'privacy policy', 'cookies', 'mapa web', 'sitemap',
  'ver más', 'saber más', 'read more', 'click aquí', 'haz clic', 'buscar', 'search', 'menú', 'menu',
  'volver', 'atrás', 'back', 'top', 'arriba', 'compartir', 'share', 'facebook', 'twitter', 'linkedin',
  'instagram', 'youtube', 'rss', 'canal rss', 'blog', 'noticias', 'news', 'prensa', 'press', 'empleo',
  'ofertas', 'ofertas de empleo', 'trabaja con nosotros', 'carreras', 'careers', 'join us', 'únete',
  'portal de empleo', 'ofertas de trabajo', 'ver todas', 'ver todas las ofertas'
]);

const PROFESSIONAL_ROLE_KEYWORDS = [
  'consultor', 'consultora', 'técnico', 'técnica', 'investigador', 'investigadora', 'analista',
  'especialista', 'coordinador', 'coordinadora', 'responsable', 'ingeniero', 'ingeniera',
  'director', 'directora', 'gestor', 'gestora', 'becario', 'becaria', 'manager', 'scientist',
  'officer', 'fellow', 'postdoc', 'phd', 'intern', 'asesor', 'asesora', 'experto', 'experta',
  'docente', 'profesor', 'profesora', 'jefe', 'jefa', 'líder', 'leader', 'developer', 'diseñador',
  'adaptación', 'salvaguardias', 'resilientes'
];

// Unrelated Roles & Cities Blacklist (e.g. Sales SaaS, Austin TX, 401k)
const UNRELATED_JUNK_KEYWORDS = [
  'sales manager', 'sales director', 'saas', '401k', 'austin', 'tx', 'texas', 'account executive',
  'customer success', 'accountant', 'nurse', 'real estate', 'crypto', 'casino', 'barista', 'insurance',
  'why_remote', '/why_remote', '/wizard', '/about', '/faq', '/pricing', '/benefits', '/guide'
];

// Generic Landing Pages regex (Discards generic URLs like domain.com/empleo or domain.com/careers)
const GENERIC_LANDING_URL_REGEX = /\/(empleo|careers|jobs|vacancies|trabaja-con-nosotros|work-with-us|join-us|unete-a-idom|why_remote)\/?$/i;

// Blocks non-http(s) and local/private targets (SSRF protection for dev middleware)
function isSafeTargetUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const h = u.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.local') || h === '::1' || h === '[::1]') return false;
    if (/^(127|10|0)\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
    return true;
  } catch {
    return false;
  }
}

function liveScraperPlugin(): Plugin {
  return {
    name: 'live-scraper-plugin',
    configureServer(server) {
      // URL Liveness Checker Middleware
      server.middlewares.use('/api/check-link', async (req, res) => {
        try {
          const urlParams = new URL(req.url || '', `http://${req.headers.host}`);
          let targetUrl = urlParams.searchParams.get('url');

          if (!targetUrl) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ alive: false, reason: 'Missing URL' }));
            return;
          }

          if (!isSafeTargetUrl(targetUrl)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ alive: false, reason: 'URL not allowed' }));
            return;
          }

          const fetchRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });

          const isAlive = fetchRes.status >= 200 && fetchRes.status < 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ alive: isAlive, status: fetchRes.status, url: targetUrl }));
        } catch (err: any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ alive: false, error: err.message }));
        }
      });

      // Live Scraper Middleware with High Precision Position Detection & Deep URL Enforcement
      server.middlewares.use('/api/scrape-live', async (req, res) => {
        try {
          const urlParams = new URL(req.url || '', `http://${req.headers.host}`);
          let targetUrl = urlParams.searchParams.get('url') || '';

          // 1. ATS Subdomain Auto-Resolver & Oracle Taleo Title Extractor
          if (targetUrl && !isSafeTargetUrl(targetUrl)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'URL not allowed' }));
            return;
          }
          let fetchUrl = targetUrl;
          if (targetUrl.includes('idom.com')) {
            // Google RSS Dorking for IDOM ATS subdomain
            fetchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent('site:career.idom.com/job "salvaguardias" OR "cambio climático" OR "resiliencia" OR "medio ambiente"')}&hl=es-ES&gl=ES&ceid=ES:es`;
          } else if (targetUrl.includes('fao.org') || targetUrl.includes('jobdetail.ftl')) {
            // Taleo / FAO direct URL title extraction via meta parsing & RSS fallback
            fetchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent('site:jobs.fao.org/careersection/fao_external/jobdetail.ftl "Climate Risk"')}&hl=es-ES&gl=ES&ceid=ES:es`;
          } else if (targetUrl.includes('google.com') || targetUrl.includes('buscar')) {
            fetchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent('empleo medio ambiente clima suelos euskadi bilbao españa')}&hl=es-ES&gl=ES&ceid=ES:es`;
          }

          const fetchRes = await fetch(fetchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });

          const status = fetchRes.status;
          const html = await fetchRes.text();

          const links: { url: string; title: string }[] = [];

          // RSS XML parsing if RSS feed
          if (html.includes('<rss') || html.includes('<item>')) {
            const itemMatches = [...html.matchAll(/<item>(.*?)<\/item>/gis)];
            for (const item of itemMatches) {
              const itemXml = item[1];
              const titleMatch = itemXml.match(/<title>(.*?)<\/title>/is);
              const linkMatch = itemXml.match(/<link>(.*?)<\/link>/is);

              if (titleMatch && linkMatch) {
                const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').replace(/<[^>]+>/g, '').trim();
                const url = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();
                const cleanTitleLower = title.toLowerCase().trim();

                const isUnrelated = UNRELATED_JUNK_KEYWORDS.some(k => cleanTitleLower.includes(k) || url.toLowerCase().includes(k));

                if (title.length > 8 && url.startsWith('http') && !JUNK_TITLE_EXACT.has(cleanTitleLower) && !GENERIC_LANDING_URL_REGEX.test(url) && !isUnrelated) {
                  links.push({ url, title });
                }
              }
            }
          }

          // Standard HTML anchor tag parsing with ATS Regex & Deep URL Enforcement
          const matches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis)];

          // Known ATS Job Detail Regex Patterns (SAP SuccessFactors, Workday, Greenhouse, Lever, SmartRecruiters)
          const ATS_JOB_REGEX = /\/job\/|\/jobs\/|\/vacancies\/|\/convocatoria\/|\/detail\/|\/oferta-/i;

          for (const match of matches) {
            let href = match[1];
            let text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

            if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;

            if (!href.startsWith('http')) {
              try {
                href = new URL(href, targetUrl).href;
              } catch {
                continue;
              }
            }

            const lowerHref = href.toLowerCase();
            const lowerText = text.toLowerCase().trim();

            // 1. Discard generic landing page URLs (e.g. domain.com/empleo, domain.com/careers, flexjobs.com/.../why_remote)
            if (GENERIC_LANDING_URL_REGEX.test(href)) continue;

            // 2. Discard unrelated roles & cities (Sales SaaS, Austin TX, 401k)
            const isUnrelated = UNRELATED_JUNK_KEYWORDS.some(k => lowerText.includes(k) || lowerHref.includes(k));
            if (isUnrelated) continue;

            // 3. Skip exact junk navigation titles (Inicio, Registro, Contacto, etc.)
            if (JUNK_TITLE_EXACT.has(lowerText)) continue;

            // 4. Skip URLs pointing to login, register, contact, legal, cookies
            if (
              lowerHref.includes('/login') ||
              lowerHref.includes('/register') ||
              lowerHref.includes('/registro') ||
              lowerHref.includes('/contacto') ||
              lowerHref.includes('/legal') ||
              lowerHref.includes('/privacy') ||
              lowerHref.includes('/cookies')
            ) {
              continue;
            }

            // 5. ATS Regex Matcher & Deep Position Enforcement
            const isAtsPattern = ATS_JOB_REGEX.test(lowerHref);
            const hasRoleKeyword = PROFESSIONAL_ROLE_KEYWORDS.some(role => lowerText.includes(role));
            const isDomainSpecific = lowerText.includes('clima') || lowerText.includes('ambiente') || lowerText.includes('suelo') || lowerText.includes('gis') || lowerText.includes('gobernanza') || lowerText.includes('resiliencia') || lowerText.includes('salvaguardias');
            const wordCount = text.split(/\s+/).length;

            if (text.length >= 8 && (isAtsPattern || hasRoleKeyword || (wordCount >= 3 && isDomainSpecific))) {
              links.push({ url: href, title: text });
            }
          }

          // Deduplicate links
          const uniqueLinks = links.filter((l, i, self) => 
            i === self.findIndex(t => t.url === l.url || t.title === l.title)
          );

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status, targetUrl, links: uniqueLinks, totalFound: uniqueLinks.length }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), liveScraperPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    host: false
  }
});
