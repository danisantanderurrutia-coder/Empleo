import React, { useState } from 'react';
import { Trophy, Plus, Tag, CheckCircle2, ShieldAlert, Trash2, Edit3, Save, X } from 'lucide-react';
import type { Achievement } from '../../types/profile';

interface AchievementBankProps {
  achievements: Achievement[];
  onAddAchievement: (newAch: Achievement) => void;
  onDeleteAchievement: (id: string) => void;
  onUpdateAchievement?: (updatedAch: Achievement) => void;
}

export const AchievementBank: React.FC<AchievementBankProps> = ({
  achievements,
  onAddAchievement,
  onDeleteAchievement,
  onUpdateAchievement
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Achievement state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Editing state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMetrics, setEditMetrics] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');

  const handleStartEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setEditTitle(ach.title || '');
    setEditDescription(ach.description || '');
    setEditMetrics(ach.metrics || '');
    setEditTagsInput((ach.tags || []).join(', '));
  };

  const handleSaveEdit = (ach: Achievement) => {
    if (!onUpdateAchievement) return;
    const updated: Achievement = {
      ...ach,
      title: editTitle,
      description: editDescription,
      metrics: editMetrics,
      tags: editTagsInput.split(',').map(t => t.trim()).filter(Boolean)
    };
    onUpdateAchievement(updated);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !metrics) return;

    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      title,
      description,
      metrics,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toISOString().split('T')[0],
      isVerified: true
    };

    onAddAchievement(newAch);
    setTitle('');
    setDescription('');
    setMetrics('');
    setTagsInput('');
    setIsAdding(false);
  };

  return (
    <div 
      className="p-5 rounded-2xl border shadow-sm space-y-4"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-base">Banco de Logros Reutilizable</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Metas cuantificables con métricas verificadas. Puedes editarlas o añadir nuevas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Añadir Logro</span>
        </button>
      </div>

      {isAdding && (
        <form 
          onSubmit={handleSave} 
          className="p-4 rounded-xl border border-amber-500/30 space-y-3"
          style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
        >
          <h4 className="font-semibold text-xs text-amber-600 dark:text-amber-300">Nuevo Logro Cuantificable</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)]">Título del Logro *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Publicación en ElDesconcierto / Reducción FCP 42%"
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-amber-400"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary)]">Métrica Impacto *</label>
              <input
                type="text"
                value={metrics}
                onChange={e => setMetrics(e.target.value)}
                placeholder="Ej. 7 Publicaciones / 8 Ponencias"
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-amber-400 font-semibold"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Descripción detallada</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Detalla el logro..."
              className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Etiquetas (separadas por coma)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Investigación, Gobernanza, Internacional"
              className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-amber-400"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
            >
              Guardar Logro
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {achievements.map((ach) => {
          const isEditing = editingId === ach.id;

          if (isEditing) {
            return (
              <div 
                key={ach.id} 
                className="p-4 rounded-xl border border-amber-500/40 space-y-2"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-300">Editando Logro</span>
                  <button onClick={() => setEditingId(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Título"
                  className="w-full px-2.5 py-1 border rounded text-xs focus:outline-none focus:border-amber-400"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />

                <input
                  type="text"
                  value={editMetrics}
                  onChange={e => setEditMetrics(e.target.value)}
                  placeholder="Métrica"
                  className="w-full px-2.5 py-1 border rounded text-xs text-amber-600 dark:text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                />

                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={2}
                  placeholder="Descripción"
                  className="w-full px-2.5 py-1 border rounded text-xs focus:outline-none focus:border-amber-400"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />

                <input
                  type="text"
                  value={editTagsInput}
                  onChange={e => setEditTagsInput(e.target.value)}
                  placeholder="Etiquetas (coma)"
                  className="w-full px-2.5 py-1 border rounded text-xs focus:outline-none focus:border-amber-400"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => handleSaveEdit(ach)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded shadow flex items-center space-x-1"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={ach.id}
              className="p-4 rounded-xl border space-y-2 relative group hover:border-amber-500/40 transition"
              style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-xs text-[var(--text-primary)]">{ach.title}</h4>
                    {ach.isVerified ? (
                      <span title="Verificado sin alucinación">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </span>
                    ) : (
                      <span title="Pendiente de verificación">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">{ach.metrics}</div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(ach)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-200 transition p-1"
                    title="Editar logro allí mismo"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteAchievement(ach.id)}
                    className="text-[var(--text-muted)] hover:text-rose-500 transition p-1"
                    title="Eliminar logro"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ach.description}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {ach.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1 border border-emerald-500/20 font-medium"
                  >
                    <Tag className="h-2.5 w-2.5 text-emerald-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
