import React, { useState } from 'react';
import { 
  Crosshair, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Printer,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { PORTFOLIO_EVIDENCE_CATALOG } from '../../data/portfolioBridge';
import { getStoredProfile } from '../../services/db';

export const CVGunsmithTab: React.FC = () => {
  const profile = getStoredProfile();

  // Selected language
  const [lang, setLang] = useState<'es' | 'en' | 'de'>('es');

  // Selected Chassis (Core Angle)
  const [activeChassis, setActiveChassis] = useState<'science' | 'geophysics' | 'policy'>('science');

  // Equipped Attachments (Portfolio Evidence IDs - Default 4 equipped rounds)
  const [equippedIds, setEquippedIds] = useState<string[]>([
    'ev-001-peatlands',
    'ev-002-smartparks',
    'ev-003-congreso',
    'ev-004-epn-report'
  ]);

  const [activeSocket, setActiveSocket] = useState<'chassis' | 'ammo' | 'optics' | 'datalink'>('ammo');
  const [copied, setCopied] = useState(false);

  // Toggle Attachment Equip
  const toggleEquip = (id: string) => {
    if (equippedIds.includes(id)) {
      if (equippedIds.length <= 2) return; // Maintain minimum 2 bullets
      setEquippedIds(equippedIds.filter(i => i !== id));
    } else {
      if (equippedIds.length >= 4) return; // Strict 4 rounds maximum for 1-Page standard!
      setEquippedIds([...equippedIds, id]);
    }
  };

  // Get equipped items
  const equippedItems = PORTFOLIO_EVIDENCE_CATALOG.filter(item => equippedIds.includes(item.id));

  // Chassis descriptions
  const chassisConfigs = {
    science: {
      code: 'CHASSIS-01 // BIO-GEO',
      name: 'SUELOS & BIOGEOQUÍMICA (CAU KIEL)',
      caliber: '7.62x51mm CARBONO',
      headlineEs: 'Científico Ambiental especializado en Dinámica de Carbono, Suelos y Modelación Cuantitativa',
      headlineEn: 'Environmental Scientist specializing in Soil Carbon Dynamics, Catchments & Quantitative Modeling',
      headlineDe: 'Umweltwissenschaftler mit Schwerpunkt auf Boden-Kohlenstoffdynamik und quantitativer Modellierung',
      theater: 'DACH §20 & Centros I+D Alemania/Polonia',
      stats: { range: 94, penetration: 98, density: 100, mobility: 95 }
    },
    geophysics: {
      code: 'CHASSIS-02 // GEOFIS-GIS',
      name: 'GEOFÍSICA & TELEDETECCIÓN (U. DE CHILE)',
      caliber: '5.56x45mm SATELLITE',
      headlineEs: 'Geofísico especializado en Sensores Remotos, GIS, Geotecnia y Balance Hidrológico',
      headlineEn: 'Geophysicist specializing in Satellite Earth Observation, GIS and Hydrological Balances',
      headlineDe: 'Geophysiker mit Spezialisierung auf Fernerkundung, GIS und hydrologische Bilanzen',
      theater: 'Centros Tecnológicos Euskadi (Tecnalia/BC3) & Remoto UE',
      stats: { range: 98, penetration: 92, density: 100, mobility: 92 }
    },
    policy: {
      code: 'CHASSIS-03 // GOBERNANZA',
      name: 'GOBERNANZA & POLÍTICAS UE (CONGRESO)',
      caliber: '.300 AAC LEGISLATIVO',
      headlineEs: 'Especialista en Salvaguardas Ambientales, Directivas UE e Incidencia Legislativa',
      headlineEn: 'Environmental Policy Specialist in EU Green Directives and Legislative Stakeholder Engagement',
      headlineDe: 'Experte für europäische Umweltpolitik, EU-Richtlinien und Stakeholder-Koordination',
      theater: 'Organismos Internacionales, Think Tanks & Consultoría Estratégica',
      stats: { range: 90, penetration: 96, density: 100, mobility: 98 }
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
        ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Aprobado con Distinción). Especialista en balance de carbono, series de tiempo geoespaciales y comparecencia técnica legislativa.'
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
    <div className="space-y-6 text-slate-100 font-mono animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. THE GUNSMITH HERO HUD: WEAPON BENCH IDENTIFIER & STATS
       * ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-[#070d18] via-[#091322] to-[#040811] p-6 shadow-2xl">
        {/* Subtle Blueprint Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-amber-400 animate-spin" />
                <span>GUNSMITH BENCH // MODULAR WEAPON WORKSTATION</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                SCHEMATIC: CV-1PAGE-MINT-v4
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase tracking-tight flex items-center gap-3">
              <span>{currentChassis.name}</span>
            </h1>
            <p className="text-xs text-slate-300 font-sans mt-1 max-w-2xl">
              Configura tu currículum como una pieza de ingeniería balística: Chasis calibrado por teatro, munición de impacto con evidencia real del Portafolio y cero dispersión.
            </p>
          </div>

          {/* Weapon Performance Stats HUD (R6 Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 shrink-0">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">ALCANCE ATS</div>
              <div className="text-base font-black text-emerald-400 font-mono">{currentChassis.stats.range}%</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${currentChassis.stats.range}%` }} />
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">DENSIDAD SEÑAL</div>
              <div className="text-base font-black text-amber-400 font-mono">1 PÁG</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `100%` }} />
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">CARGADOR STAR</div>
              <div className="text-base font-black text-sky-400 font-mono">{equippedIds.length} / 4 RNDS</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-sky-400" style={{ width: `${(equippedIds.length / 4) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400 uppercase font-bold">DATALINK PORT.</div>
              <div className="text-base font-black text-purple-400 font-mono">VERIFICADO</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: `100%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Language Selector Switcher */}
        <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">CALIBRE DE IDIOMA:</span>
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              {(['es', 'en', 'de'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase transition cursor-pointer ${
                    lang === l
                      ? 'bg-amber-600 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'es' ? '🇪🇸 CASTELLANO' : l === 'en' ? '🇬🇧 ENGLISH' : '🇩🇪 DEUTSCH'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>NORMA DE IMPACTO: DENSIDAD CIENTÍFICA MÁXIMA EN 1 CARILLA</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. VISUAL BLUEPRINT BENCH: TECHNICAL WEAPON SCHEMATIC WIREFRAME
       * ========================================================================= */}
      <div className="p-5 rounded-3xl bg-[#09111e]/95 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-black uppercase text-white tracking-wider">
              ESQUEMA BLUEPRINT // BANCO DE ENSAMBLAJE DE PRECISIÓN
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            INTERACTIVE SLOTS // HAZ CLIC EN CUALQUIER SOCKET PARA INSPECCIONAR
          </span>
        </div>

        {/* Interactive Schematic Visual Wireframe (SVG Diagram with Leader Lines) */}
        <div className="relative w-full overflow-x-auto py-2">
          <svg 
            viewBox="0 0 860 210" 
            className="w-full min-w-[700px] h-auto select-none"
          >
            <defs>
              <linearGradient id="chassisBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Background Grid Accent Lines */}
            <line x1="40" y1="105" x2="820" y2="105" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="280" y1="20" x2="280" y2="190" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="580" y1="20" x2="580" y2="190" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

            {/* Central 1-Page Document Blueprint Chassis Box */}
            <rect 
              x="300" 
              y="25" 
              width="260" 
              height="160" 
              rx="12" 
              fill="#060c18" 
              stroke="#38bdf8" 
              strokeWidth="1.5" 
              strokeDasharray="6 3" 
            />

            {/* Document Internal Wireframe Lines */}
            <rect x="320" y="42" width="220" height="24" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
            <text x="330" y="58" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
              [SOCKET 1: HEADER & CHASIS ACTIVO]
            </text>

            <rect x="320" y="74" width="220" height="22" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
            <text x="330" y="89" fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="monospace">
              [SOCKET 2: RESUMEN CUANTITATIVO]
            </text>

            {/* 4 Bullet Magazine Chambers */}
            <g>
              <rect x="320" y="104" width="220" height="42" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="330" y="117" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                [SOCKET 3: CARGADOR // 4 BALAS STAR]
              </text>
              {/* 4 Ammo Shells representation */}
              <g transform="translate(330, 124)">
                {Array.from({ length: 4 }).map((_, i) => {
                  const isLoaded = i < equippedIds.length;
                  return (
                    <g key={i} transform={`translate(${i * 52}, 0)`}>
                      <rect 
                        x="0" 
                        y="0" 
                        width="46" 
                        height="14" 
                        rx="3" 
                        fill={isLoaded ? '#f59e0b' : '#1e293b'} 
                        fillOpacity={isLoaded ? 0.3 : 0.4} 
                        stroke={isLoaded ? '#f59e0b' : '#334155'} 
                        strokeWidth="1" 
                      />
                      <text x="5" y="10" fill={isLoaded ? '#ffffff' : '#64748b'} fontSize="7" fontWeight="bold" fontFamily="monospace">
                        {isLoaded ? `RND 0${i + 1}` : 'EMPTY'}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>

            {/* Footer Datalink Port */}
            <rect x="320" y="154" width="220" height="20" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
            <text x="330" y="168" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace">
              [SOCKET 4: DATALINK PORTAFOLIO VERIFICADO]
            </text>

            {/* CALLOUT LEADER LINES TO SOCKET CONTROLS */}
            
            {/* Leader 1: Left to Socket 1 (Chassis) */}
            <path d="M 190 55 L 260 55 L 300 55" fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <circle cx="190" cy="55" r="4" fill="#f59e0b" className="animate-ping" />
            <circle cx="190" cy="55" r="3" fill="#f59e0b" />
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveSocket('chassis')}
            >
              <rect x="50" y="40" width="130" height="30" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="60" y="54" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">CHASIS SELECCIONADO</text>
              <text x="60" y="65" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">» {currentChassis.code}</text>
            </g>

            {/* Leader 2: Left to Socket 3 (Ammo Magazine) */}
            <path d="M 190 125 L 260 125 L 300 125" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="190" cy="125" r="3" fill="#38bdf8" />
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveSocket('ammo')}
            >
              <rect x="50" y="110" width="130" height="30" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="60" y="124" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">CAPACIDAD DE DISPARO</text>
              <text x="60" y="135" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">» {equippedIds.length}/4 BALAS STAR</text>
            </g>

            {/* Leader 3: Right to Optics (ATS Targeting) */}
            <path d="M 670 70 L 600 70 L 560 70" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="670" cy="70" r="3" fill="#10b981" />
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveSocket('optics')}
            >
              <rect x="680" y="55" width="140" height="30" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="690" y="69" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">CALIBRACIÓN ÓPTICA ATS</text>
              <text x="690" y="80" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">» 96% BLINDAJE LÉXICO</text>
            </g>

            {/* Leader 4: Right to Datalink (Portafolio Alliance) */}
            <path d="M 670 145 L 600 145 L 560 145" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="670" cy="145" r="3" fill="#a855f7" />
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveSocket('datalink')}
            >
              <rect x="680" y="130" width="140" height="30" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
              <text x="690" y="144" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace">DATALINK PORTAFOLIO</text>
              <text x="690" y="155" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">» PRUEBAS CONGRESO & KIEL</text>
            </g>
          </svg>
        </div>

        {/* Chassis Selector Buttons on Workbench */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800 text-[10px]">
          <span className="text-slate-400 uppercase font-bold">
            SOCKET ACTIVO: <strong className="text-amber-400 uppercase">{activeSocket}</strong> • MONTAR CHASIS EN BANCO:
          </span>
          <div className="flex items-center gap-2">
            {(['science', 'geophysics', 'policy'] as const).map(cKey => (
              <button
                key={cKey}
                onClick={() => {
                  setActiveChassis(cKey);
                  setActiveSocket('chassis');
                }}
                className={`px-3 py-1 rounded-lg font-bold uppercase transition cursor-pointer ${
                  activeChassis === cKey
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cKey === 'science' ? '🌿 Suelos/Kiel' : cKey === 'geophysics' ? '🛰️ Geofísica/GIS' : '🏛️ Gobernanza UE'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. THE GUNSMITH BENCH: MODULAR SLOTS RACK & LIVE CANVAS
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MODULAR ATTACHMENTS RACK (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Socket Selector Tabs */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>RACK DE BALAS & PROYECTILES STAR (MÁXIMO 4 CARGADAS)</span>
              </span>
              <span className="text-xs font-black text-sky-400">
                {equippedIds.length} / 4 BALAS CARGADAS
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Cada bala contiene un proyectil curricular de alto calibre extraído directamente de la evidencia verificada en tu <strong>Portafolio</strong>.
            </p>

            {/* List of Modular Attachments / Bullets */}
            <div className="space-y-2.5">
              {PORTFOLIO_EVIDENCE_CATALOG.map(item => {
                const isEquipped = equippedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition relative overflow-hidden ${
                      isEquipped
                        ? 'bg-[#0f1a2e] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-950/70 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                            isEquipped 
                              ? 'bg-amber-950 text-amber-300 border-amber-600' 
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            LÁMINA {item.sectionId}
                          </span>
                          <span className="text-xs font-bold text-white font-sans">
                            {item.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-200 font-sans leading-relaxed mb-2">
                          "{item.attachmentsForCV[lang === 'es' ? 'bulletEs' : lang === 'en' ? 'bulletEn' : 'bulletDe']}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                          {item.keyKeywords.map(k => (
                            <span key={k} className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Equip / Unequip Button */}
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => toggleEquip(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                            isEquipped
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow font-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {isEquipped ? '✓ EN RECAMARA' : '+ CARGAR BALA'}
                        </button>

                        <a
                          href={`https://danisantanderurrutia-coder.github.io/Portafolio/${item.portfolioUrlAnchor}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] text-sky-400 hover:text-white flex items-center gap-1 transition"
                          title="Abrir prueba en la app Portafolio"
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

        {/* RIGHT COLUMN: 1-PAGE TACTICAL BRIEFING CANVAS (5 COLS) */}
        <div className="lg:col-span-5 sticky top-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5 font-sans">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>EXPEDIENTE TÁCTICO // 1 PÁGINA PERFECCIONADA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                100% LISTO ATS
              </span>
            </div>

            {/* Document Sheet Simulation */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-[10px] space-y-3 font-sans shadow-inner min-h-[460px]">
              {/* Header */}
              <div className="border-b border-slate-700 pb-2.5 text-center">
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
                  🔗 Búnker de Evidencia Multimedia: danisantanderurrutia-coder.github.io/Portafolio
                </div>
              </div>

              {/* Executive Scientific Summary */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                  RESUMEN EJECUTIVO (CHASIS SELECCIONADO)
                </div>
                <p className="text-[9.5px] text-slate-300 leading-relaxed font-sans">
                  {lang === 'es'
                    ? 'Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia) y Licenciado en Geofísica por la Universidad de Chile (Distinción Máxima). Especialista en modelación cuantitativa de carbono, balances hidrológicos y gobernanza socio-ecológica.'
                    : lang === 'en'
                    ? 'Double M.Sc. in Environmental Management & Protection (CAU Kiel, Germany / AMU Poznań, Poland) and B.Sc. in Geophysics from Universidad de Chile with Highest Honors. Proven expertise in carbon flux modeling, watershed hydrology, and EU policy.'
                    : 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań); B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung. Experte für Kohlenstoffbilanzierung und Umweltpolitik.'
                  }
                </p>
              </div>

              {/* Equipped Bullets */}
              <div>
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                  MUNICIÓN STAR // PROYECTOS VERIFICADOS ({equippedItems.length} SLOTS)
                </div>
                <div className="space-y-1.5 font-sans">
                  {equippedItems.map(item => (
                    <div key={item.id} className="text-[9.5px] text-slate-200 leading-snug flex items-start gap-1.5">
                      <span className="text-amber-400 font-black shrink-0">▸</span>
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

              {/* Academic Credentials */}
              <div className="border-t border-slate-800 pt-1.5">
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                  TITULACIONES DE MÁXIMO RIGOR EUROPEO
                </div>
                <div className="text-[9px] text-slate-300 space-y-0.5 font-sans">
                  <div>🎓 <strong>CAU Kiel & AMU Poznań</strong>: Doble M.Sc. Gestión & Protección Ambiental (2024)</div>
                  <div>🔬 <strong>Universidad de Chile (FCFM)</strong>: Licenciado en Geofísica (Distinción Máxima)</div>
                </div>
              </div>

              {/* Zero-Bloat Seal */}
              <div className="pt-2 text-center text-[9px] font-mono text-emerald-400 flex items-center justify-center gap-1 border-t border-slate-800/80">
                <span>✓ REGLA DE ORO CUMPLIDA: 1 PÁGINA ESTRICTA (0% PAJA • 100% SEÑAL)</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyCV}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? '¡COPIADO AL PORTAPAPELES!' : 'COPIAR TEXTO LOADOUT'}</span>
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
