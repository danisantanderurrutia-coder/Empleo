import React, { useState } from 'react';
import { Globe2, X, Cpu } from 'lucide-react';
import type { JobSource, SourceType, PriorityLevel, SyncFrequency } from '../../types/sources';
import { scoutSourceWithAntigravity } from '../../services/antigravityEngine';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: JobSource) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({ isOpen, onClose, onAddSource }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<SourceType>('ngo');
  const [priority, setPriority] = useState<PriorityLevel>('Alta');
  const [frequency, setFrequency] = useState<SyncFrequency>('Diario');
  const [notes, setNotes] = useState('Filtro de vacantes para UNEP, Gobernanza Ambiental, R/GIS y Cambio Climático');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setIsScanning(true);

    setTimeout(() => {
      // Auto-scout URL immediately with Antigravity AI Engine
      const scoutRes = scoutSourceWithAntigravity(url, name);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const newSource: JobSource = {
        id: `src-${Date.now()}`,
        name,
        url,
        type,
        priority,
        frequency,
        status: 'Activo',
        lastScraped: timestamp,
        offersExtracted: scoutRes.totalSourceOffersCount,
        notes
      };

      setIsScanning(false);
      onAddSource(newSource);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <Globe2 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base">Añadir Fuente</h3>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-300">Nombre de la Fuente *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. UNEP Jobs Portal / Lanbide / Tecnalia"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div>
            <label className="font-medium text-emerald-300 flex items-center gap-1">
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" /> URL del Portal / Búsqueda *
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://unjobs.org/organizations/unep"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-medium text-slate-300">Tipo de Fuente</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as SourceType)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="ngo">ONG / Internacional (UNEP)</option>
                <option value="linkedin">LinkedIn</option>
                <option value="eures">EURES UE</option>
                <option value="job_board">Job Board</option>
                <option value="company_portal">Empresa Directa</option>
                <option value="research_center">Centro de I+D</option>
                <option value="university">Universidad</option>
                <option value="public_admin">Adm. Pública</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-300">Prioridad</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-300">Frecuencia</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as SyncFrequency)}
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Diario">Diario</option>
                <option value="Cada 2 días">Cada 2 días</option>
                <option value="Semanal">Semanal</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-300">Notas & Filtros de Búsqueda</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Filtro para puestos en UNEP, Gobernanza Ambiental, R, GIS, Clima..."
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
              disabled={isScanning}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Cpu className="h-4 w-4" />
              <span>{isScanning ? 'Guardando...' : 'Añadir Fuente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
