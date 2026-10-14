import React, { useState, useEffect } from 'react';
import { X, Building2, Globe2, MapPin, Edit3 } from 'lucide-react';
import type { CompanyDossier } from '../../types/companies';

interface EditCompanyModalProps {
  company: CompanyDossier | null;
  isOpen: boolean;
  onClose: () => void;
  onCompanyUpdated: (updatedCompany: CompanyDossier) => void;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  company,
  isOpen,
  onClose,
  onCompanyUpdated
}) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setWebsite(company.website || '');
      setSector(company.sector || '');
      setHeadquarters(company.headquarters || '');
      setSize(company.size || '');
      setDescription(company.description || '');
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: CompanyDossier = {
      ...company,
      name,
      website,
      sector,
      headquarters,
      size,
      description,
      lastResearched: new Date().toISOString().split('T')[0]
    };

    onCompanyUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col text-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Editar Empresa & URL de Careers</h3>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Nombre de la Empresa / Entidad:</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: BC3 Basque Centre for Climate Change"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>URL Oficial de Empleo / Careers (Dirección Exacta):</span>
            </label>
            <input
              type="url"
              required
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="Ej: https://www.bc3research.org/en/careers/job-offers/"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[11px] text-slate-400 block pt-0.5">
              Esta URL se guarda como referencia; la app no rastrea ofertas automáticamente.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Sector de Actividad:</label>
              <input
                type="text"
                value={sector}
                onChange={e => setSector(e.target.value)}
                placeholder="Ej: Investigación Climática & Gobernanza"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Sede Principal:</span>
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={e => setHeadquarters(e.target.value)}
                placeholder="Ej: Leioa / Bilbao, Bizkaia"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Tamaño / Equipo:</label>
            <input
              type="text"
              value={size}
              onChange={e => setSize(e.target.value)}
              placeholder="Ej: 100+ científicos"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Descripción Resumida:</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve descripción de la entidad y sus áreas prioritarias..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
