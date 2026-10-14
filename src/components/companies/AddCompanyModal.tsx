import React, { useState } from 'react';
import { Building2, X, Globe, MapPin, ShieldCheck, Cpu } from 'lucide-react';
import { getStoredCompanies, saveStoredCompanies } from '../../services/db';
import { researchCompanyWithAntigravity } from '../../services/antigravityEngine';
import type { CompanyDossier } from '../../types/companies';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyAdded: (newComp: CompanyDossier) => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onCompanyAdded }) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('Tecnología, I+D & Sostenibilidad');
  const [headquarters, setHeadquarters] = useState('Bilbao, Bizkaia');
  const [description, setDescription] = useState('');
  const [isResearching, setIsResearching] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsResearching(true);

    setTimeout(() => {
      const newComp = researchCompanyWithAntigravity(name, website);

      if (sector) newComp.sector = sector;
      if (headquarters) newComp.headquarters = headquarters;
      if (description) newComp.description = description;

      const existing = getStoredCompanies();
      saveStoredCompanies([newComp, ...existing]);

      setIsResearching(false);
      onCompanyAdded(newComp);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Agregar Empresa</h3>
              <p className="text-xs text-emerald-400">Se creará una ficha vacía que completas tú.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-300">Nombre de la Empresa *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. Tecnalia / Sener / Iberdrola Innovation"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <div>
            <label className="font-medium text-emerald-300 flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-emerald-400" /> Sitio Web Corporativo
            </label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://www.empresa.com"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-300">Sector</label>
              <input
                type="text"
                value={sector}
                onChange={e => setSector(e.target.value)}
                placeholder="Tecnología, I+D & Sostenibilidad"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-400" /> Sede Principal
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={e => setHeadquarters(e.target.value)}
                placeholder="Bilbao, Bizkaia"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-300">Descripción & Breve Resumen</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Descripción corporativa o notas de interés..."
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>La empresa quedará guardada en el directorio para generar reportes y alertas de empleo.</span>
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
              disabled={isResearching}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Cpu className="h-4 w-4" />
              <span>{isResearching ? 'Guardando...' : 'Crear ficha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
