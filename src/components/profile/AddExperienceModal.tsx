import React, { useState } from 'react';
import { Briefcase, X } from 'lucide-react';
import type { WorkExperience } from '../../types/profile';

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExperience: (exp: WorkExperience) => void;
}

export const AddExperienceModal: React.FC<AddExperienceModalProps> = ({ isOpen, onClose, onAddExperience }) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Bilbao, Bizkaia');
  const [startDate, setStartDate] = useState('2022-01');
  const [endDate, setEndDate] = useState('Presente');
  const [isCurrent, setIsCurrent] = useState(true);
  const [summary, setSummary] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('React 18, TypeScript, Tailwind CSS');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !company) return;

    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company,
      role,
      location,
      startDate,
      endDate: isCurrent ? 'Presente' : endDate,
      isCurrent,
      summary,
      achievements: [],
      technologies: technologiesInput.split(',').map(t => t.trim()).filter(Boolean),
      isVerified: true
    };

    onAddExperience(newExp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base">Ingresar Nueva Experiencia Laboral</h3>
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
              placeholder="Ej. Senior Frontend Developer"
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
              placeholder="Ej. Bilbao Tech Systems"
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
                placeholder="Bilbao, Bizkaia"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300">Fecha Inicio</label>
              <input
                type="text"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="2022-01"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCurrent"
              checked={isCurrent}
              onChange={e => setIsCurrent(e.target.checked)}
              className="rounded bg-emerald-950 border-emerald-800 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isCurrent" className="text-emerald-300 cursor-pointer font-medium">Trabajo actualmente en este puesto</label>
          </div>

          {!isCurrent && (
            <div>
              <label className="font-medium text-slate-300">Fecha Fin</label>
              <input
                type="text"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="2024-05"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div>
            <label className="font-medium text-slate-300">Resumen de Responsabilidades</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              placeholder="Descripción de tareas principales..."
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="font-medium text-slate-300">Tecnologías Utilizadas (separadas por coma)</label>
            <input
              type="text"
              value={technologiesInput}
              onChange={e => setTechnologiesInput(e.target.value)}
              placeholder="React 18, TypeScript, Vite"
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
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold rounded-xl shadow transition"
            >
              Guardar Experiencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
