import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  ChevronLeft,
  X,
  BookOpen,
  Filter
} from 'lucide-react';
import { ACADEMY_COURSES } from '../../data/academyCourses';
import { getStoredCourseProgress, setCourseStatus } from '../../services/db';
import type { AcademyBranch, CourseCostType, CourseStatus } from '../../types/academy';

interface GapCloserAcademyTabProps {
  initialGapId?: string;
  onNavigateToSkillTree?: () => void;
}

// 7 Disciplinas auténticas + Alemán C1
const BRANCH_CONFIG: Record<AcademyBranch, { label: string; shortLabel: string; icon: string; color: string; bgBadge: string; borderBadge: string }> = {
  geophysics: {
    label: 'Geofísica & Sensores Remotos',
    shortLabel: 'Geofísica',
    icon: '🛰️',
    color: '#10b981',
    bgBadge: 'bg-emerald-500/10 dark:bg-emerald-950/40',
    borderBadge: 'border-emerald-500/30'
  },
  biogeo: {
    label: 'Biogeoquímica, Suelos & Agua',
    shortLabel: 'Suelos & Agua',
    icon: '💧',
    color: '#06b6d4',
    bgBadge: 'bg-cyan-500/10 dark:bg-cyan-950/40',
    borderBadge: 'border-cyan-500/30'
  },
  software: {
    label: 'Product Owner, Software & IA',
    shortLabel: 'Software & IA',
    icon: '⚡',
    color: '#3b82f6',
    bgBadge: 'bg-blue-500/10 dark:bg-blue-950/40',
    borderBadge: 'border-blue-500/30'
  },
  pm: {
    label: 'Gestión de Proyectos, I+D & Consorcios',
    shortLabel: 'Gestión I+D',
    icon: '🧭',
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/10 dark:bg-amber-950/40',
    borderBadge: 'border-amber-500/30'
  },
  grassroots: {
    label: 'Grassroots, Territorio & Regeneración',
    shortLabel: 'Grassroots',
    icon: '🌱',
    color: '#84cc16',
    bgBadge: 'bg-lime-500/10 dark:bg-lime-950/40',
    borderBadge: 'border-lime-500/30'
  },
  culture: {
    label: 'Cultura, Políticas & CSRD',
    shortLabel: 'Políticas & CSRD',
    icon: '🏛️',
    color: '#a855f7',
    bgBadge: 'bg-purple-500/10 dark:bg-purple-950/40',
    borderBadge: 'border-purple-500/30'
  },
  comms: {
    label: 'Comunicaciones, Prensa & Campañas',
    shortLabel: 'Prensa & Campañas',
    icon: '📢',
    color: '#f97316',
    bgBadge: 'bg-orange-500/10 dark:bg-orange-950/40',
    borderBadge: 'border-orange-500/30'
  },
  languages: {
    label: 'Alemán C1 & Cooperación DACH',
    shortLabel: 'Alemán C1',
    icon: '🇩🇪',
    color: '#0284c7',
    bgBadge: 'bg-sky-500/10 dark:bg-sky-950/40',
    borderBadge: 'border-sky-500/30'
  }
};

export const GapCloserAcademyTab: React.FC<GapCloserAcademyTabProps> = ({
  initialGapId,
  onNavigateToSkillTree
}) => {
  const [courseProgress, setCourseProgressState] = useState(getStoredCourseProgress());
  
  // Selected Branch Filter: 'ALL' | 'ONLY_GAPS' | AcademyBranch
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(initialGapId ? 'ONLY_GAPS' : 'ALL');
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGapFilter, setActiveGapFilter] = useState<string | undefined>(initialGapId);

  // Synchronize state and storage
  const handleUpdateStatus = (
    courseId: string, 
    newStatus: CourseStatus, 
    newPercent?: number, 
    notes?: string
  ) => {
    setCourseStatus(courseId, newStatus, newPercent, notes);
    setCourseProgressState({ ...getStoredCourseProgress() });
  };

  // Branch statistics counts
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: ACADEMY_COURSES.length, ONLY_GAPS: 0 };
    Object.keys(BRANCH_CONFIG).forEach(b => {
      counts[b] = 0;
    });

    ACADEMY_COURSES.forEach(c => {
      if (counts[c.branch] !== undefined) {
        counts[c.branch]++;
      }
      if (c.isMarketGap) {
        counts.ONLY_GAPS++;
      }
    });

    return counts;
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return ACADEMY_COURSES.filter(course => {
      // 1. Branch / Gap mode filter
      if (selectedBranchFilter === 'ONLY_GAPS' && !course.isMarketGap) {
        return false;
      }
      if (selectedBranchFilter !== 'ALL' && selectedBranchFilter !== 'ONLY_GAPS' && course.branch !== selectedBranchFilter) {
        return false;
      }

      // If active specific gap filter
      if (activeGapFilter && course.gapId !== activeGapFilter) {
        return false;
      }

      // 2. Cost filter
      if (selectedCostFilter !== 'ALL' && course.costType !== selectedCostFilter) {
        return false;
      }

      // 3. Status filter
      const userProg = courseProgress[course.id];
      const currentStatus: CourseStatus = userProg ? userProg.status : 'AVAILABLE';
      if (selectedStatusFilter !== 'ALL' && currentStatus !== selectedStatusFilter) {
        return false;
      }

      // 4. Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchSkills = course.skillsLearned.some(s => s.toLowerCase().includes(q));
        const matchSummary = course.syllabusSummary.toLowerCase().includes(q);
        const matchBranch = course.branchName.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchSkills && !matchSummary && !matchBranch) {
          return false;
        }
      }

      return true;
    });
  }, [selectedBranchFilter, activeGapFilter, selectedCostFilter, selectedStatusFilter, searchQuery, courseProgress]);

  // Global KPIs
  const totalCourses = ACADEMY_COURSES.length;
  const inProgressCount = Object.values(courseProgress).filter(p => p.status === 'IN_PROGRESS').length;
  const completedCount = Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length;
  const totalHours = ACADEMY_COURSES.reduce((acc, c) => acc + c.durationHours, 0);

  const totalEarnedXP = ACADEMY_COURSES.reduce((acc, c) => {
    const prog = courseProgress[c.id];
    if (prog?.status === 'COMPLETED') return acc + c.xpValue;
    if (prog?.status === 'IN_PROGRESS') return acc + Math.round((c.xpValue * (prog.progressPercent || 30)) / 100);
    return acc;
  }, 0);

  const getCostBadge = (costType: CourseCostType, label: string) => {
    switch (costType) {
      case 'FREE':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          label: label || 'Gratuito'
        };
      case 'EU_SUBSIDIZED':
        return {
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
          label: label || 'Subvencionado UE'
        };
      case 'FREE_AUDIT':
        return {
          bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          label: label || 'Auditoría Libre'
        };
      case 'OFFICIAL_EXAM':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          label: label || 'Examen Oficial'
        };
    }
  };

  return (
    <div className="space-y-4 text-[var(--text-primary)] font-sans animate-fadeIn">
      
      {/* =========================================================================
       * UNIFIED ACADEMY CONSOLE (HUD HEADER + METRICS + RADAR FILTER BAR)
       * ========================================================================= */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border shadow-md relative overflow-hidden transition-colors space-y-4"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        {/* Top Header Row with Title & Quick Metrics Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigateToSkillTree && (
              <button
                onClick={onNavigateToSkillTree}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer shadow-xs border shrink-0 hover:border-cyan-500"
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

            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-primary)] uppercase">
                  Academia Estratégica & Radar Formativo
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold hidden sm:inline-block">
                  7 ÁREAS TRANSDISCIPLINARIAS
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Catálogo curado de programas oficiales y abiertos para ampliar tu campo de especialización (Geofísica, Suelos & Carbono, Software IA, I+D, Grassroots, CSRD y Alemán).
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-black/30 border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Programas</span>
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{totalCourses}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-black/30 border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">En Estudio</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">{inProgressCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-black/30 border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Certificados</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-black/30 border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Horas Respaldadas</span>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">{totalHours}h</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-black/5 dark:bg-black/30 border-slate-200 dark:border-white/10 text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Carga Técnica</span>
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 font-mono">+{totalEarnedXP} XP</span>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            <span>Capacitación en Curso: <strong className="text-[var(--text-primary)]">{inProgressCount} activas</strong> • <strong className="text-emerald-500">{completedCount} certificadas</strong></span>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {Math.round(((completedCount * 1.0 + inProgressCount * 0.4) / totalCourses) * 100)}% de avance formativo global
          </div>
        </div>

        {/* Discipline Pill Filter & Search (Integrated Section) */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-3">
          {/* Branch Pills Row */}
          <div>
            <div className="text-[10.5px] font-mono uppercase font-bold text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-cyan-500" />
                <span>SELECCIONA TU ÁREA DE ESPECIALIZACIÓN O ENFOQUE:</span>
              </span>
              {(selectedBranchFilter !== 'ALL' || selectedCostFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || searchQuery || activeGapFilter) && (
                <button
                  onClick={() => {
                    setSelectedBranchFilter('ALL');
                    setSelectedCostFilter('ALL');
                    setSelectedStatusFilter('ALL');
                    setSearchQuery('');
                    setActiveGapFilter(undefined);
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* 1. All Button */}
              <button
                onClick={() => { setSelectedBranchFilter('ALL'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  selectedBranchFilter === 'ALL' && !activeGapFilter
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black'
                    : 'bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>🌐 Todas las Áreas</span>
                <span className="text-[10px] opacity-75 font-normal">({branchCounts.ALL})</span>
              </button>

              {/* 2. Only Gaps Button */}
              <button
                onClick={() => { setSelectedBranchFilter('ONLY_GAPS'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  selectedBranchFilter === 'ONLY_GAPS'
                    ? 'bg-rose-600 text-white font-black'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                }`}
              >
                <span>⚡ Brechas Prioritarias</span>
                <span className="text-[10px] opacity-75 font-normal">({branchCounts.ONLY_GAPS})</span>
              </button>

              {/* 3. The 7 Authentic Disciplines + Languages */}
              {(Object.keys(BRANCH_CONFIG) as AcademyBranch[]).map(branchKey => {
                const conf = BRANCH_CONFIG[branchKey];
                const isSelected = selectedBranchFilter === branchKey;
                const count = branchCounts[branchKey] || 0;

                return (
                  <button
                    key={branchKey}
                    onClick={() => { setSelectedBranchFilter(branchKey); setActiveGapFilter(undefined); }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                      isSelected
                        ? 'text-white font-black shadow-md'
                        : 'bg-black/5 dark:bg-black/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? conf.color : undefined,
                      borderColor: isSelected ? conf.color : 'var(--card-border)'
                    }}
                  >
                    <span>{conf.icon}</span>
                    <span className="hidden sm:inline">{conf.shortLabel}</span>
                    <span className="sm:hidden">{conf.shortLabel.slice(0, 10)}</span>
                    <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Sub-dropdowns row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200 dark:border-white/10 items-center justify-between text-xs">
            
            {/* Search box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input 
                type="text"
                placeholder="Buscar curso, temario, software o institución..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Quick Filters: Cost & Status */}
            <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
              <select
                value={selectedCostFilter}
                onChange={(e) => setSelectedCostFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="ALL">Coste: Todos</option>
                <option value="FREE">100% Gratuito</option>
                <option value="FREE_AUDIT">Auditoría Libre / Financial Aid</option>
                <option value="OFFICIAL_EXAM">Examen Oficial</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none focus:border-cyan-500"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="ALL">Estado: Todos</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="IN_PROGRESS">En Curso</option>
                <option value="COMPLETED">Certificado</option>
              </select>

              <span className="text-[11px] text-[var(--text-muted)] hidden md:inline ml-1">
                <strong>{filteredCourses.length}</strong> cursos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. 4-COLUMN HARMONIC & COMPACT CARDS GRID
       * ========================================================================= */}
      {filteredCourses.length === 0 ? (
        <div 
          className="p-10 rounded-2xl border text-center space-y-3"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          <BookOpen className="h-10 w-10 text-[var(--text-muted)] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No hay formaciones con los filtros seleccionados
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Prueba a seleccionar «Todas las Áreas» o restablecer los filtros de búsqueda para explorar todo el catálogo formativo.
          </p>
          <button
            onClick={() => {
              setSelectedBranchFilter('ALL');
              setSelectedCostFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSearchQuery('');
              setActiveGapFilter(undefined);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            Ver Todos los Cursos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredCourses.map(course => {
            const userProg = courseProgress[course.id] || {
              courseId: course.id,
              status: 'AVAILABLE',
              progressPercent: 0
            };
            const currentStatus = userProg.status;
            const branchStyle = BRANCH_CONFIG[course.branch];
            const costBadge = getCostBadge(course.costType, course.costLabel);

            return (
              <div
                key={course.id}
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 hover:shadow-lg relative overflow-hidden group ${
                  currentStatus === 'COMPLETED'
                    ? 'border-emerald-500/50 bg-emerald-500/[0.04]'
                    : currentStatus === 'IN_PROGRESS'
                    ? 'border-amber-500/50 bg-amber-500/[0.04]'
                    : 'hover:border-cyan-500/50'
                }`}
                style={{
                  backgroundColor: currentStatus === 'AVAILABLE' ? 'var(--card-bg)' : undefined,
                  borderColor: currentStatus === 'AVAILABLE' ? 'var(--card-border)' : undefined
                }}
              >
                {/* Accent top edge pill */}
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span 
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 truncate max-w-[62%] ${branchStyle.bgBadge} ${branchStyle.borderBadge}`}
                      style={{ color: branchStyle.color }}
                      title={course.branchName}
                    >
                      <span>{branchStyle.icon}</span>
                      <span className="truncate">{branchStyle.shortLabel}</span>
                    </span>

                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${costBadge.bg}`}>
                      {costBadge.label}
                    </span>
                  </div>

                  {/* Institution / Provider */}
                  <div className="text-[10px] font-mono text-[var(--text-muted)] truncate mb-1">
                    {course.provider}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xs sm:text-[13px] font-black text-[var(--text-primary)] leading-snug line-clamp-2 min-h-[36px] group-hover:text-cyan-500 transition-colors">
                    {course.title}
                  </h3>

                  {/* Market Gap Flag (if applicable) */}
                  {course.isMarketGap && (
                    <div className="mt-1.5 mb-1.5">
                      <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/25 px-1.5 py-0.5 rounded flex items-center gap-1 truncate">
                        <span>⚡</span>
                        <span className="truncate">Brecha: {course.gapName || 'Detectada en Mercado'}</span>
                      </span>
                    </div>
                  )}

                  {/* Duration & Difficulty */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] mt-1.5 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{course.durationHours}h</span>
                    </span>
                    <span>•</span>
                    <span className="uppercase">
                      {course.difficulty === 'BEGINNER' ? 'Inicial' : course.difficulty === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span>•</span>
                    <span>{course.languages.join('/')}</span>
                  </div>

                  {/* Syllabus concise description */}
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 min-h-[48px] mb-2.5">
                    {course.syllabusSummary}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skillsLearned.slice(0, 3).map((s, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-[var(--text-secondary)]"
                      >
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Strip: Segmented Status Buttons + Direct Link */}
                <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 space-y-2">
                  
                  {/* Status Toggle Segmented Bar */}
                  <div className="flex items-center p-0.5 rounded-lg bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[9.5px] font-mono">
                    <button
                      onClick={() => handleUpdateStatus(course.id, 'AVAILABLE', 0)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                        currentStatus === 'AVAILABLE'
                          ? 'bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Marcar como pendiente/disponible"
                    >
                      Por Hacer
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(course.id, 'IN_PROGRESS', userProg.progressPercent || 35)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                        currentStatus === 'IN_PROGRESS'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Marcar como en curso"
                    >
                      En Curso
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(course.id, 'COMPLETED', 100)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold flex items-center justify-center gap-0.5 ${
                        currentStatus === 'COMPLETED'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Marcar como completado/certificado"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>Hecho</span>
                    </button>
                  </div>

                  {/* Progress slider if IN_PROGRESS */}
                  {currentStatus === 'IN_PROGRESS' && (
                    <div className="px-1 py-0.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-500 font-bold mb-1">
                        <span>Avance:</span>
                        <span>{userProg.progressPercent || 35}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={userProg.progressPercent || 35}
                        onChange={(e) => handleUpdateStatus(course.id, 'IN_PROGRESS', parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-black/10 dark:bg-white/10 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Direct Link button */}
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-[9.5px] font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>+{course.xpValue} XP</span>
                    </span>

                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10.5px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer group"
                      title={`Abrir página oficial de ${course.provider}`}
                    >
                      <span>Acceder</span>
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
