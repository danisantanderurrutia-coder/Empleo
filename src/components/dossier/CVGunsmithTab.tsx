import React, { useState } from 'react';
import { 
  Crosshair, 
  ExternalLink, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  Layers, 
  Printer
} from 'lucide-react';
import { PORTFOLIO_EVIDENCE_CATALOG } from '../../data/portfolioBridge';
import { getStoredProfile } from '../../services/db';

export const CVGunsmithTab: React.FC = () => {
  const profile = getStoredProfile();

  // Selected language
  const [lang, setLang] = useState<'es' | 'en' | 'de'>('es');

  // Selected Chassis (Core Angle)
  const [activeChassis, setActiveChassis] = useState<'science' | 'geophysics' | 'policy'>('science');

  // Equipped Attachments (Portfolio Evidence IDs - Default first 4 equipped)
  const [equippedIds, setEquippedIds] = useState<string[]>([
    'ev-001-peatlands',
    'ev-002-smartparks',
    'ev-003-congreso',
    'ev-004-epn-report'
  ]);

  const [copied, setCopied] = useState(false);

  // Toggle Attachment Equip
  const toggleEquip = (id: string) => {
    if (equippedIds.includes(id)) {
      if (equippedIds.length <= 2) return; // Maintain minimum 2 bullets
      setEquippedIds(equippedIds.filter(i => i !== id));
    } else {
      if (equippedIds.length >= 5) return; // Maximum 5 for strictly 1-page limit!
      setEquippedIds([...equippedIds, id]);
    }
  };

  // Get equipped items
  const equippedItems = PORTFOLIO_EVIDENCE_CATALOG.filter(item => equippedIds.includes(item.id));

  // Compute calibration score (Optimal is 4 bullets: 100% density for 1-page standard)
  const pageCapacity = equippedIds.length;
  const calibrationScore = Math.min(100, Math.round((equippedIds.length / 4) * 98));

  // Chassis descriptions
  const chassisConfigs = {
    science: {
      name: 'CHASSIS 1: SUELOS & BIOGEOQUÍMICA (M.Sc. KIEL)',
      headlineEs: 'Científico Ambiental especializado en Dinámica de Carbono, Suelos y Modelación Cuantitativa',
      headlineEn: 'Environmental Scientist specializing in Soil Carbon Dynamics, Catchments & Quantitative Modeling',
      headlineDe: 'Umweltwissenschaftler mit Schwerpunkt auf Boden-Kohlenstoffdynamik und quantitativer Modellierung',
      theater: 'DACH §20 & Centros I+D Alemania/Polonia'
    },
    geophysics: {
      name: 'CHASSIS 2: GEOFÍSICA & TELEDETECCIÓN (U. DE CHILE)',
      headlineEs: 'Geofísico especializado en Sensores Remotos, GIS, Geotecnia y Balance Hidrológico',
      headlineEn: 'Geophysicist specializing in Satellite Earth Observation, GIS and Hydrological Balances',
      headlineDe: 'Geophysiker mit Spezialisierung auf Fernerkundung, GIS und hydrologische Bilanzen',
      theater: 'Centros Tecnológicos Euskadi (Tecnalia/BC3) & Remoto UE'
    },
    policy: {
      name: 'CHASSIS 3: GOBERNANZA & POLÍTICAS AMBIENTALES UE',
      headlineEs: 'Especialista en Salvaguardas Ambientales, Directivas UE e Incidencia Legislativa',
      headlineEn: 'Environmental Policy Specialist in EU Green Directives and Legislative Stakeholder Engagement',
      headlineDe: 'Experte für europäische Umweltpolitik, EU-Richtlinien und Stakeholder-Koordination',
      theater: 'Organismos Internacionales, Think Tanks & Consultoría Estratégica'
    }
  };

  const currentChassis = chassisConfigs[activeChassis];

  // Copy full structured CV text
  const handleCopyCV = () => {
    const textLines = [
      `${profile.fullName || 'DANIEL SANTANDER'}`,
      `${currentChassis[lang === 'es' ? 'headlineEs' : lang === 'en' ? 'headlineEn' : 'headlineDe']}`,
      `E-mail: ${profile.email || 'danisantander.urrutia@gmail.com'} | Tel: ${profile.phone || '+49 176 ...'} | Location: ${profile.location || 'Bilbao / Kiel'}`,
      `Portafolio Verificado: https://danisantanderurrutia-coder.github.io/Portafolio/`,
      '\n--- RESUMEN PROFESIONAL ---',
      lang === 'es' 
        ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Aprobado con Distinción). Experiencia comprobada en balance de carbono, series de tiempo geoespaciales y comparecencia técnica legislativa.'
        : lang === 'en'
        ? 'Double M.Sc. in Environmental Management (CAU Kiel, Germany / AMU Poznań, Poland) and B.Sc. in Geophysics from Universidad de Chile with Distinction. Proven track record in carbon accounting, satellite geospatial analytics, and parliamentary environmental advisory.'
        : 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel / AMU Poznań) und B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung. Fundierte Erfahrung in Kohlenstoffbilanzierung, georäumlichen Zeitreihen und parlamentarischer Fachberatung.',
      '\n--- LOGROS & EVIDENCIA COMPROBADA (SLOTS EQUIPADOS) ---',
      ...equippedItems.map(item => `• ${item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']} [Evidencia: ${item.title}]`),
      '\n--- FORMACIÓN ACADÉMICA ---',
      '• Doble M.Sc. Environmental Management & Protection (CAU Kiel, Alemania / AMU Poznań, Polonia) [2022-2024]',
      '• Licenciatura en Geofísica (Facultad de Ciencias Físicas y Matemáticas, Universidad de Chile) [Distinción]'
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-mono animate-fadeIn">
      {/* Top Banner: The Gunsmith Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1627] via-[#09111f] to-[#0d1627] border border-slate-700/80 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-1">
            <Crosshair className="h-4 w-4 animate-spin text-amber-500" />
            <span>THE GUNSMITH // ARMERO DE CVs TÁCTICO MODULAR</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
              ALIANZA PORTAFOLIO ACTIVA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
            FORJA DE LOADOUTS // OBRA DE ARTE DE 1 PÁGINA
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Calibra chasis, ensambla proyectiles de impacto basados en evidencia real de tu Portafolio y optimiza la densidad ATS.
          </p>
        </div>

        {/* Tactical Language & Calibration Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {(['es', 'en', 'de'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg font-bold uppercase transition ${
                  lang === l
                    ? 'bg-amber-600 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l === 'es' ? '🇪🇸 ES' : l === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
              </button>
            ))}
          </div>

          {/* ATS Density Meter */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">CALIBRACIÓN ATS:</span>
            <span className={`text-xs font-black ${calibrationScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {calibrationScore}%
            </span>
            <span className="text-[10px] text-slate-500">
              ({pageCapacity}/4 SLOTS)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Slot Customizer (Left 7 Cols) + 1-Page Tactical Canvas (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
         * LEFT COLUMN: CHASSIS SELECTOR & MODULAR ATTACHMENTS (7 COLS)
         * ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Chassis Selection */}
          <div className="p-4 rounded-xl bg-[#0e1626]/90 border border-slate-700/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                <span>SLOT 1: SELECCIONA EL CHASIS (ENFOQUE DE CARRERA)</span>
              </span>
              <span className="text-[10px] text-slate-400">1 ACTIVO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['science', 'geophysics', 'policy'] as const).map(cKey => {
                const c = chassisConfigs[cKey];
                const active = activeChassis === cKey;
                return (
                  <button
                    key={cKey}
                    onClick={() => setActiveChassis(cKey)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      active
                        ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className={`text-[11px] font-bold uppercase tracking-tight mb-1 ${active ? 'text-amber-300' : 'text-slate-200'}`}>
                        {cKey === 'science' ? 'Suelos & Clima' : cKey === 'geophysics' ? 'Geofísica & GIS' : 'Gobernanza UE'}
                      </div>
                      <div className="text-[9px] text-slate-400 leading-tight font-sans">
                        {c.theater}
                      </div>
                    </div>
                    <div className="mt-2 text-[9px] font-bold text-emerald-400">
                      {active ? '✓ CHASIS MONTADO' : 'MONTAR'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Modular Attachments (Evidence from Portafolio) */}
          <div className="p-4 rounded-xl bg-[#0e1626]/90 border border-slate-700/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>SLOT 2: ATTACHMENTS DE IMPACTO (EVIDENCIA PORTAFOLIO)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Equipa entre 3 y 4 slots para asegurar la regla de oro: <strong>1 Página Perfecta</strong>.
                </span>
              </div>
              <div className="text-xs font-black text-amber-400">
                {equippedIds.length} / 5 MÁX
              </div>
            </div>

            <div className="space-y-2.5">
              {PORTFOLIO_EVIDENCE_CATALOG.map(item => {
                const isEquipped = equippedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition ${
                      isEquipped
                        ? 'bg-slate-900/95 border-emerald-500/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            SEC. {item.sectionId}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {item.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
                          "{item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                          {item.keyKeywords.map(k => (
                            <span key={k} className="px-1.5 py-0.2 rounded bg-slate-800/80 text-emerald-400 font-mono">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Equip / Unequip Toggle */}
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => toggleEquip(item.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-600 text-slate-950 shadow hover:bg-emerald-500'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {isEquipped ? '✓ EQUIPADO' : '+ EQUIPAR'}
                        </button>

                        <a
                          href={`https://danisantanderurrutia-coder.github.io/Portafolio/${item.portfolioUrlAnchor}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] text-sky-400 hover:text-white flex items-center gap-0.5 transition"
                          title="Abrir evidencia en la app Portafolio"
                        >
                          <span>Portafolio</span>
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

        {/* =========================================================
         * RIGHT COLUMN: 1-PAGE TACTICAL CANVAS (LIVE PREVIEW) (5 COLS)
         * ========================================================= */}
        <div className="lg:col-span-5 sticky top-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>CANVAS // VISTA PREVIA DE 1 PÁGINA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ESTÁNDAR ATS PERFECCIONADO
              </span>
            </div>

            {/* Simulated 1-Page Document Paper */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-[10px] space-y-3 font-sans shadow-inner min-h-[440px]">
              {/* Header */}
              <div className="border-b border-slate-700 pb-2 text-center">
                <h3 className="text-sm font-black text-white uppercase font-mono tracking-tight">
                  {profile.fullName || 'DANIEL SANTANDER URRUTIA'}
                </h3>
                <div className="text-[10px] font-bold text-amber-400 font-mono mt-0.5">
                  {currentChassis[lang === 'es' ? 'headlineEs' : lang === 'en' ? 'headlineEn' : 'headlineDe']}
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1">
                  E-mail: danisantander.urrutia@gmail.com • Tel: +49 176... • Euskadi / Alemania
                </div>
                <div className="text-[9px] text-sky-400 font-mono mt-0.5">
                  🔗 Portafolio Multimedia Verificado: danisantanderurrutia-coder.github.io/Portafolio
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                  PERFIL OPERATIVO & CIENTÍFICO
                </div>
                <p className="text-[9.5px] text-slate-300 leading-snug">
                  {lang === 'es'
                    ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Distinción Máxima). Especialista en modelación cuantitativa de carbono, balances hidrológicos y gobernanza socio-ecológica.'
                    : lang === 'en'
                    ? 'Double M.Sc. in Environmental Management & Protection (CAU Kiel, Germany / AMU Poznań, Poland) and B.Sc. in Geophysics from Universidad de Chile with Highest Honors. Proven expertise in carbon flux modeling, watershed hydrology, and EU policy.'
                    : 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań); B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung. Experte für Kohlenstoffbilanzierung und Umweltpolitik.'
                  }
                </p>
              </div>

              {/* Equipped Attachments / Achievements */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  LOGROS CLAVE & PROYECTOS VERIFICADOS ({equippedItems.length} ATTACHMENTS)
                </div>
                <div className="space-y-1.5">
                  {equippedItems.map(item => (
                    <div key={item.id} className="text-[9.5px] text-slate-200 leading-snug flex items-start gap-1">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>
                        {item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']}
                        <span className="text-[8px] font-mono text-sky-300 ml-1">
                          [Ref: {item.institution}]
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Box */}
              <div className="border-t border-slate-800 pt-1.5">
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                  FORMACIÓN ACADÉMICA DE ÉLITE
                </div>
                <div className="text-[9px] text-slate-300 space-y-0.5">
                  <div>🎓 <strong>CAU Kiel & AMU Poznań</strong>: Doble M.Sc. Gestión & Protección Ambiental (2024)</div>
                  <div>🔬 <strong>Universidad de Chile (FCFM)</strong>: Licenciado en Geofísica (Con Distinción)</div>
                </div>
              </div>

              {/* Capacity Status Pill */}
              <div className="pt-2 text-center text-[9px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                <span>✓ CAPACIDAD ÓPTIMA: 1 PÁGINA (100% SEÑAL • 0% RUIDO)</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyCV}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? '¡COPIADO!' : 'COPIAR TEXTO LOADOUT'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
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
