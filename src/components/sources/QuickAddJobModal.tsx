import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Building2, 
  Link as LinkIcon, 
  MapPin, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Kanban
} from 'lucide-react';
import type { JobSource } from '../../types/sources';
import type { JobOffer } from '../../types/offers';
import type { ApplicationItem } from '../../types/applications';
import { getStoredOffers, saveStoredOffers, getStoredApplications, saveStoredApplications, getStoredProfile } from '../../services/db';
import { calculateMatchScore } from '../../services/matchEngine';

interface QuickAddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSource?: JobSource | null;
  onJobAdded?: (newOffer: JobOffer) => void;
}

export const QuickAddJobModal: React.FC<QuickAddJobModalProps> = ({
  isOpen,
  onClose,
  defaultSource,
  onJobAdded
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [addToKanban, setAddToKanban] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultSource) {
      setCompany(defaultSource.name.replace(/\s*\(.*\)/, ''));
      setLocation(defaultSource.countryFocus || 'Euskadi / España');
      setUrl('');
      setTitle('');
      setDeadline('');
      setSalary('');
      setDescription('');
      setError(null);
      setIsSuccess(false);
    }
  }, [defaultSource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedCompany = company.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedCompany || !trimmedUrl) {
      setError('Por favor completa el título de la oferta, la entidad y la URL de la convocatoria.');
      return;
    }

    try {
      const parsed = new URL(trimmedUrl);
      if (parsed.pathname === '/' || parsed.pathname === '') {
        setError('Por favor introduce la URL directa a la vacante específica, no la portada general.');
        return;
      }
    } catch {
      setError('La URL introducida no es válida. Debe comenzar por https://');
      return;
    }

    const offerId = `manual-offer-${Date.now()}`;
    const profile = getStoredProfile();

    const isBilbao = location.toLowerCase().includes('bilbao') || location.toLowerCase().includes('bizkaia') || location.toLowerCase().includes('euskadi');
    const calculatedBreakdown = calculateMatchScore({
      title: trimmedTitle,
      company: trimmedCompany,
      location: location.trim() || 'No especificada',
      isBilbaoLocation: isBilbao,
      rawDescription: description.trim(),
      requirements: ['Consultar bases oficiales']
    }, profile);

    const newOffer: JobOffer = {
      id: offerId,
      title: trimmedTitle,
      company: trimmedCompany,
      location: location.trim() || 'No especificada',
      country: location.toLowerCase().includes('alemania') ? 'Alemania' : 'España',
      isBilbaoLocation: isBilbao,
      isRemote: location.toLowerCase().includes('remoto'),
      url: trimmedUrl,
      sourceId: defaultSource?.id || 'manual-scout',
      sourceName: defaultSource?.name || 'Búsqueda Manual Directa',
      publishedDate: new Date().toISOString().split('T')[0],
      deadline: deadline || 'Consultar convocatoria',
      rawDescription: description.trim() || `Vacante descubierta en el portal oficial de ${trimmedCompany}.`,
      requirements: ['Consultar bases oficiales'],
      responsibilities: ['Consultar bases oficiales'],
      status: 'Nueva',
      extractedAt: new Date().toISOString(),
      isVerified: true,
      verificationStatus: 'Vigente y Verificada',
      verifiedAt: new Date().toISOString(),
      verificationReason: `Registrada manualmente por el usuario tras comprobación directa en ${trimmedCompany}.`,
      matchScore: calculatedBreakdown
    };

    // 1. Save to Offers store
    const existingOffers = getStoredOffers();
    const updatedOffers = [newOffer, ...existingOffers.filter(o => o.url !== trimmedUrl)];
    saveStoredOffers(updatedOffers);

    // 2. Add to Applications Kanban if requested
    if (addToKanban) {
      const existingApps = getStoredApplications();
      const newApp: ApplicationItem = {
        id: `CAND-${Date.now().toString().slice(-6)}`,
        offerId: newOffer.id,
        offerTitle: newOffer.title,
        companyName: newOffer.company,
        location: newOffer.location,
        currentStage: 1,
        status: 'En Progreso',
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        humanApprovalGranted: false,
        offerUrl: newOffer.url,
        formDraft: {
          url: newOffer.url,
          deadline: newOffer.deadline || '',
          notes: description.trim()
        },
        history: [
          {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            stage: 1,
            title: 'Vacante Registrada Manualmente',
            note: `Registrada desde el Radar Institucional (${newOffer.company}).`,
            actor: 'Usuario'
          }
        ]
      };
      saveStoredApplications([newApp, ...existingApps]);
    }

    if (onJobAdded) {
      onJobAdded(newOffer);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registrar Vacante Descubierta</h3>
              <p className="text-xs text-slate-400">
                Añade una convocatoria verificada tras tu búsqueda manual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>¡Vacante registrada con éxito! Añadida a tus ofertas{addToKanban ? ' y al tablero de postulaciones' : ''}.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Título Oficial de la Vacante *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Investigador/a Postdoctoral en Dinámica de Suelos y Carbono"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entidad / Institución *</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Ej: BC3, Tecnalia, Thünen-Institut..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Ubicación</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ej: Bilbao / Leioa (Euskadi) o Braunschweig"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>URL Canónica Directa de la Convocatoria *</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://... (enlace específico a las bases de la plaza, no a la portada)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Pega el enlace directo a la oferta para que el botón de apertura oficial sea siempre certero.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Fecha Límite (Deadline)</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-purple-400" />
                <span>Salario / Escala (Opcional)</span>
              </label>
              <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="Ej: TVöD E13, 38.000€ - 44.000€"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Notas / Requisitos Relevantes
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Breve resumen de tareas, requisitos principales (ej: manejo de R, Eddy Covariance, inglés C1)..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-slate-200">Añadir al Tablero de Postulaciones</p>
                <p className="text-[10px] text-slate-400">Crea una tarjeta activa en Fase 1 (Revisión de Oferta)</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={addToKanban}
              onChange={e => setAddToKanban(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Vacante Verificada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
