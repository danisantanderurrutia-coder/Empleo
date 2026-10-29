import React, { useState } from 'react';
import type { JobOffer } from '../../types/offers';
import type { JobDossier } from '../../types/intelligence';
import { saveDossierFromForm } from '../../services/jobWingmanService';

interface WingmanEditorProps {
  offer: JobOffer;
  dossier: JobDossier;
  onSaved: () => void;
  onCancel: () => void;
}

const lines = (t: string) => t.split('\n').map(l => l.trim()).filter(Boolean);
const input = 'w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-500';
const label = 'block text-[11px] font-semibold text-slate-400 mb-1';

export const WingmanEditor: React.FC<WingmanEditorProps> = ({ offer, dossier, onSaved, onCancel }) => {
  const lead = dossier.leadProfile;
  const [f, setF] = useState({
    leadName: lead.name,
    honorific: lead.titleHonorific || '',
    role: lead.role,
    institution: lead.institution || offer.company,
    email: lead.email || '',
    researchFocus: (lead.researchFocus || []).join('\n'),
    styleNotes: lead.styleNotes || '',
    projectTitle: dossier.projectTitle,
    painPoints: dossier.projectPainPoints.join('\n'),
    hooks: dossier.technicalHooks.join('\n'),
    questionDe: '',
    questionEn: ''
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.leadName.trim()) return;
    saveDossierFromForm(offer, {
      leadName: f.leadName,
      honorific: f.honorific,
      role: f.role,
      institution: f.institution,
      email: f.email,
      researchFocus: lines(f.researchFocus),
      styleNotes: f.styleNotes,
      projectTitle: f.projectTitle,
      painPoints: lines(f.painPoints),
      hooks: lines(f.hooks),
      questionDe: f.questionDe,
      questionEn: f.questionEn
    });
    onSaved();
  };

  return (
    <form onSubmit={submit} className="p-4 rounded-xl bg-slate-900 border border-sky-500/40 space-y-3">
      <div className="font-bold text-sky-300 text-sm">Datos del Decisor / Investigador Principal y Retos del Proyecto</div>
      <p className="text-slate-400">Un elemento por línea en las listas. Solo se guarda en tu navegador.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><span className={label}>Título (Prof. Dr.)</span><input className={input} value={f.honorific} onChange={set('honorific')} /></div>
        <div className="md:col-span-2"><span className={label}>Nombre *</span><input className={input} value={f.leadName} onChange={set('leadName')} required /></div>
        <div><span className={label}>Rol</span><input className={input} value={f.role} onChange={set('role')} /></div>
        <div><span className={label}>Institución</span><input className={input} value={f.institution} onChange={set('institution')} /></div>
        <div><span className={label}>Email</span><input className={input} type="email" value={f.email} onChange={set('email')} /></div>
      </div>
      <div><span className={label}>Proyecto</span><input className={input} value={f.projectTitle} onChange={set('projectTitle')} /></div>
      <div><span className={label}>Líneas científicas / publicaciones clave del supervisor</span><textarea className={input} rows={3} value={f.researchFocus} onChange={set('researchFocus')} /></div>
      <div><span className={label}>Notas de estilo (qué valora, tono)</span><textarea className={input} rows={2} value={f.styleNotes} onChange={set('styleNotes')} /></div>
      <div><span className={label}>Retos / dolores del proyecto</span><textarea className={input} rows={3} value={f.painPoints} onChange={set('painPoints')} /></div>
      <div><span className={label}>Tus ganchos técnicos (solo hechos verificables)</span><textarea className={input} rows={3} value={f.hooks} onChange={set('hooks')} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><span className={label}>Pregunta técnica para el email (DE), opcional</span><textarea className={input} rows={3} value={f.questionDe} onChange={set('questionDe')} /></div>
        <div><span className={label}>Pregunta técnica para el email (EN), opcional</span><textarea className={input} rows={3} value={f.questionEn} onChange={set('questionEn')} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer">Cancelar</button>
        <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl cursor-pointer">Guardar datos del decisor</button>
      </div>
    </form>
  );
};
