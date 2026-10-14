import React, { useState, useEffect } from 'react';
import { Briefcase, X, Save } from 'lucide-react';
import type { WorkExperience } from '../../types/profile';

interface EditExperienceModalProps {
  experience: WorkExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveExperience: (updatedExp: WorkExperience) => void;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSaveExperience
}) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [summary, setSummary] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');

  useEffect(() => {
    if (experience) {
      setRole(experience.role || '');
      setCompany(experience.company || '');
      setLocation(experience.location || '');
      setStartDate(experience.startDate || '');
      setEndDate(experience.endDate || '');
      setIsCurrent(experience.isCurrent || false);
      setSummary(experience.summary || '');
      setTechnologiesInput((experience.technologies || []).join(', '));
    }
  }, [experience]);

  if (!isOpen || !experience) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorkExperience = {
      ...experience,
      role,
      company,
      location,
      startDate,
      endDate: isCurrent ? 'Presente' : endDate,
      isCurrent,
      summary,
      technologies: technologiesInput.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSaveExperience(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base">Editar Experiencia Laboral</h3>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-300">Puesto / Cargo *</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div>
            <label className="font-medium text-slate-300">Empresa *</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-300">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300">Fecha Inicio</label>
              <input
                type="text"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="editIsCurrent"
              checked={isCurrent}
              onChange={e => setIsCurrent(e.target.checked)}
              className="rounded bg-emerald-950 border-emerald-800 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="editIsCurrent" className="text-emerald-300 cursor-pointer font-medium">Trabajo actualmente en este puesto</label>
          </div>

          {!isCurrent && (
            <div>
              <label className="font-medium text-slate-300">Fecha Fin</label>
              <input
                type="text"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div>
            <label className="font-medium text-slate-300">Resumen de Responsabilidades</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="font-medium text-slate-300">Tecnologías / Conceptos (separados por coma)</label>
            <input
              type="text"
              value={technologiesInput}
              onChange={e => setTechnologiesInput(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
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
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
