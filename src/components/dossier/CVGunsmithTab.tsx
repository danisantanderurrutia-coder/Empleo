import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Printer,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Briefcase
} from 'lucide-react';
import { PORTFOLIO_EVIDENCE_CATALOG } from '../../data/portfolioBridge';
import { getStoredProfile } from '../../services/db';

export const CVGunsmithTab: React.FC = () => {
  const profile = getStoredProfile();

  // Selected language
  const [lang, setLang] = useState<'es' | 'en' | 'de'>('es');

  // Selected Specialization Profile
  const [activeProfile, setActiveProfile] = useState<'science' | 'geophysics' | 'policy'>('science');

  // Equipped Evidence Modules (Default 4 selected items)
  const [equippedIds, setEquippedIds] = useState<string[]>([
    'ev-001-peatlands',
    'ev-002-smartparks',
    'ev-003-congreso',
    'ev-004-epn-report'
  ]);

  const [copied, setCopied] = useState(false);

  // Toggle Module Selection
  const toggleEquip = (id: string) => {
    if (equippedIds.includes(id)) {
      if (equippedIds.length <= 2) return; // Keep minimum 2 bullets
      setEquippedIds(equippedIds.filter(i => i !== id));
    } else {
      if (equippedIds.length >= 4) return; // Max 4 modules for strict 1-page density
      setEquippedIds([...equippedIds, id]);
    }
  };

  // Get selected items
  const equippedItems = PORTFOLIO_EVIDENCE_CATALOG.filter(item => equippedIds.includes(item.id));

  // Specialization Profiles Configuration
  const profileConfigs = {
    science: {
      id: 'science',
      code: 'ESP-01 // BIOGEO',
      name: 'Suelos, Biogeoquímica & Dinámica de Carbono',
      institution: 'CAU Kiel (Alemania) / AMU Poznań (Polonia)',
      headlineEs: 'Científico Ambiental especializado en Dinámica de Carbono, Suelos y Modelación Cuantitativa',
      headlineEn: 'Environmental Scientist specializing in Soil Carbon Dynamics, Catchments & Quantitative Modeling',
      headlineDe: 'Umweltwissenschaftler mit Schwerpunkt auf Boden-Kohlenstoffdynamik und quantitativer Modellierung',
      targetSector: 'Institutos I+D DACH (§20 AufenthG), Centros Climáticos & Laboratorios Ambientales',
      atsMatch: 96,
      densityRate: 100
    },
    geophysics: {
      id: 'geophysics',
      code: 'ESP-02 // GEOFIS-GIS',
      name: 'Geofísica, Sensores Remotos & GIS',
      institution: 'Universidad de Chile (FCFM)',
      headlineEs: 'Geofísico especializado en Sensores Remotos, GIS, Geotecnia y Balance Hidrológico',
      headlineEn: 'Geophysicist specializing in Satellite Earth Observation, GIS and Hydrological Balances',
      headlineDe: 'Geophysiker mit Spezialisierung auf Fernerkundung, GIS und hydrologische Bilanzen',
      targetSector: 'Centros Tecnológicos Euskadi (Tecnalia/BC3), Consultoría Satelital & Remoto UE',
      atsMatch: 98,
      densityRate: 100
    },
    policy: {
      id: 'policy',
      code: 'ESP-03 // POLITICAS',
      name: 'Políticas UE, Salvaguardas & Asesoría Legislativa',
      institution: 'Cámara de Diputados / Red EPN Internacional',
      headlineEs: 'Especialista en Salvaguardas Ambientales, Directivas UE e Incidencia Legislativa',
      headlineEn: 'Environmental Policy Specialist in EU Green Directives and Legislative Stakeholder Engagement',
      headlineDe: 'Experte für europäische Umweltpolitik, EU-Richtlinien und Stakeholder-Koordination',
      targetSector: 'Organismos Internacionales, Think Tanks, Políticas Climáticas & Consultoría Estratégica',
      atsMatch: 94,
      densityRate: 100
    }
  };

  const currentProfile = profileConfigs[activeProfile];

  // Copy full structured CV text
  const handleCopyCV = () => {
    const textLines = [
      `${profile.fullName || 'DANIEL SANTANDER'}`,
      `${currentProfile[lang === 'es' ? 'headlineEs' : lang === 'en' ? 'headlineEn' : 'headlineDe']}`,
      `E-mail: ${profile.email || 'danisantander.urrutia@gmail.com'} | Tel: ${profile.phone || '+49 176 ...'} | Ubicación: ${profile.location || 'Bilbao / Kiel'}`,
      `Portafolio de Evidencias Verificado: https://danisantanderurrutia-coder.github.io/Portafolio/`,
      '\n--- RESUMEN PROFESIONAL ---',
      lang === 'es' 
        ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Aprobado con Distinción). Especialista en balance de carbono, series de tiempo geoespaciales y comparecencia técnica legislativa.'
        : lang === 'en'
        ? 'Double M.Sc. in Environmental Management (CAU Kiel, Germany / AMU Poznań, Poland) and B.Sc. in Geophysics from Universidad de Chile with Distinction. Proven track record in carbon accounting, satellite geospatial analytics, and parliamentary environmental advisory.'
        : 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel / AMU Poznań) und B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung. Fundierte Erfahrung in Kohlenstoffbilanzierung, georäumlichen Zeitreihen und parlamentarischer Fachberatung.',
      '\n--- HITOS DE IMPACTO & EVIDENCIA COMPROBADA ---',
      ...equippedItems.map(item => `• ${item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']} [Respaldo: ${item.title}]`),
      '\n--- FORMACIÓN ACADÉMICA ---',
      '• Doble M.Sc. Environmental Management & Protection (CAU Kiel, Alemania / AMU Poznań, Polonia) [2022-2024]',
      '• Licenciatura en Geofísica (Facultad de Ciencias Físicas y Matemáticas, Universidad de Chile) [Distinción]'
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-100 font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER: ESTUDIO DE INGENIERÍA CURRICULAR (LINEAR / STRIPE STYLE)
       * ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-sky-400" />
                <span>ESTUDIO DE INGENIERÍA CURRICULAR</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                FORMATO: <strong className="text-white">1 PÁGINA EJECUTIVA A4</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Calibración Modular de CV & Evidencia Verificada
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Configura tu expediente profesional seleccionando el perfil de especialización según la institución de destino y acoplando los módulos de impacto con respaldo directo en tu Portafolio.
            </p>
          </div>

          {/* KPI Dashboard Strip (Linear Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="min-w-[85px]">
              <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">ALINEACIÓN ATS</div>
              <div className="text-base font-black text-emerald-400 font-mono">{currentProfile.atsMatch}%</div>
              <div className="text-[9px] text-slate-500 font-mono">Alta afinidad</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">DENSIDAD</div>
              <div className="text-base font-black text-amber-400 font-mono">1 CARILLA</div>
              <div className="text-[9px] text-slate-500 font-mono">Sin relleno</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">MÓDULOS STAR</div>
              <div className="text-base font-black text-sky-400 font-mono">{equippedIds.length} / 4</div>
              <div className="text-[9px] text-slate-500 font-mono">Capacidad máx.</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">PORTAFOLIO</div>
              <div className="text-base font-black text-purple-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                <span>ONLINE</span>
              </div>
              <div className="text-[9px] text-slate-500 font-mono">Láminas auditadas</div>
            </div>
          </div>
        </div>

        {/* Specialization Profile Tabs & Language Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-slate-800">
          
          {/* Profile Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">
              PERFIL:
            </span>
            {(['science', 'geophysics', 'policy'] as const).map(pKey => {
              const cfg = profileConfigs[pKey];
              const isSelected = activeProfile === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setActiveProfile(pKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{pKey === 'science' ? '🌱' : pKey === 'geophysics' ? '🛰️' : '🏛️'}</span>
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['es', 'en', 'de'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer ${
                  lang === l
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l === 'es' ? '🇪🇸 Español' : l === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. MAIN WORKSPACE: MODULAR EVIDENCE CATALOG & LIVE EXECUTIVE PREVIEW
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: MODULAR EVIDENCE CATALOG (7 COLS) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="p-4 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-sky-400" />
                <span>MÓDULOS DE IMPACTO STAR (SELECCIONA HASTA 4)</span>
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {equippedIds.length} / 4 MÓDULOS ACTIVOS
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cada módulo resume un hito cuantitativo validado con hipervínculo directo al proyecto correspondiente en la app <strong>Portafolio</strong>.
            </p>

            {/* Evidence List Cards */}
            <div className="space-y-2.5">
              {PORTFOLIO_EVIDENCE_CATALOG.map(item => {
                const isEquipped = equippedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition relative overflow-hidden ${
                      isEquipped
                        ? 'bg-slate-900/90 border-sky-500/60 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                            isEquipped 
                              ? 'bg-sky-950 text-sky-300 border-sky-800' 
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            LÁMINA {item.sectionId}
                          </span>
                          <span className="text-xs font-bold text-white font-sans">
                            {item.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          "{item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-1 text-[9px] font-mono">
                          {item.keyKeywords.map(k => (
                            <span key={k} className="px-1.5 py-0.2 rounded bg-slate-800/80 text-emerald-400 border border-slate-700/60">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <button
                          onClick={() => toggleEquip(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                            isEquipped
                              ? 'bg-sky-600 hover:bg-sky-500 text-white font-bold shadow'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Activo en CV</span>
                            </>
                          ) : (
                            <span>+ Incluir</span>
                          )}
                        </button>

                        <a
                          href={`https://danisantanderurrutia-coder.github.io/Portafolio/${item.portfolioUrlAnchor}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
                          title="Abrir evidencia en la app Portafolio"
                        >
                          <span>Ver Evidencia</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE EXECUTIVE DOCUMENT PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 sticky top-4 space-y-3.5">
          <div className="p-4 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>VISTA PREVIA // FICHA EJECUTIVA (A4)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>ESTÁNDAR EUROPEO</span>
              </span>
            </div>

            {/* Document Sheet Simulation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-[10px] space-y-3 shadow-inner min-h-[460px]">
              
              {/* Document Header */}
              <div className="border-b border-slate-800 pb-2.5 text-center space-y-0.5">
                <h3 className="text-sm font-black text-white uppercase font-sans tracking-tight">
                  {profile.fullName || 'DANIEL SANTANDER URRUTIA'}
                </h3>
                <div className="text-[10.5px] font-bold text-sky-400">
                  {currentProfile[lang === 'es' ? 'headlineEs' : lang === 'en' ? 'headlineEn' : 'headlineDe']}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {profile.email || 'danisantander.urrutia@gmail.com'} • {profile.phone || '+49 176...'} • Bilbao / Kiel
                </div>
                <div className="text-[9px] text-emerald-400 font-mono pt-0.5 flex items-center justify-center gap-1">
                  <Globe2 className="h-3 w-3 text-emerald-400" />
                  <span>Portafolio Verificado: danisantanderurrutia-coder.github.io/Portafolio</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  RESUMEN PROFESIONAL ({currentProfile.name})
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                  {lang === 'es'
                    ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Distinción Máxima). Especialista en modelación cuantitativa de carbono, balances hidrológicos y gobernanza socio-ecológica.'
                    : lang === 'en'
                    ? 'Double M.Sc. in Environmental Management & Protection (CAU Kiel, Germany / AMU Poznań, Poland) and B.Sc. in Geophysics from Universidad de Chile with Highest Honors. Proven expertise in carbon flux modeling, watershed hydrology, and EU policy.'
                    : 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań); B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung. Experte für Kohlenstoffbilanzierung und Umweltpolitik.'
                  }
                </p>
              </div>

              {/* Equipped Key Impact Bullets */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  HITOS DE IMPACTO & EVIDENCIA COMPROBADA ({equippedItems.length} MÓDULOS)
                </div>
                <div className="space-y-1.5 font-sans">
                  {equippedItems.map(item => (
                    <div key={item.id} className="text-[9.5px] text-slate-200 leading-snug flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold shrink-0">•</span>
                      <span>
                        {item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']}
                        <span className="text-[8.5px] font-mono text-slate-400 ml-1">
                          [Ref: {item.institution}]
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Background */}
              <div className="border-t border-slate-800/80 pt-2">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  FORMACIÓN ACADÉMICA
                </div>
                <div className="text-[9.5px] text-slate-300 space-y-0.5">
                  <div>• <strong>CAU Kiel & AMU Poznań</strong>: Doble M.Sc. Gestión & Protección Ambiental (2024)</div>
                  <div>• <strong>Universidad de Chile (FCFM)</strong>: Licenciado en Geofísica (Distinción Máxima)</div>
                </div>
              </div>

              {/* Compliance Seal */}
              <div className="pt-2 text-center text-[9px] font-mono text-emerald-400 flex items-center justify-center gap-1 border-t border-slate-800/80">
                <Check className="h-3 w-3" />
                <span>1 PÁGINA ESTRICTA // MÁXIMA DENSIDAD EJECUTIVA</span>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyCV}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Texto del CV'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs font-mono transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                title="Imprimir o Exportar PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
