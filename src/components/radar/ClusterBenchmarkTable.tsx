import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Globe2, 
  Zap, 
  Building2, 
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import type { CompanySectorCluster, QuadrantType } from '../../types/companies';
import { BENCHMARK_DATA, type BenchmarkClusterRow } from '../../data/benchmarkCatalog';

interface ClusterBenchmarkTableProps {
  onSelectClusterFilter?: (cluster: CompanySectorCluster, quadrant: QuadrantType) => void;
}

export const ClusterBenchmarkTable: React.FC<ClusterBenchmarkTableProps> = ({ onSelectClusterFilter }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'3m' | '6m'>('3m');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('bench-dach-rd');

  const filteredData = BENCHMARK_DATA.filter(row => {
    if (tierFilter === 'ALL') return true;
    return row.tier.includes(tierFilter);
  });

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
    if (score >= 50) return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50';
    if (score >= 35) return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
    return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
  };

  const getTierBadge = (tier: BenchmarkClusterRow['tier']) => {
    if (tier.startsWith('TIER 1')) return 'bg-emerald-900/60 text-emerald-300 border-emerald-600/70';
    if (tier.startsWith('TIER 2')) return 'bg-cyan-900/60 text-cyan-300 border-cyan-600/70';
    if (tier.startsWith('TIER 3')) return 'bg-amber-900/60 text-amber-300 border-amber-600/70';
    return 'bg-rose-950/70 text-rose-300 border-rose-700/60';
  };

  const getVisaColor = (friction: BenchmarkClusterRow['visaFriction']) => {
    switch (friction) {
      case 'Nula':
      case 'Baja': return 'text-emerald-400 font-bold';
      case 'Media': return 'text-amber-400';
      case 'Alta':
      case 'Extrema': return 'text-rose-400 font-bold';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Executive Strategic Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-700/80 shadow-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="h-5 w-5" />
              </span>
              <h2 className="text-base font-black text-white font-mono uppercase tracking-tight">
                MATRIZ DE PROBABILIDAD REAL // HORIZONTE 3 A 6 MESES
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Ponderación algorítmica de tus opciones de empleo basada en tus <strong className="text-white">variables personales objetivas</strong>: nacionalidad chilena, convenio español de 2 años, visado de graduado alemán de 18m (§ 20 AufenthG), tesis en Eddy Covariance y turberas, e idiomas (EN C2 Bilingüe, DE B1, ES Nativo).
            </p>
          </div>

          {/* Horizon Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 shadow-inner">
            <button
              onClick={() => setSelectedHorizon('3m')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                selectedHorizon === '3m'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>VENTANA 3 MESES (URGENTE)</span>
            </button>
            <button
              onClick={() => setSelectedHorizon('6m')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                selectedHorizon === '6m'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>VENTANA 6 MESES (CONSOLIDADA)</span>
            </button>
          </div>
        </div>

        {/* 5 Weighted Variables Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">1. Visado / Traba (25%)</span>
            <span className="text-emerald-400 font-bold">DE §20 / ES 2a</span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">2. Ajuste Técnico (25%)</span>
            <span className="text-cyan-400 font-bold">Eddy Cov. / Suelos</span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">3. Velocidad Ciclo (20%)</span>
            <span className="text-amber-400 font-bold">Privado vs TVöD</span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">4. Idioma Real (15%)</span>
            <span className="text-indigo-400 font-bold">EN C2 / DE B1</span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">5. Retorno Ciudadanía (15%)</span>
            <span className="text-purple-400 font-bold">Pasaporte UE</span>
          </div>
        </div>
      </div>

      {/* Filter Chips by Tier */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filtrar Prioridad:
          </span>
          {[
            { id: 'ALL', label: 'Todos los Clústeres (9)' },
            { id: 'TIER 1', label: 'TIER 1 (Inmediato)' },
            { id: 'TIER 2', label: 'TIER 2 (Paralelo)' },
            { id: 'TIER 3', label: 'TIER 3 (Nicho)' },
            { id: 'TIER 4', label: 'TIER 4 (Descarte)' }
          ].map((t) => {
            const active = tierFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  active
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/60 shadow-xs font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Mostrando {filteredData.length} de {BENCHMARK_DATA.length} vectores de postulación
        </span>
      </div>

      {/* Benchmark Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#070b14]/95 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase">
              <th className="p-3.5 font-bold">Ránking & Clúster</th>
              <th className="p-3.5 font-bold">Polo Geográfico</th>
              <th className="p-3.5 font-bold text-center">
                Probabilidad {selectedHorizon === '3m' ? '3 Meses' : '6 Meses'}
              </th>
              <th className="p-3.5 font-bold">Traba Migratoria</th>
              <th className="p-3.5 font-bold">Velocidad Proceso</th>
              <th className="p-3.5 font-bold">Idioma</th>
              <th className="p-3.5 font-bold">Retorno Geopolítico</th>
              <th className="p-3.5 font-bold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredData.map((row, idx) => {
              const score = selectedHorizon === '3m' ? row.prob3m : row.prob6m;
              const isExpanded = expandedId === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    className={`transition cursor-pointer hover:bg-slate-800/40 ${
                      isExpanded ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-400 w-5">#{idx + 1}</span>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{row.clusterName}</span>
                          </div>
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-mono font-bold border mt-0.5 ${getTierBadge(row.tier)}`}>
                            {row.tier}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{row.quadrantName}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`px-3 py-1 rounded-xl font-mono font-black text-sm border shadow-xs ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {selectedHorizon === '3m' ? `6m: ${row.prob6m}%` : `3m: ${row.prob3m}%`}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono">
                      <span className={getVisaColor(row.visaFriction)}>
                        {row.visaFriction}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-400">
                      {row.hiringSpeed}
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {row.languageFit}
                    </td>

                    <td className="p-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 text-[10px] font-bold">
                        {row.strategicReturn}
                      </span>
                    </td>

                    <td className="p-3.5 text-right font-mono">
                      <span className="text-cyan-400 text-xs font-bold hover:underline flex items-center justify-end gap-1">
                        <span>{isExpanded ? 'Ocultar' : 'Detalles'}</span>
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Row with Tactical Diagnosis & Targets */}
                  {isExpanded && (
                    <tr className="bg-slate-900/80 border-b border-slate-700/60">
                      <td colSpan={8} className="p-4.5 space-y-3.5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2 space-y-1.5">
                            <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono flex items-center gap-1.5">
                              <Info className="h-4 w-4" /> Diagnóstico Táctico y Ponderación de Probabilidad
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                              {row.whyScore}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                              <Building2 className="h-4 w-4" /> Organizaciones Clave para Atacar
                            </h4>
                            <div className="flex flex-wrap gap-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                              {row.keyTargets.map((target) => (
                                <span key={target} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[10px] font-mono font-bold">
                                  {target}
                                </span>
                              ))}
                            </div>

                            {onSelectClusterFilter && (
                              <button
                                onClick={() => onSelectClusterFilter(row.cluster, row.quadrant)}
                                className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Zap className="h-3.5 w-3.5" />
                                <span>Ver Empresas de este Clúster en Directorio</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Strategic Takeaway / Action Plan */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Conclusión Táctica Inmediata:</strong> Concentra el 80% de tus postulaciones semanales en <span className="text-emerald-400 font-bold">TIER 1 (DACH I+D, Carbon-Tech Remoto y Euskadi)</span> para asegurar contrato en &lt; 90 días con mínimo riesgo migratorio.
          </span>
        </div>
      </div>
    </div>
  );
};
