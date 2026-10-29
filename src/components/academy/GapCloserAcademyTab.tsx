import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Award,
  ChevronLeft
} from 'lucide-react';
import { ACADEMY_COURSES } from '../../data/academyCourses';
import { getStoredCourseProgress, setCourseStatus } from '../../services/db';
import type { CourseCostType, CourseStatus } from '../../types/academy';

interface GapCloserAcademyTabProps {
  initialGapId?: string;
  onNavigateToSkillTree?: () => void;
}

export const GapCloserAcademyTab: React.FC<GapCloserAcademyTabProps> = ({
  initialGapId,
  onNavigateToSkillTree
}) => {
  const [courseProgress, setCourseProgressState] = useState(getStoredCourseProgress());
  const [selectedGapFilter, setSelectedGapFilter] = useState<string>(initialGapId || 'ALL');
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('ALL');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize storage
  const handleUpdateStatus = (
    courseId: string, 
    newStatus: CourseStatus, 
    newPercent?: number, 
    notes?: string
  ) => {
    setCourseStatus(courseId, newStatus, newPercent, notes);
    setCourseProgressState({ ...getStoredCourseProgress() });
  };

  // Distinct providers list
  const providers = useMemo(() => {
    const set = new Set<string>();
    ACADEMY_COURSES.forEach(c => set.add(c.provider.split('/')[0].trim()));
    return Array.from(set).sort();
  }, []);

  // Distinct gaps list
  const gapOptions = useMemo(() => {
    const map = new Map<string, string>();
    ACADEMY_COURSES.forEach(c => {
      if (!map.has(c.gapId)) {
        map.set(c.gapId, c.gapName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return ACADEMY_COURSES.filter(course => {
      // Gap filter
      if (selectedGapFilter !== 'ALL' && course.gapId !== selectedGapFilter) {
        return false;
      }
      // Cost filter
      if (selectedCostFilter !== 'ALL' && course.costType !== selectedCostFilter) {
        return false;
      }
      // Provider filter
      if (selectedProviderFilter !== 'ALL' && !course.provider.includes(selectedProviderFilter)) {
        return false;
      }
      // Status filter
      const userProg = courseProgress[course.id];
      const currentStatus: CourseStatus = userProg ? userProg.status : 'AVAILABLE';
      if (selectedStatusFilter !== 'ALL' && currentStatus !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchSkills = course.skillsLearned.some(s => s.toLowerCase().includes(q));
        const matchSummary = course.syllabusSummary.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchSkills && !matchSummary) {
          return false;
        }
      }
      return true;
    });
  }, [selectedGapFilter, selectedCostFilter, selectedProviderFilter, selectedStatusFilter, searchQuery, courseProgress]);

  // Global KPI calculations
  const totalCourses = ACADEMY_COURSES.length;
  const inProgressCount = Object.values(courseProgress).filter(p => p.status === 'IN_PROGRESS').length;
  const completedCount = Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length;
  const totalCompletedXP = ACADEMY_COURSES.reduce((acc, c) => {
    const prog = courseProgress[c.id];
    if (prog && prog.status === 'COMPLETED') {
      return acc + c.xpValue;
    } else if (prog && prog.status === 'IN_PROGRESS') {
      return acc + Math.round((c.xpValue * (prog.progressPercent || 25)) / 100);
    }
    return acc;
  }, 0);

  const getCostBadge = (costType: CourseCostType, label: string) => {
    switch (costType) {
      case 'FREE':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          label: label || '100% Gratuito (Oficial)'
        };
      case 'EU_SUBSIDIZED':
        return {
          bg: 'bg-sky-500/15 border-sky-500/40 text-sky-400',
          label: label || 'Subvencionado UE'
        };
      case 'FREE_AUDIT':
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400',
          label: label || 'Auditoría Libre / Financial Aid'
        };
      case 'OFFICIAL_EXAM':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          label: label || 'Examen Oficial Internacional'
        };
    }
  };

  return (
    <div className="space-y-5 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. TOP TACTICAL HUD HEADER BAR
       * ========================================================================= */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border shadow-xl relative overflow-hidden transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigateToSkillTree && (
              <button
                onClick={onNavigateToSkillTree}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer shadow border shrink-0 hover:border-cyan-500"
                style={{ 
                  backgroundColor: 'var(--panel-bg)', 
                  borderColor: 'var(--panel-border)',
                  color: 'var(--text-primary)'
                }}
                title="Volver a la vista del Árbol de Habilidades"
              >
                <ChevronLeft className="h-4 w-4 text-cyan-500" />
                <span className="hidden sm:inline">« ÁRBOL</span>
              </button>
            )}

            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-primary)] uppercase">
                  Academia Estratégica & Radar de Certificaciones
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold hidden sm:inline-block">
                  EXPANSIÓN CONTINUA & BRECHAS CLAVE
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Programas oficiales y subvencionados para expandir tu campo transdisciplinario de habilidades (Geofísica, Suelos & Carbono, Consorcios I+D, CSRD, Alemán C1 e IA) y cerrar brechas de mercado prioritarias.
              </p>
            </div>
          </div>

          {/* Quick Metrics HUD */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 overflow-x-auto pb-1 md:pb-0">
            <div className="p-2 sm:p-2.5 rounded-xl border bg-black/30 border-white/10 text-center min-w-[70px]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Total</div>
              <div className="text-sm sm:text-base font-black text-cyan-400 font-mono">{totalCourses}</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border bg-black/30 border-white/10 text-center min-w-[80px]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">En Curso</div>
              <div className="text-sm sm:text-base font-black text-amber-400 font-mono">{inProgressCount}</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border bg-black/30 border-white/10 text-center min-w-[80px]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Certificados</div>
              <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">{completedCount}</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl border bg-black/30 border-white/10 text-center min-w-[95px]">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">XP Ganado</div>
              <div className="text-sm sm:text-base font-black text-sky-400 font-mono flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
                <span>+{totalCompletedXP}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Synaptic XP Global Charge Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>CARGA SINÁPTICA POR CAPACITACIÓN ({totalCompletedXP} XP acumulados)</span>
            </span>
            <span className="text-cyan-400 font-bold">
              {completedCount} de {totalCourses} completados ({Math.round((completedCount / totalCourses) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, (totalCompletedXP / (totalCourses * 500)) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. SEARCH & MULTI-FACTOR FILTERS
       * ========================================================================= */}
      <div 
        className="p-4 rounded-2xl border shadow-lg space-y-3 transition-colors"
        style={{ 
          backgroundColor: 'var(--panel-bg)', 
          borderColor: 'var(--panel-border)' 
        }}
      >
        {/* Search bar & active filter count */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input 
              type="text"
              placeholder="Buscar por tecnología, temario, proveedor o habilidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-mono text-[var(--text-muted)]">
            <span>Mostrando: <strong className="text-[var(--text-primary)]">{filteredCourses.length}</strong> de {totalCourses} programas</span>
            {(selectedGapFilter !== 'ALL' || selectedCostFilter !== 'ALL' || selectedProviderFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGapFilter('ALL');
                  setSelectedCostFilter('ALL');
                  setSelectedProviderFilter('ALL');
                  setSelectedStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-2 py-1 rounded-lg border text-[10px] font-bold text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer transition"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Filter selector row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
          
          {/* 1. Gap Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] mb-1">
              Brecha de Mercado:
            </label>
            <select
              value={selectedGapFilter}
              onChange={(e) => setSelectedGapFilter(e.target.value)}
              className="w-full p-2 rounded-xl border font-mono text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">Todas las 8 Brechas</option>
              {gapOptions.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Cost Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] mb-1">
              Tipo de Coste:
            </label>
            <select
              value={selectedCostFilter}
              onChange={(e) => setSelectedCostFilter(e.target.value)}
              className="w-full p-2 rounded-xl border font-mono text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">Todos los Costes</option>
              <option value="FREE">100% Gratuito (Oficial)</option>
              <option value="EU_SUBSIDIZED">Subvencionado UE</option>
              <option value="FREE_AUDIT">Auditoría Libre / Financial Aid</option>
              <option value="OFFICIAL_EXAM">Examen Oficial Internacional</option>
            </select>
          </div>

          {/* 3. Provider Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] mb-1">
              Plataforma / Proveedor:
            </label>
            <select
              value={selectedProviderFilter}
              onChange={(e) => setSelectedProviderFilter(e.target.value)}
              className="w-full p-2 rounded-xl border font-mono text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">Todos los Proveedores</option>
              {providers.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 4. Status Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] mb-1">
              Estado de Seguimiento:
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl border font-mono text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="ALL">Todos los Estados</option>
              <option value="AVAILABLE">Disponible / Por Iniciar</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completado / Certificado</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. COURSES CARDS GRID
       * ========================================================================= */}
      {filteredCourses.length === 0 ? (
        <div 
          className="p-10 rounded-2xl border text-center space-y-3"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No se encontraron programas formativos con los filtros aplicados
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Prueba a restablecer los filtros de búsqueda o seleccionar otra brecha de mercado para visualizar los programas disponibles.
          </p>
          <button
            onClick={() => {
              setSelectedGapFilter('ALL');
              setSelectedCostFilter('ALL');
              setSelectedProviderFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const userProg = courseProgress[course.id] || {
              courseId: course.id,
              status: 'AVAILABLE',
              progressPercent: 0
            };
            const currentStatus = userProg.status;
            const costBadge = getCostBadge(course.costType, course.costLabel);

            return (
              <div 
                key={course.id}
                className={`p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                  currentStatus === 'COMPLETED'
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : currentStatus === 'IN_PROGRESS'
                    ? 'border-amber-500/40 bg-amber-950/15'
                    : 'border-white/10'
                }`}
                style={{ 
                  backgroundColor: currentStatus === 'AVAILABLE' ? 'var(--card-bg)' : undefined, 
                  borderColor: currentStatus === 'AVAILABLE' ? 'var(--card-border)' : undefined 
                }}
              >
                {/* Top badges bar */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base shrink-0">{course.badgeIcon || '🎓'}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-cyan-400">
                        {course.provider}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border ${costBadge.bg}`}>
                        {costBadge.label}
                      </span>
                      <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.durationHours}h</span>
                      </span>
                    </div>
                  </div>

                  {/* Target Market Gap Pill */}
                  <div className="mb-2">
                    <span className="text-[9.5px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      ⚡ BRECHA: {course.gapName.toUpperCase()}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-tight tracking-tight mb-2">
                    {course.title}
                  </h3>

                  {/* Match Impact Metric */}
                  <div className="p-2.5 rounded-xl border bg-black/30 border-white/10 mb-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Impacto en Coincidencia:</span>
                      </span>
                      <span className="text-emerald-400 font-mono font-bold text-[10.5px]">
                        {course.matchImpact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                      <span className="text-[var(--text-muted)] font-mono flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-amber-400" />
                        <span>Certificación:</span>
                      </span>
                      <span className="text-[var(--text-secondary)] font-mono text-[10px] text-right truncate max-w-[200px]" title={course.certificationType}>
                        {course.certificationType}
                      </span>
                    </div>
                  </div>

                  {/* Syllabus Summary */}
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    {course.syllabusSummary}
                  </p>

                  {/* Skills Learned Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.skillsLearned.map((skill, i) => (
                      <span 
                        key={i}
                        className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-slate-300"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Tracker & Action Bar */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  
                  {/* Status buttons selector */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 w-full">
                      <button
                        onClick={() => handleUpdateStatus(course.id, 'AVAILABLE', 0)}
                        className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition text-center cursor-pointer ${
                          currentStatus === 'AVAILABLE'
                            ? 'bg-slate-700 text-white shadow'
                            : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        Disponible
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(course.id, 'IN_PROGRESS', userProg.progressPercent || 25)}
                        className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition text-center cursor-pointer ${
                          currentStatus === 'IN_PROGRESS'
                            ? 'bg-amber-600 text-white shadow'
                            : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        En Curso
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(course.id, 'COMPLETED', 100)}
                        className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition text-center cursor-pointer flex items-center justify-center gap-1 ${
                          currentStatus === 'COMPLETED'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Certificado</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress slider if IN_PROGRESS */}
                  {currentStatus === 'IN_PROGRESS' && (
                    <div className="p-2.5 rounded-xl border bg-black/40 border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between text-[10.5px] font-mono">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Progreso de Estudio:</span>
                        </span>
                        <span className="text-white font-bold">{userProg.progressPercent || 25}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={userProg.progressPercent || 25}
                        onChange={(e) => handleUpdateStatus(course.id, 'IN_PROGRESS', parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      {userProg.notes && (
                        <p className="text-[10px] font-mono text-[var(--text-muted)] italic pt-1 border-t border-white/5">
                          Nota: {userProg.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Direct Link to Official Course Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>+{course.xpValue} XP</span>
                    </span>

                    <a 
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow cursor-pointer group"
                      title={`Abrir página oficial de ${course.provider}`}
                    >
                      <span>Acceder al Programa</span>
                      <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
