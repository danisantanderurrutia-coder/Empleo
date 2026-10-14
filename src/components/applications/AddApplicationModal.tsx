import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Link as LinkIcon, 
  DollarSign, 
  FileText, 
  PlusCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { ApplicationItem, ApplicationStage } from '../../types/applications';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (newApp: ApplicationItem) => void;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onAddApplication
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Bilbao, Euskadi');
  const [legalRegime, setLegalRegime] = useState<'AufenthG §20' | 'Ley 14 Euskadi' | 'Remoto UE' | 'General'>('Ley 14 Euskadi');
  const [url, setUrl] = useState('');
  const [salary, setSalary] = useState('');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [initialColumn, setInitialColumn] = useState<'radar' | 'prep' | 'sent' | 'interview' | 'done'>('radar');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    let stage: ApplicationStage = 1;
    let status: ApplicationItem['status'] = 'En Progreso';
    let humanApproval = false;

    if (initialColumn === 'radar') {
      stage = 1;
      status = 'En Progreso';
    } else if (initialColumn === 'prep') {
      stage = 3;
      status = 'En Progreso';
    } else if (initialColumn === 'sent') {
      stage = 7;
      status = 'Enviada';
      humanApproval = true;
    } else if (initialColumn === 'interview') {
      stage = 8;
      status = 'Entrevista';
      humanApproval = true;
    } else if (initialColumn === 'done') {
      stage = 9;
      status = 'Oferta Recibida';
      humanApproval = true;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const dateOnly = new Date().toISOString().split('T')[0];
    const newId = `CAND-${Date.now().toString().slice(-6)}`;

    const reqList = requirements
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const newApp: ApplicationItem = {
      id: newId,
      offerId: `manual-${Date.now()}`,
      offerTitle: title.trim(),
      companyName: company.trim(),
      location: location.trim(),
      currentStage: stage,
      status: status,
      createdDate: dateOnly,
      updatedDate: dateOnly,
      offerUrl: url.trim() || undefined,
      humanApprovalGranted: humanApproval,
      approvalTimestamp: humanApproval ? timestamp : undefined,
      adaptedCvSummary: reqList.length > 0 ? reqList : undefined,
      interviewNotes: notes.trim() || (salary.trim() ? `Compensación estimada: ${salary.trim()}` : undefined),
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp,
          stage,
          title: `Candidatura agregada manualmente en Locker (${legalRegime})`,
          note: notes.trim() || `Puesto: ${title.trim()} en ${company.trim()}`,
          actor: 'Usuario'
        }
      ]
    };

    onAddApplication(newApp);
    onClose();
    // Reset form
    setTitle('');
    setCompany('');
    setLocation('Bilbao, Euskadi');
    setUrl('');
    setSalary('');
    setRequirements('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-[#0b1220] max-w-2xl w-full rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#080d19] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/40">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono font-black text-white text-base tracking-tight uppercase">
                  AÑADIR NUEVA OFERTA // REGISTRO MANUAL
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600 font-extrabold">
                  LOCKER
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Registra cualquier vacante detectada en LinkedIn, portales externos o contacto directo.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
          
          {/* Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <FileText className="h-3.5 w-3.5 text-red-500" />
                <span>Cargo / Puesto de Trabajo *</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ej: Senior Climatology Researcher"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <Building2 className="h-3.5 w-3.5 text-red-500" />
                <span>Empresa / Centro de I+D *</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="ej: BC3 / Tecnalia / GFZ Potsdam"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
              />
            </div>
          </div>

          {/* Location & Quick Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between uppercase">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
                <span>Ubicación *</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Presets tácticos</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="ej: Bilbao, Bizkaia / Kiel, Alemania"
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => { setLocation('Bilbao, Bizkaia (Euskadi)'); setLegalRegime('Ley 14 Euskadi'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
              >
                📍 Bilbao / Bizkaia
              </button>
              <button
                type="button"
                onClick={() => { setLocation('Donostia / San Sebastián'); setLegalRegime('Ley 14 Euskadi'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
              >
                📍 Donostia
              </button>
              <button
                type="button"
                onClick={() => { setLocation('Kiel / Berlín, Alemania'); setLegalRegime('AufenthG §20'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 hover:border-sky-500 transition cursor-pointer"
              >
                🇩🇪 Alemania / DACH
              </button>
              <button
                type="button"
                onClick={() => { setLocation('100% Remoto UE'); setLegalRegime('Remoto UE'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 hover:border-amber-500 transition cursor-pointer"
              >
                🌐 100% Remoto UE
              </button>
            </div>
          </div>

          {/* Legal / Visa Clearance & Initial Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
                <span>Régimen Legal / Visado</span>
              </label>
              <select
                value={legalRegime}
                onChange={e => setLegalRegime(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500 font-sans text-xs cursor-pointer"
              >
                <option value="Ley 14 Euskadi">🇪🇸 Ley 14/2013 Residencia Euskadi / UGE</option>
                <option value="AufenthG §20">🇩🇪 AufenthG §20 Investigador (Alemania/DACH)</option>
                <option value="Remoto UE">🌐 Remoto UE (Contrato o Facturación)</option>
                <option value="General">🌍 Régimen General / Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="h-3.5 w-3.5 text-red-500" />
                <span>Columna Inicial en Locker</span>
              </label>
              <select
                value={initialColumn}
                onChange={e => setInitialColumn(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500 font-sans text-xs cursor-pointer"
              >
                <option value="radar">📌 1. Guardada en Radar // Interceptada</option>
                <option value="prep">⚡ 2. Preparación // Cartas & Dossier</option>
                <option value="sent">🚀 3. Postulada // Enviada Oficialmente</option>
                <option value="interview">🎯 4. Entrevista en Curso</option>
                <option value="done">🏁 5. Concluida // Histórico Final</option>
              </select>
            </div>
          </div>

          {/* URL & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <LinkIcon className="h-3.5 w-3.5 text-red-500" />
                <span>Enlace Web de la Oferta</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
                <DollarSign className="h-3.5 w-3.5 text-red-500" />
                <span>Rango Salarial / Compensación</span>
              </label>
              <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="ej: €45.000 - €55.000 / TV-L E13"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
              />
            </div>
          </div>

          {/* Requirements / Tags */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase">
              Requisitos Clave / Tecnologías (separados por comas)
            </label>
            <input
              type="text"
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              placeholder="ej: Python, QGIS, Gobernanza Ambiental, R, GEE"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs"
            />
          </div>

          {/* Strategic Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase">
              Notas Tácticas / Contacto Clave / Observaciones
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Detalles de la convocatoria, contacto en la institución o fecha límite..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans text-xs resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs shadow-lg hover:shadow-red-500/30 transition flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Guardar en Locker</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
