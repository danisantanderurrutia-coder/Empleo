import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  FileCheck2, 
  GraduationCap, 
  ChevronLeft,
  Award,
  Eye,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { MasterProfileTab } from '../profile/MasterProfileTab';
import { CVManagementTab } from '../cvs/CVManagementTab';
import { CVStudioTab } from '../cvs/CVStudioTab';
import { CVPreviewModal } from '../cvs/CVPreviewModal';
import { SkillTreeTab } from './SkillTreeTab';
import { getStoredProfile, getStoredCVs } from '../../services/db';
import type { CVVersion } from '../../types/cv';

interface AgentDossierTabProps {
  initialSubTab?: 'showcase' | 'skills' | 'profile' | 'cvs' | 'studio';
  initialStudioOfferId?: string;
  onReturnToHub?: () => void;
}

export const AgentDossierTab: React.FC<AgentDossierTabProps> = ({ 
  initialSubTab = 'showcase',
  initialStudioOfferId,
  onReturnToHub
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'showcase' | 'skills' | 'profile' | 'cvs' | 'studio'>(initialSubTab);
  const [previewingCv, setPreviewingCv] = useState<CVVersion | null>(null);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const profile = getStoredProfile();
  const cvList = getStoredCVs();

  // Loadout selections
  const cvEs = cvList.find(c => c.language === 'es') || cvList[0];
  const cvEn = cvList.find(c => c.language === 'en') || cvList[1] || cvList[0];
  const cvDe = cvList.find(c => c.language === 'de') || cvList[2] || cvList[0];

  // Professional operative and research laboratory images from Unsplash
  const backgroundWall = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80';
  const tacticalOperative = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-5 text-[var(--text-primary)] animate-fadeIn">
      {/* Tactical Top Bar */}
      <div 
        className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md gap-3 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer shadow border shrink-0"
              style={{ 
                backgroundColor: 'var(--panel-bg)', 
                borderColor: 'var(--panel-border)',
                color: 'var(--text-primary)'
              }}
              title="Volver a la consola central"
            >
              <ChevronLeft className="h-4 w-4 text-sky-500" />
              <span className="hidden sm:inline">« PANEL</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-mono uppercase tracking-tight truncate">
                OPERATORS // EXPEDIENTE & COMPETENCIAS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/40 font-extrabold hidden md:inline-block">
                VERIFICADO
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans truncate">
              Daniel Santander: Doble M.Sc. CAU Kiel • Geofísica U. de Chile • Calibración Curricular Modular.
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher (Clean, compact, no horizontal overflow) */}
        <div 
          className="flex items-center p-1 rounded-xl border gap-1 shrink-0 overflow-x-auto max-w-full"
          style={{ 
            backgroundColor: 'var(--panel-bg)', 
            borderColor: 'var(--panel-border)' 
          }}
        >
          <button
            onClick={() => setActiveSubTab('showcase')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'showcase'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Resumen</span>
          </button>

          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'skills'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-emerald-500" />
            <span>Competencias</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'profile'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Expediente</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cvs')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'cvs'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Plantillas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('studio')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'studio'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>CV Studio</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
       * VISTA PRINCIPAL: RESUMEN DE EXPEDIENTE PROFESIONAL
       * ============================================================== */}
      {activeSubTab === 'showcase' && (
        <div 
          className="relative rounded-3xl overflow-hidden p-6 border border-slate-800 shadow-2xl select-none"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 25, 0.92), rgba(7, 11, 20, 0.96)), url('${backgroundWall}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle Scanlines & Tactical Grid */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-30 mix-blend-overlay" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* --------------------------------------------------------
             * COL 1 (LEFT, 4 COLS): ATTRIBUTES, SPECIALIZATIONS & VISA
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              {/* Identity Header */}
              <div className="bg-[#121927]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                      CALLSIGN // GEO-SCIENTIST
                    </span>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
                      {profile.fullName || 'DANIEL SANTANDER'}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/50">
                    TIER-1 MINT
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-sans leading-relaxed">
                  Científico Ambiental y Geofísico con Doble M.Sc. en Alemania (CAU Kiel) y Polonia (AMU Poznań). Especialista en modelación cuantitativa de carbono, balances hidrológicos y gobernanza socio-ecológica.
                </div>

                {/* Mobility & Legal Status */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Estatus Migratorio & Movilidad UE
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400 uppercase">Alemania</div>
                      <div className="font-bold text-emerald-400">§20 AufenthG</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400 uppercase">España</div>
                      <div className="font-bold text-sky-400">Ley 14 / PAC</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes Radar & Competencies Matrix */}
              <div className="bg-[#121927]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-3 flex-1 flex flex-col justify-between">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                    MATRIZ DE ATRIBUTOS TÉCNICOS
                  </h3>
                  <span className="text-[10px] font-mono text-slate-300">
                    CALIBRACIÓN BASADA EN PROYECTOS VERIFICADOS
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-200 font-bold">Modelación Espacial (R, Python, GIS, GEE)</span>
                      <span className="text-emerald-400 font-extrabold">98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-200 font-bold">Biogeoquímica & Dinámica de Carbono</span>
                      <span className="text-emerald-400 font-extrabold">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-200 font-bold">Gobernanza Socio-Ecológica & Políticas</span>
                      <span className="text-sky-400 font-extrabold">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-200 font-bold">Rigor Académico Europeo (Kiel / Poznań)</span>
                      <span className="text-amber-400 font-extrabold">96%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>

                {/* Languages Matrix */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>Español: <strong>C2 Nativo</strong></span>
                  <span>•</span>
                  <span>English: <strong>C1 CEMS</strong></span>
                  <span>•</span>
                  <span>Deutsch: <strong>B1</strong></span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
             * COL 2 (CENTER, 4 COLS): PERFIL ACTIVO DEL ESPECIALISTA
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 rounded-2xl border-2 border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col justify-between min-h-[460px] group">
              {/* Operative Background Image */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(10, 15, 25, 0.95) 0%, rgba(10, 15, 25, 0.3) 50%, rgba(10, 15, 25, 0.85) 100%), url('${tacticalOperative}')`
                }}
              />

              {/* Holographic Tactical Reticle & Crosshair */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-amber-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
                <div className="w-64 h-64 rounded-full border border-amber-500/10 border-dashed animate-[spin_35s_linear_infinite_reverse]" />
              </div>

              {/* Top Banner inside Hero */}
              <div className="relative z-20 p-4 flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-400">
                  OPERATOR // PERFIL ACTIVO
                </span>
                <span className="text-[10px] font-mono font-extrabold text-white drop-shadow">
                  CLEARANCE 50
                </span>
              </div>

              {/* Center Emblem & Nameplate */}
              <div className="relative z-20 text-center px-4 my-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black/70 border-2 border-amber-400 shadow-2xl mb-2">
                  <Award className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans drop-shadow-lg">
                  ELITE SCIENTIFIC OPERATIVE
                </h3>
                <span className="text-xs font-mono text-amber-300 font-extrabold uppercase tracking-widest drop-shadow bg-black/60 px-3 py-1 rounded mt-1 inline-block">
                  CAU KIEL • U. DE CHILE
                </span>
              </div>

              {/* Bottom Hero Control Bar */}
              <div className="relative z-20 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>ABRIR EXPEDIENTE DETALLADO</span>
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------
             * COL 3 (RIGHT, 4 COLS): WEAPONRY & LOADOUT SELECTION (CVS)
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              {/* Tactical Weaponry / Loadout Card */}
              <div className="bg-[#121927]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-3 flex-1 flex flex-col justify-between">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                      VERSIONES DE CV // FORMATOS POR REGIÓN
                    </h3>
                    <span className="text-[10px] font-mono text-slate-300">
                      DOCUMENTACIÓN COMPILADA & VERIFICADA
                    </span>
                  </div>
                  <FileText className="h-4 w-4 text-amber-400" />
                </div>

                <div className="space-y-3">
                  {/* Loadout 1: ES */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/80 transition group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        🇪🇸 VERSIÓN 1: ESPAÑOL (EUSKADI & ESPAÑA)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans mb-2">
                      Optimizado para I+D vasco (BC3, Tecnalia, IDOM, Neiker) y convocatorias de Ley 14.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvEs)}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvEs);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Loadout 2: EN */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/80 transition group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        🇬🇧 VERSIÓN 2: INGLÉS (POLÍTICA INTERNACIONAL & I+D)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans mb-2">
                      Formato internacional para think-tanks, consultorías climáticas y teletrabajo europeo.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvEn)}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvEn);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Loadout 3: DE */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/80 transition group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        🇩🇪 VERSIÓN 3: ALEMÁN (§20 AUFENTHG / DACH)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans mb-2">
                      Lebenslauf estructurado con foco en instituciones alemanas y centros de investigación.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvDe)}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvDe);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Switch to Full CV Armory */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setActiveSubTab('cvs')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <FileCheck2 className="h-4 w-4 text-amber-400" />
                    <span>GESTIONAR O COMPILAR MÁS PLANTILLAS</span>
                  </button>
                </div>
              </div>

              {/* Verified Deployments Badge Box */}
              <div className="bg-[#121927]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 shadow-xl space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>HITOS ACADÉMICOS Y CIENTÍFICOS VERIFICADOS</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 font-sans">
                  <div>🎓 <strong>CAU Kiel / AMU Poznań</strong>: Doble M.Sc. Gestión & Protección Ambiental</div>
                  <div>🔬 <strong>Universidad de Chile</strong>: Licenciatura en Geofísica (Con Distinción)</div>
                  <div>🛰️ <strong>5+ Años de Experiencia</strong>: Proyectos en Euskadi, Alemania y Latinoamérica</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: SKILL TREE & TRAINING BOUNTIES */}
      {activeSubTab === 'skills' && (
        <SkillTreeTab />
      )}

      {/* SUB-PANEL 4: MASTER PROFILE DETAILED FORM */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <MasterProfileTab />
        </div>
      )}

      {/* SUB-PANEL 5: CV MANAGEMENT & TEMPLATE COMPILER */}
      {activeSubTab === 'cvs' && (
        <div className="space-y-4">
          <CVManagementTab />
        </div>
      )}

      {/* SUB-PANEL 6: CV STUDIO (A4, datos verificados, adaptación por oferta) */}
      {activeSubTab === 'studio' && (
        <div className="space-y-4">
          <CVStudioTab initialOfferId={initialStudioOfferId} />
        </div>
      )}

      {/* CV Preview & Print Modal */}
      <CVPreviewModal
        cv={previewingCv}
        isOpen={!!previewingCv}
        onClose={() => setPreviewingCv(null)}
      />
    </div>
  );
};
