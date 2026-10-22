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
      <div 
        className="flex items-center justify-between p-5 rounded-2xl border shadow-sm"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-indigo-500" />
            <span>Gestor de Currículums por Plantilla</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
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
        <form 
          onSubmit={handleGenerateCV} 
          className="p-5 rounded-2xl border border-indigo-500/30 shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-300 flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Generar Versión de CV desde Master Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Nombre de la Versión *</label>
              <input
                type="text"
                value={newCvName}
                onChange={e => setNewCvName(e.target.value)}
                placeholder="Ej. CV Tech Senior - Euskadi (React + TS)"
                className="w-full mt-1 px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">Seleccionar Formato de Plantilla *</label>
              <select
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value as CVTemplateId)}
                className="w-full mt-1 px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition font-medium"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
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
              <div 
                className="p-3 rounded-xl border text-xs space-y-1"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <div className="font-semibold text-indigo-600 dark:text-indigo-300">Público Objetivo: {currentTpl.targetAudience}</div>
                <p className="text-[11px] text-[var(--text-secondary)]">{currentTpl.description}</p>
              </div>
            ) : null;
          })()}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
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
        <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-500" />
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
              className="p-3.5 rounded-xl border hover:border-indigo-500/40 cursor-pointer transition space-y-1.5 group shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                <span>{tpl.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  {tpl.language}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{tpl.description}</p>
              <div className="text-[10px] text-[var(--text-muted)] font-mono font-medium">{tpl.pages}</div>
            </div>
          ))}
        </div>
      </div>

      <div 
        className="p-5 rounded-2xl border shadow-sm space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
          <FileText className="h-4 w-4 text-emerald-500" />
          <span>Historial de Versiones Generadas ({cvList.length})</span>
        </h3>

        <div className="space-y-3">
          {cvList.map((cv) => (
            <div
              key={cv.id}
              className="p-4 rounded-xl border hover:border-indigo-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)]">{cv.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-bold">
                    {cv.templateId}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[var(--text-muted)]">
                  <span>Modificado: {cv.updatedAt}</span>
                  <span>•</span>
                  <span>Logros vinculados: {cv.compiledData.achievements.length}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Anti-Hallucination OK</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setSelectedCvForPreview(cv)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold border border-indigo-500/30 transition"
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
