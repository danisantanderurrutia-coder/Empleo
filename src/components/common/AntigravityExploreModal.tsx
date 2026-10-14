import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight, Loader2, Cpu, Compass } from 'lucide-react';
import { exploreAndIncorporateWithAntigravity } from '../../services/antigravityEngine';
import type { ExploreResult } from '../../services/antigravityEngine';

interface AntigravityExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'sources' | 'companies' | 'offers' | 'profile';
  onExplorationCompleted: () => void;
}

export const AntigravityExploreModal: React.FC<AntigravityExploreModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'sources',
  onExplorationCompleted
}) => {
  const [promptText, setPromptText] = useState(
    '1. Trabajos en Suiza relacionados a centros de investigación de suelos.\n2. También centros de investigación en Austria en ambiente, suelos y clima.\n3. Greenjobs remotas abiertas a chilenos o en España/Europa.'
  );
  const [category, setCategory] = useState<'sources' | 'companies' | 'offers' | 'profile'>(defaultCategory);
  const [isExploring, setIsExploring] = useState(false);
  const [result, setResult] = useState<ExploreResult | null>(null);

  if (!isOpen) return null;

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsExploring(true);

    setTimeout(() => {
      const res = exploreAndIncorporateWithAntigravity(promptText, category);
      setResult(res);
      setIsExploring(false);
      onExplorationCompleted();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-lime-600 to-amber-500 p-0.5 text-white flex items-center justify-center shadow-lg">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">Explorar (no disponible)</h3>
              <p className="text-xs text-emerald-400">Introduce ideas, países o conceptos libremente para descubrir e incorporar motores de búsqueda, empresas u ofertas.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleExplore} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>¿Qué deseas explorar e incorporar? (Categoría objetivo):</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('sources')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    category === 'sources'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  <span>🌐 Fuentes & Portales</span>
                  <span className="text-[10px] font-normal text-emerald-200">Motores de búsqueda</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('companies')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    category === 'companies'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  <span>🏛️ Empresas & Institutos</span>
                  <span className="text-[10px] font-normal text-emerald-200">Centros de I+D</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('offers')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    category === 'offers'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  <span>💼 Vacantes & Ofertas</span>
                  <span className="text-[10px] font-normal text-emerald-200">Puestos directos</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">
                Describe tus conceptos o ideas libres (puedes enumerar múltiples intenciones):
              </label>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={5}
                placeholder="1. Trabajos en Suiza relacionados a centros de investigación de suelos
2. También en Austria
3. Centros de investigación en ambiente, suelos y clima
4. Greenjobs para remotos a chilenos"
                className="w-full p-3 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white font-sans text-xs leading-relaxed focus:outline-none focus:border-emerald-400 shadow-inner"
                required
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
              <div className="font-semibold text-xs text-white flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Antigravity Engine Semantic Scraper</span>
              </div>
              <p className="text-[11px] text-emerald-300 leading-snug">
                La IA procesará tus conceptos, localizará las entidades e instituciones correspondientes en Suiza, Austria o en remoto, calculando su encaje con tu Master Profile y registrándolas directamente en la plataforma.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-emerald-900/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-emerald-400 hover:text-white font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isExploring || !promptText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
              >
                {isExploring ? (
                  <>
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                    <span>Explorando e Incorporando con IA...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4 text-white" />
                    <span>⚡ Explorar (no disponible)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
              <div className="font-bold text-sm text-white flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Resultado de la exploración</span>
              </div>
              <p className="text-xs leading-relaxed">{result.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Elementos Incorporados a la Plataforma:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {result.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{item.title}</div>
                      <div className="text-emerald-400 text-[11px]">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-emerald-900/60">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-emerald-400 hover:text-white font-medium"
              >
                Explorar otra idea / prompt
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
              >
                <span>Ver Elementos en la Plataforma</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
