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
    <div className="space-y-4 text-slate-100 font-mono animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. THE GUNSMITH HERO HUD: COMPACT WEAPON BENCH IDENTIFIER & STATS
       * ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-[#060c18] via-[#091424] to-[#040811] p-4 shadow-xl">
        {/* Subtle Precision Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Tech Corner Crosshairs */}
        <div className="absolute top-2 left-2 text-[9px] text-sky-500/40 font-mono select-none pointer-events-none">┌ [SYS-ARM-01]</div>
        <div className="absolute top-2 right-2 text-[9px] text-sky-500/40 font-mono select-none pointer-events-none">[CAL: 1-PAGE] ┐</div>
        <div className="absolute bottom-2 left-2 text-[9px] text-sky-500/40 font-mono select-none pointer-events-none">└ 43°15'N 02°55'W</div>
        <div className="absolute bottom-2 right-2 text-[9px] text-sky-500/40 font-mono select-none pointer-events-none">D-SANTANDER ┘</div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-amber-400 animate-spin" />
                <span>GUNSMITH BENCH // ARMAS & BALÍSTICA CURRICULAR</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                SCHEMATIC: <strong className="text-sky-400">CV-1PAGE-MINT-v4</strong>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800/80 text-[9px] text-emerald-400 font-mono border border-slate-700">
                ● LIVE BENCH
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight flex items-center gap-2">
              <span>{currentChassis.name}</span>
            </h1>
            <p className="text-[11px] text-slate-300 font-sans max-w-2xl leading-relaxed">
              Configura tu currículum como una pieza de precisión balística: Chasis calibrado al teatro europeo, munición Star de alto impacto probada en tu Portafolio y dispersión cero.
            </p>
          </div>

          {/* Compact Weapon Performance HUD (R6 Siege Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800/90 shrink-0">
            <div className="min-w-[85px]">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">ALCANCE ATS</div>
              <div className="text-sm font-black text-emerald-400 font-mono">{currentChassis.stats.range}%</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${currentChassis.stats.range}%` }} />
              </div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">DENSIDAD</div>
              <div className="text-sm font-black text-amber-400 font-mono">1 PÁG</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `100%` }} />
              </div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">CARGADOR</div>
              <div className="text-sm font-black text-sky-400 font-mono">{equippedIds.length} / 4 RNDS</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-sky-400" style={{ width: `${(equippedIds.length / 4) * 100}%` }} />
              </div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">DATALINK</div>
              <div className="text-sm font-black text-purple-400 font-mono">ONLINE</div>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: `100%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Language & Caliber Switcher */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 uppercase font-bold">CALIBRE DE IDIOMA:</span>
            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
              {(['es', 'en', 'de'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-0.5 rounded font-bold uppercase transition cursor-pointer ${
                    lang === l
                      ? 'bg-amber-500 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'es' ? '🇪🇸 ES' : l === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>ESTÁNDAR: CONCISIÓN MILIMÉTRICA Y RESPALDO AUDITABLE</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. VISUAL BLUEPRINT BENCH: COMPACT HIGH-TECH WEAPON SCHEMATIC WIREFRAME
       * ========================================================================= */}
      <div className="p-3.5 rounded-2xl bg-[#070d18]/95 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        
        {/* Bench Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px] font-black uppercase text-white tracking-wider">
              BANCO DE PRECISIÓN // BLUEPRINT MODULAR
            </span>
            <span className="px-1.5 py-0.2 rounded bg-sky-950/80 text-[8px] text-sky-300 font-mono border border-sky-800">
              SOCKET ACTIVO: [{activeSocket.toUpperCase()}]
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
            <span>CHASIS:</span>
            {(['science', 'geophysics', 'policy'] as const).map(cKey => (
              <button
                key={cKey}
                onClick={() => {
                  setActiveChassis(cKey);
                  setActiveSocket('chassis');
                }}
                className={`px-2 py-0.5 rounded font-bold uppercase transition cursor-pointer text-[9px] ${
                  activeChassis === cKey
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cKey === 'science' ? '🌿 Suelos' : cKey === 'geophysics' ? '🛰️ Geo-GIS' : '🏛️ UE Policy'}
              </button>
            ))}
          </div>
        </div>

        {/* Compact SVG Blueprint Bench */}
        <div className="relative w-full overflow-x-auto py-1">
          <svg 
            viewBox="0 0 740 145" 
            className="w-full min-w-[660px] h-auto select-none"
          >
            <defs>
              <filter id="neonGlowSky" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neonGlowAmber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="railGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
              <pattern id="gridPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>

            {/* Background Technical Grid */}
            <rect x="0" y="0" width="740" height="145" fill="url(#gridPattern)" />

            {/* Central Precision Calibration Rail Axis */}
            <line x1="20" y1="72" x2="720" y2="72" stroke="url(#railGrad)" strokeWidth="1.5" strokeDasharray="6 3" />
            
            {/* Precision Measurement Ticks on Main Rail */}
            {Array.from({ length: 36 }).map((_, i) => (
              <line 
                key={i} 
                x1={20 + i * 20} 
                y1={i % 5 === 0 ? "66" : "69"} 
                x2={20 + i * 20} 
                y2={i % 5 === 0 ? "78" : "75"} 
                stroke={i % 5 === 0 ? "#38bdf8" : "#334155"} 
                strokeWidth={i % 5 === 0 ? "1" : "0.5"} 
              />
            ))}

            {/* Technical Crosshairs and Watermarks */}
            <text x="25" y="15" fill="#475569" fontSize="7" fontFamily="monospace">COORD: 43.26°N 02.93°W</text>
            <text x="370" y="15" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">SCHEMATIC: STAR-CV // RIGOR 1-PAGE</text>
            <text x="715" y="15" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="end">TOLERANCE: 0.00mm</text>

            {/* -------------------------------------------------------------
             * SOCKET 1: CHASSIS RECEIVER (X: 18 - 180, Y: 22 - 128)
             * ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveSocket('chassis')}
            >
              <rect 
                x="18" 
                y="24" 
                width="165" 
                height="100" 
                rx="8" 
                fill="#0b1322" 
                stroke={activeSocket === 'chassis' ? '#f59e0b' : '#334155'} 
                strokeWidth={activeSocket === 'chassis' ? '2' : '1'} 
                filter={activeSocket === 'chassis' ? 'url(#neonGlowAmber)' : undefined}
                className="transition-all"
              />
              {/* Corner brackets */}
              <path d="M 23 32 L 23 27 L 28 27" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <path d="M 178 32 L 178 27 L 173 27" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <path d="M 23 116 L 23 121 L 28 121" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <path d="M 178 116 L 178 121 L 173 121" fill="none" stroke="#f59e0b" strokeWidth="1" />

              <text x="28" y="42" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                [SKT-01 // CHASIS ACTIVO]
              </text>
              <text x="28" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                {currentChassis.code}
              </text>
              <text x="28" y="70" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
                CALIBRE: {currentChassis.caliber}
              </text>

              {/* Chassis Mini Spec Indicator Bars */}
              <g transform="translate(28, 80)">
                <text x="0" y="8" fill="#64748b" fontSize="7" fontFamily="monospace">PENETRACIÓN</text>
                <rect x="75" y="2" width="65" height="6" rx="2" fill="#1e293b" />
                <rect x="75" y="2" width={`${(currentChassis.stats.penetration / 100) * 65}`} height="6" rx="2" fill="#f59e0b" />
                
                <text x="0" y="22" fill="#64748b" fontSize="7" fontFamily="monospace">MOVILIDAD ATS</text>
                <rect x="75" y="16" width="65" height="6" rx="2" fill="#1e293b" />
                <rect x="75" y="16" width={`${(currentChassis.stats.mobility / 100) * 65}`} height="6" rx="2" fill="#10b981" />
              </g>

              <circle cx="170" cy="35" r="3" fill={activeSocket === 'chassis' ? '#f59e0b' : '#334155'} />
            </g>

            {/* Inter-socket Bus Connector 1 */}
            <path d="M 183 72 L 198 72" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="190" cy="72" r="2" fill="#38bdf8" />

            {/* -------------------------------------------------------------
             * SOCKET 2: AMMO MAGAZINE WELL (X: 198 - 368, Y: 24 - 124)
             * ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveSocket('ammo')}
            >
              <rect 
                x="198" 
                y="24" 
                width="172" 
                height="100" 
                rx="8" 
                fill="#0b1322" 
                stroke={activeSocket === 'ammo' ? '#38bdf8' : '#334155'} 
                strokeWidth={activeSocket === 'ammo' ? '2' : '1'} 
                filter={activeSocket === 'ammo' ? 'url(#neonGlowSky)' : undefined}
                className="transition-all"
              />
              <path d="M 203 32 L 203 27 L 208 27" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <path d="M 365 32 L 365 27 L 360 27" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <path d="M 203 116 L 203 121 L 208 121" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <path d="M 365 116 L 365 121 L 360 121" fill="none" stroke="#38bdf8" strokeWidth="1" />

              <text x="208" y="42" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                [SKT-02 // CARGADOR STAR]
              </text>
              <text x="360" y="42" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                {equippedIds.length}/4 RNDS
              </text>

              {/* 4 Precision Cartridge Cells with Glowing Tips */}
              <g transform="translate(208, 52)">
                {Array.from({ length: 4 }).map((_, i) => {
                  const isLoaded = i < equippedIds.length;
                  return (
                    <g key={i} transform={`translate(${i * 38}, 0)`}>
                      {/* Cartridge Outer Shell */}
                      <rect 
                        x="0" 
                        y="0" 
                        width="32" 
                        height="55" 
                        rx="4" 
                        fill={isLoaded ? '#0f1f38' : '#080d16'} 
                        stroke={isLoaded ? '#38bdf8' : '#1e293b'} 
                        strokeWidth={isLoaded ? '1.5' : '1'} 
                      />
                      {/* Bullet Primer Cap */}
                      <rect 
                        x="8" 
                        y="4" 
                        width="16" 
                        height="6" 
                        rx="1" 
                        fill={isLoaded ? '#f59e0b' : '#334155'} 
                      />
                      {/* Charge Level Segment */}
                      <rect 
                        x="6" 
                        y="14" 
                        width="20" 
                        height="18" 
                        rx="2" 
                        fill={isLoaded ? '#38bdf8' : '#1e293b'} 
                        fillOpacity={isLoaded ? 0.3 : 0.2}
                        stroke={isLoaded ? '#38bdf8' : '#334155'}
                        strokeWidth="0.5"
                      />
                      {/* LED State Pip */}
                      <circle 
                        cx="16" 
                        cy="42" 
                        r={isLoaded ? "3.5" : "2"} 
                        fill={isLoaded ? '#10b981' : '#475569'} 
                      />
                      <text x="16" y="51" fill={isLoaded ? '#38bdf8' : '#64748b'} fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {isLoaded ? `0${i + 1}` : 'EMP'}
                      </text>
                    </g>
                  );
                })}
              </g>

              <circle cx="358" cy="35" r="3" fill={activeSocket === 'ammo' ? '#38bdf8' : '#334155'} />
            </g>

            {/* Inter-socket Bus Connector 2 */}
            <path d="M 370 72 L 385 72" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="378" cy="72" r="2" fill="#10b981" />

            {/* -------------------------------------------------------------
             * SOCKET 3: OPTICS ATS TARGETING (X: 385 - 545, Y: 24 - 124)
             * ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveSocket('optics')}
            >
              <rect 
                x="385" 
                y="24" 
                width="160" 
                height="100" 
                rx="8" 
                fill="#0b1322" 
                stroke={activeSocket === 'optics' ? '#10b981' : '#334155'} 
                strokeWidth={activeSocket === 'optics' ? '2' : '1'} 
                className="transition-all"
              />
              <path d="M 390 32 L 390 27 L 395 27" fill="none" stroke="#10b981" strokeWidth="1" />
              <path d="M 540 32 L 540 27 L 535 27" fill="none" stroke="#10b981" strokeWidth="1" />
              <path d="M 390 116 L 390 121 L 395 121" fill="none" stroke="#10b981" strokeWidth="1" />
              <path d="M 540 116 L 540 121 L 535 121" fill="none" stroke="#10b981" strokeWidth="1" />

              <text x="395" y="42" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">
                [SKT-03 // ÓPTICA ATS]
              </text>
              <text x="395" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                COLIMADOR LÉXICO
              </text>

              {/* Collimator Reticle Graphic */}
              <g transform="translate(465, 80)">
                <circle cx="0" cy="0" r="24" fill="#06121e" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#34d399" strokeWidth="1" />
                <circle cx="0" cy="0" r="3" fill="#10b981" />
                <line x1="-28" y1="0" x2="-18" y2="0" stroke="#10b981" strokeWidth="1" />
                <line x1="18" y1="0" x2="28" y2="0" stroke="#10b981" strokeWidth="1" />
                <line x1="0" y1="-28" x2="0" y2="-18" stroke="#10b981" strokeWidth="1" />
                <line x1="0" y1="18" x2="0" y2="28" stroke="#10b981" strokeWidth="1" />
              </g>

              <text x="395" y="115" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                PRECISIÓN: 98% MATCH ATS
              </text>

              <circle cx="535" cy="35" r="3" fill={activeSocket === 'optics' ? '#10b981' : '#334155'} />
            </g>

            {/* Inter-socket Bus Connector 3 */}
            <path d="M 545 72 L 560 72" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="552" cy="72" r="2" fill="#a855f7" />

            {/* -------------------------------------------------------------
             * SOCKET 4: DATALINK PORTAFOLIO ALLIANCE (X: 560 - 722, Y: 24 - 124)
             * ------------------------------------------------------------- */}
            <g 
              className="cursor-pointer group"
              onClick={() => setActiveSocket('datalink')}
            >
              <rect 
                x="560" 
                y="24" 
                width="162" 
                height="100" 
                rx="8" 
                fill="#0b1322" 
                stroke={activeSocket === 'datalink' ? '#a855f7' : '#334155'} 
                strokeWidth={activeSocket === 'datalink' ? '2' : '1'} 
                className="transition-all"
              />
              <path d="M 565 32 L 565 27 L 570 27" fill="none" stroke="#a855f7" strokeWidth="1" />
              <path d="M 717 32 L 717 27 L 712 27" fill="none" stroke="#a855f7" strokeWidth="1" />
              <path d="M 565 116 L 565 121 L 570 121" fill="none" stroke="#a855f7" strokeWidth="1" />
              <path d="M 717 116 L 717 121 L 712 121" fill="none" stroke="#a855f7" strokeWidth="1" />

              <text x="570" y="42" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace">
                [SKT-04 // DATALINK ALLIANCE]
              </text>
              <text x="570" y="56" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                PORTAFOLIO LIVE
              </text>

              {/* Data Frequency Pulse Antenna Graphic */}
              <g transform="translate(640, 78)">
                <path d="M -25 8 Q 0 -18 25 8" fill="none" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 2" />
                <path d="M -16 5 Q 0 -10 16 5" fill="none" stroke="#c084fc" strokeWidth="1.5" />
                <path d="M -8 2 Q 0 -4 8 2" fill="none" stroke="#e9d5ff" strokeWidth="2" />
                <circle cx="0" cy="12" r="3" fill="#a855f7" />
              </g>

              <text x="570" y="115" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                ENLACE: KIEL • POLONIA • CONGRESO
              </text>

              <circle cx="712" cy="35" r="3" fill={activeSocket === 'datalink' ? '#a855f7' : '#334155'} />
            </g>
          </svg>
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
