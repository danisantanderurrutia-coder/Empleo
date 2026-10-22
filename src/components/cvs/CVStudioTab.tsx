import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  FileDown,
  Printer,
  Save,
  Target,
  Trash2,
  Wrench
} from 'lucide-react';
import { getStoredOffers, getStoredProfile, saveStoredProfile } from '../../services/db';
import {
  applyLinkFixes,
  auditProfile,
  buildCv,
  getSavedVersions,
  renderCvHtml,
  saveVersions,
  type CvLang,
  type CvLength,
  type SavedStudioVersion
} from '../../services/cvStudio';
import { CANONICAL_CONTACT, type CvSection } from '../../data/verifiedCvFacts';

const A4_W = 794; // px a 96 dpi
const A4_H = 1123;
const GAP = 12;

const SECTION_LABEL: Record<CvSection, string> = {
  education: 'Formación',
  experience: 'Experiencia y proyectos',
  publications: 'Publicaciones',
  courses: 'Cursos',
  skills: 'Competencias',
  languages: 'Idiomas'
};

const panel = 'rounded-2xl border p-4 space-y-3';
const panelStyle: React.CSSProperties = { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' };

const segBtn = (active: boolean) =>
  `px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
    active ? 'bg-sky-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
  }`;

interface CVStudioTabProps {
  initialOfferId?: string;
}

export const CVStudioTab: React.FC<CVStudioTabProps> = ({ initialOfferId = '' }) => {
  const [profile, setProfile] = useState(getStoredProfile());
  const offers = useMemo(() => getStoredOffers(), []);

  const [lang, setLang] = useState<CvLang>('es');
  const [length, setLength] = useState<CvLength>('1p');
  const [offerId, setOfferId] = useState<string>(initialOfferId);
  const [forceInclude, setForceInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [location, setLocation] = useState<string>(CANONICAL_CONTACT.defaultLocation);
  const [includePhone, setIncludePhone] = useState(false);
  const [versions, setVersions] = useState<SavedStudioVersion[]>(getSavedVersions());
  const [versionName, setVersionName] = useState('');
  const [fitInfo, setFitInfo] = useState<{ zoom?: string; overflow: boolean }>({ overflow: false });

  useEffect(() => {
    if (initialOfferId) {
      setOfferId(initialOfferId);
    }
  }, [initialOfferId]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  const offer = offers.find((o) => o.id === offerId) || null;

  const built = useMemo(
    () => buildCv({ lang, length, offer, forceInclude, exclude, location, includePhone, phone: profile.phone }),
    [lang, length, offer, forceInclude, exclude, location, includePhone, profile.phone]
  );
  const html = useMemo(() => renderCvHtml(built), [built]);
  const pages = length === '1p' ? 1 : 2;
  const audit = useMemo(() => auditProfile(profile), [profile]);
  const fixable = audit.filter((a) => a.fix);

  // Escala la vista previa A4 al ancho disponible
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, (el.clientWidth - 8) / A4_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onFrameLoad = () => {
    const body = iframeRef.current?.contentDocument?.body;
    if (!body) return;
    setFitInfo({ zoom: body.getAttribute('data-fit-zoom') || undefined, overflow: body.getAttribute('data-overflow') === '1' });
  };

  const print = () => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.focus();
    w.print();
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileBase}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFact = (id: string, currentlyIncluded: boolean) => {
    if (currentlyIncluded) {
      setForceInclude((f) => f.filter((x) => x !== id));
      setExclude((e) => (e.includes(id) ? e : [...e, id]));
    } else {
      setExclude((e) => e.filter((x) => x !== id));
      setForceInclude((f) => (f.includes(id) ? f : [...f, id]));
    }
  };

  const resetSelection = () => {
    setForceInclude([]);
    setExclude([]);
  };

  const saveVersion = () => {
    const label = offer ? `${offer.title} — ${offer.company}` : 'General';
    const v: SavedStudioVersion = {
      id: `ver-${Date.now()}`,
      name: versionName.trim() || `CV ${lang.toUpperCase()} ${length} · ${label}`,
      createdAt: new Date().toISOString().slice(0, 10),
      lang,
      length,
      offerId: offer?.id,
      offerLabel: offer ? label : undefined,
      forceInclude,
      exclude,
      location
    };
    const next = [v, ...versions];
    setVersions(next);
    saveVersions(next);
    setVersionName('');
  };

  const loadVersion = (v: SavedStudioVersion) => {
    setLang(v.lang);
    setLength(v.length);
    setOfferId(v.offerId || '');
    setForceInclude(v.forceInclude);
    setExclude(v.exclude);
    setLocation(v.location);
  };

  const removeVersion = (id: string) => {
    const next = versions.filter((v) => v.id !== id);
    setVersions(next);
    saveVersions(next);
  };

  const applyFixes = () => {
    const fixed = applyLinkFixes(profile, audit);
    saveStoredProfile(fixed);
    setProfile(fixed);
  };

  const fileBase = `Daniel_Santander_CV_${lang.toUpperCase()}_${length}`;

  return (
    <div className="space-y-4 text-[var(--text-primary)]">
      <div className={panel} style={panelStyle}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-sky-500" /> CV Studio
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)]">
              CVs A4 generados solo con datos verificados del Portafolio. Elige idioma, largo y, si quieres, una oferta para adaptarlo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
              <button className={segBtn(lang === 'es')} onClick={() => setLang('es')}>ES</button>
              <button className={segBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
            </div>
            <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
              <button className={segBtn(length === '1p')} onClick={() => setLength('1p')}>1 pág.</button>
              <button className={segBtn(length === '2p')} onClick={() => setLength('2p')}>2 pág.</button>
            </div>
            <button
              onClick={downloadHtml}
              className="px-3 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--card-bg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] transition"
              title={`Descargar archivo HTML autónomo (${fileBase}.html)`}
            >
              <FileDown className="h-4 w-4 text-emerald-500" />
              <span>Descargar HTML</span>
            </button>
            <button
              onClick={print}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              title={`Imprimir → Guardar como PDF (${fileBase}.pdf)`}
            >
              <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_1fr] gap-4 items-start">
        {/* ------------------------------------------------ Controles */}
        <div className="space-y-4">
          <div className={panel} style={panelStyle}>
            <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
              <Target className="h-4 w-4 text-sky-500" /> Adaptar a una oferta
            </h3>
            <select
              value={offerId}
              onChange={(e) => {
                setOfferId(e.target.value);
                resetSelection();
              }}
              className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent"
              style={{ borderColor: 'var(--panel-border)' }}
            >
              <option value="">General (sin oferta)</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} — {o.company}
                </option>
              ))}
            </select>
            {offer ? (
              <div className="text-[11px] space-y-1">
                <div className="text-[var(--text-secondary)]">
                  Coincidencias con la oferta (solo etiquetas reales de tus datos):
                </div>
                <div className="flex flex-wrap gap-1">
                  {built.matchedTags.length ? (
                    built.matchedTags.slice(0, 18).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-mono">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-amber-500">Sin coincidencias: la oferta no menciona temas de tu perfil verificado.</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--text-secondary)]">Sin oferta: se usa el orden general de prioridad y el pie “CV de referencia general”.</p>
            )}
          </div>

          <div className={panel} style={panelStyle}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-sky-500" /> Contenido incluido
              </h3>
              {(forceInclude.length > 0 || exclude.length > 0) && (
                <button onClick={resetSelection} className="text-[11px] text-sky-500 hover:underline cursor-pointer">
                  Restablecer selección
                </button>
              )}
            </div>
            <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3">
              {(['education', 'experience', 'publications', 'courses', 'skills', 'languages'] as CvSection[]).map((sec) => {
                const items = built.allFacts.filter((f) => f.fact.section === sec);
                return (
                  <div key={sec}>
                    <div className="text-[10px] font-mono font-black uppercase text-[var(--text-muted)] mb-1">{SECTION_LABEL[sec]}</div>
                    <div className="space-y-1">
                      {items
                        .slice()
                        .sort((a, b) => b.score - a.score)
                        .map((s) => (
                          <label key={s.fact.id} className="flex items-start gap-2 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              checked={s.included}
                              disabled={!!s.fact.core}
                              onChange={() => toggleFact(s.fact.id, s.included)}
                            />
                            <span className="min-w-0 flex-1">
                              <span className={s.included ? '' : 'text-[var(--text-muted)]'}>
                                {s.fact[lang].title}
                                {s.fact[lang].org ? ` · ${s.fact[lang].org}` : ''}
                              </span>
                              {offer && s.matchedTags.length > 0 && (
                                <span className="ml-1 text-emerald-500 font-mono">+{s.matchedTags.length}</span>
                              )}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 border-t" style={{ borderColor: 'var(--panel-border)' }}>
              <label className="text-[11px] flex items-center gap-2">
                <span className="w-20 text-[var(--text-secondary)]">Ubicación</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg border bg-transparent text-xs"
                  style={{ borderColor: 'var(--panel-border)' }}
                />
              </label>
              <label className="text-[11px] flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includePhone} onChange={(e) => setIncludePhone(e.target.checked)} />
                Incluir teléfono del Perfil Maestro ({profile.phone || 'sin teléfono'})
              </label>
            </div>
          </div>

          <div className={panel} style={panelStyle}>
            <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
              <Save className="h-4 w-4 text-sky-500" /> Versiones guardadas
            </h3>
            <div className="flex gap-2">
              <input
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Nombre (opcional)"
                className="flex-1 px-2 py-1.5 rounded-lg border bg-transparent text-xs"
                style={{ borderColor: 'var(--panel-border)' }}
              />
              <button onClick={saveVersion} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">
                Guardar
              </button>
            </div>
            {versions.length === 0 ? (
              <p className="text-[11px] text-[var(--text-secondary)]">Aún no hay versiones. Guarda una para recordar qué CV usaste en cada candidatura.</p>
            ) : (
              <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                {versions.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)' }}>
                    <button onClick={() => loadVersion(v)} className="text-left min-w-0 flex-1 cursor-pointer hover:text-sky-500">
                      <div className="font-bold truncate">{v.name}</div>
                      <div className="text-[var(--text-muted)] font-mono">{v.createdAt} · {v.lang.toUpperCase()} · {v.length}</div>
                    </button>
                    <button onClick={() => removeVersion(v.id)} className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer" title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={panel} style={panelStyle}>
            <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
              <Wrench className="h-4 w-4 text-sky-500" /> Auditoría del Perfil Maestro
            </h3>
            {audit.length === 0 ? (
              <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> El Perfil Maestro coincide con los datos verificados.
              </p>
            ) : (
              <>
                <ul className="space-y-2">
                  {audit.map((a) => (
                    <li key={a.id} className="text-[11px] flex gap-2">
                      <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${a.severity === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div>
                        <div>{a.message}</div>
                        {a.current && <div className="text-[var(--text-muted)] font-mono break-all">Actual: {a.current}</div>}
                        {a.expected && <div className="text-emerald-500 font-mono break-all">Esperado: {a.expected}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
                {fixable.length > 0 && (
                  <button onClick={applyFixes} className="w-full px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer">
                    Corregir {fixable.length} enlace(s) en el Perfil Maestro
                  </button>
                )}
                <p className="text-[10px] text-[var(--text-muted)]">
                  Las advertencias de fechas, idiomas y métricas no se corrigen solas: confírmalas tú en el Perfil Maestro.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ Vista previa */}
        <div className={panel} style={panelStyle}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-black uppercase flex items-center gap-1.5">
              <FileDown className="h-4 w-4 text-sky-500" /> Vista previa A4 · {pages} {pages === 1 ? 'página' : 'páginas'}
            </span>
            {fitInfo.overflow ? (
              <span className="text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> No cabe: quita contenido
              </span>
            ) : (
              <span className="text-emerald-500 font-mono">Ajuste tipográfico ×{fitInfo.zoom || '1.00'}</span>
            )}
          </div>
          <div ref={wrapRef} className="w-full overflow-hidden rounded-xl" style={{ backgroundColor: '#cbd5e1' }}>
            <div style={{ width: A4_W * scale, height: (A4_H * pages + GAP * pages) * scale }}>
              <iframe
                ref={iframeRef}
                title="Vista previa del CV"
                srcDoc={html}
                onLoad={onFrameLoad}
                style={{
                  width: A4_W,
                  height: A4_H * pages + GAP * pages,
                  border: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  background: '#cbd5e1'
                }}
              />
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            En el diálogo de impresión elige “Guardar como PDF”, tamaño A4, márgenes “Ninguno” y desactiva encabezados y pies. Archivo sugerido: {fileBase}.pdf
          </p>
        </div>
      </div>
    </div>
  );
};
