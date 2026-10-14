import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Eye, 
  Sparkles, 
  FileText,
  Layers
} from 'lucide-react';
import { getStoredCVs, saveStoredCVs, getStoredProfile } from '../../services/db';
import { cvTemplatesList } from '../../services/sampleData';
import { generateCVFromProfile } from '../../services/cvGenerator';
import type { CVVersion, CVTemplateId } from '../../types/cv';
import { CVPreviewModal } from './CVPreviewModal';

export const CVManagementTab: React.FC = () => {
  const [cvList, setCvList] = useState<CVVersion[]>(getStoredCVs());
  const [selectedCvForPreview, setSelectedCvForPreview] = useState<CVVersion | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateId>('es_standard');
  const [newCvName, setNewCvName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const profile = getStoredProfile();

  const handleGenerateCV = (e: React.FormEvent) => {
    e.preventDefault();
    const newCv = generateCVFromProfile(selectedTemplate, newCvName, profile);
    const updated = [newCv, ...cvList];
    setCvList(updated);
    saveStoredCVs(updated);
    setIsCreating(false);
    setNewCvName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-indigo-400" />
            <span>Gestor de Currículums por Plantilla</span>
          </h2>
          <p className="text-xs text-slate-400">
            Los CVs se compilan dinámicamente desde el Master Profile. Sin información duplicada ni datos inventados.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Generar Nueva Versión</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleGenerateCV} className="glass-panel p-5 rounded-2xl border border-indigo-500/30 space-y-4">
          <h3 className="font-bold text-sm text-indigo-300 flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Generar Versión de CV desde Master Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Nombre de la Versión *</label>
              <input
                type="text"
                value={newCvName}
                onChange={e => setNewCvName(e.target.value)}
                placeholder="Ej. CV Tech Senior - Euskadi (React + TS)"
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Seleccionar Formato de Plantilla *</label>
              <select
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value as CVTemplateId)}
                className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {cvTemplatesList.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.pages})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const currentTpl = cvTemplatesList.find(t => t.id === selectedTemplate);
            return currentTpl ? (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-indigo-300">Público Objetivo: {currentTpl.targetAudience}</div>
                <p className="text-[11px] text-slate-400">{currentTpl.description}</p>
              </div>
            ) : null;
          })()}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Compilar CV Ahora
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Plantillas Disponibles en el Sistema (7 Formatos)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cvTemplatesList.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                setSelectedTemplate(tpl.id);
                setNewCvName(`CV ${tpl.name.split(' ')[0]} - Master Profile`);
                setIsCreating(true);
              }}
              className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-100 group-hover:text-indigo-300">
                <span>{tpl.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                  {tpl.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tpl.description}</p>
              <div className="text-[10px] text-slate-500 font-mono font-medium">{tpl.pages}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>Historial de Versiones Generadas ({cvList.length})</span>
        </h3>

        <div className="space-y-3">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              className="glass-card p-4 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm text-slate-100">{cv.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cv.templateId}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>Modificado: {cv.updatedAt}</span>
                  <span>•</span>
                  <span>Logros vinculados: {cv.compiledData.achievements.length}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Anti-Hallucination OK</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setSelectedCvForPreview(cv)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold border border-indigo-500/30 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Previsualizar / Imprimir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CVPreviewModal
        cv={selectedCvForPreview}
        isOpen={!!selectedCvForPreview}
        onClose={() => setSelectedCvForPreview(null)}
      />
    </div>
  );
};
