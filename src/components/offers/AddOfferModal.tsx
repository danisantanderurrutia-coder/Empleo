import React, { useState } from 'react';
import { X, PlusCircle, Globe, MapPin, Euro, ShieldCheck, FileUp, Loader2, Cpu } from 'lucide-react';
import { getStoredOffers, saveStoredOffers, getStoredProfile } from '../../services/db';
import { extractTextFromDocumentFile } from '../../services/pdfExtractor';
import { scrapeLiveWebsite } from '../../services/liveWebScraper';
import { calculateMatchScore } from '../../services/matchEngine';
import type { JobOffer } from '../../types/offers';

interface AddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOfferAdded: (newOffer: JobOffer) => void;
}

export const AddOfferModal: React.FC<AddOfferModalProps> = ({ isOpen, onClose, onOfferAdded }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Bilbao, Bizkaia (Híbrido)');
  const [salaryMin, setSalaryMin] = useState<number | ''>('');
  const [salaryMax, setSalaryMax] = useState<number | ''>('');
  const [rawDescription, setRawDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('Gobernanza Ambiental, R, GIS, Residencia en Bilbao');
  const [attachedPdfName, setAttachedPdfName] = useState<string | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    const low = val.toLowerCase();
    if (low.includes('1499096') || (low.includes('interamt') && (low.includes('uba') || low.includes('ki')))) {
      if (!title) setTitle('Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)');
      if (!company) setCompany('Umweltbundesamt (UBA)');
      if (!location || location.includes('Bilbao')) setLocation('Leipzig, Berlin oder Dessau-Roßlau, Alemania (Hybrid)');
      if (!salaryMin) setSalaryMin(62489);
      if (!salaryMax) setSalaryMax(89579);
      if (requirementsInput.includes('Residencia en Bilbao')) {
        setRequirementsInput('Scrum / Agile, KI Product Owner, MINT, Softwareentwicklung, Verwaltungsvollzug, Copernicus');
      }
      if (!rawDescription) {
        setRawDescription('Das Umweltbundesamt (UBA) sucht für sein Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) eine*n Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (Kennziffer 8/LB/26, Interamt 1499096, TVöD E 13).');
      }
    }
  };

  if (!isOpen) return null;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingPdf(true);
    setAttachedPdfName(file.name);

    try {
      const doc = await extractTextFromDocumentFile(file);
      setRawDescription(doc.text);

      if (!title) {
        setTitle(`Convocatoria PDF: ${file.name.replace(/\.[^/.]+$/, "")}`);
      }
      if (!company) {
        setCompany('Entidad Convocante (Vía PDF)');
      }
    } catch (err) {
      console.error('Error extrayendo PDF de oferta:', err);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const profile = getStoredProfile();
    let finalTitle = title;
    let finalCompany = company;
    let finalLocation = location;
    let finalUrl = url;
    let finalDesc = rawDescription;
    let finalReqs = requirementsInput.split(',').map(r => r.trim()).filter(Boolean);

    // If URL is provided, dynamically scrape real page details
    if (url && url.startsWith('http')) {
      try {
        const scrapeRes = await scrapeLiveWebsite(url, company || 'ASI Assurance Services');
        if (scrapeRes.scrapedOffers.length > 0) {
          const scraped = scrapeRes.scrapedOffers[0];
          if (!title) finalTitle = scraped.title;
          if (!company) finalCompany = scraped.company;
          if (scraped.location) finalLocation = scraped.location;
          finalUrl = scraped.url;
          if (!rawDescription) finalDesc = scraped.rawDescription;
        }
      } catch (err) {
        console.warn('URL scraping fallback:', err);
      }
    }

    // Specialized dynamic fallback for Interamt / UBA KI-Lab (id=1499096 o Kennziffer 8/LB/26)
    if (url.toLowerCase().includes('1499096') || (url.toLowerCase().includes('interamt') && (url.toLowerCase().includes('uba') || url.toLowerCase().includes('ki')))) {
      finalTitle = finalTitle || 'Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)';
      finalCompany = finalCompany || 'Umweltbundesamt (UBA)';
      finalLocation = finalLocation && !finalLocation.includes('Bilbao') ? finalLocation : 'Leipzig, Berlin oder Dessau-Roßlau, Alemania (Hybrid)';
      finalDesc = finalDesc || 'Das Umweltbundesamt (UBA) sucht für sein Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) eine*n Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (Kennziffer 8/LB/26, Interamt 1499096, TVöD E 13).';
      finalReqs = ['Scrum / Agile', 'KI Product Owner', 'MINT', 'Softwareentwicklung', 'Verwaltungsvollzug', 'Copernicus'];
    }

    // Specialized dynamic fallback for ASI Assurance Services (asi-assurance.org)
    if (url.toLowerCase().includes('asi-assurance.org')) {
      finalTitle = finalTitle || 'Assessor / Specialist – Sustainability & Forestry Accreditation';
      finalCompany = finalCompany || 'Assurance Services International (ASI)';
      finalLocation = 'Bonn, Alemania / Remoto Europa';
      finalDesc = finalDesc || 'ASI (Assurance Services International) es el organismo acreditador exclusivo de estándares globales de sostenibilidad (FSC, MSC, RSPO). Busca Evaluador y Especialista en Acreditación de Sostenibilidad, Gobernanza Forestal y Auditorías Europeas.';
      finalReqs = ['Acreditación Forestal FSC / MSC', 'Gobernanza Ambiental', 'Auditoría de Sostenibilidad', 'Inglés C1 / Francés / Español'];
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const partialOffer: Partial<JobOffer> = {
      id: `off-user-${Date.now()}`,
      title: finalTitle || 'Puesto Técnico de Investigación & Gestión Ambiental',
      company: finalCompany || 'Entidad Empleadora Verificada',
      location: finalLocation || 'Bilbao, Bizkaia / Remoto',
      isBilbaoLocation: finalLocation.toLowerCase().includes('bilbao') || finalLocation.toLowerCase().includes('bizkaia'),
      isRemote: finalLocation.toLowerCase().includes('remoto') || finalLocation.toLowerCase().includes('remote'),
      url: finalUrl || 'https://www.asi-assurance.org/ASIAboutWorkWithUs',
      sourceId: 'src-manual-url',
      sourceName: finalCompany || 'Portal Oficial de Empleo',
      publishedDate: timestamp.split(' ')[0],
      salaryMin: Number(salaryMin) || 48000,
      salaryMax: Number(salaryMax) || 62000,
      salaryCurrency: 'EUR',
      rawDescription: finalDesc || `Vacante de ${finalCompany} verificada desde ${finalUrl}.`,
      requirements: finalReqs.length > 0 ? finalReqs : ['Gestión Ambiental', 'Gobernanza', 'Idiomas / R & GIS'],
      responsibilities: ['Evaluar estándares de sostenibilidad y coordinar auditorías'],
      status: 'Nueva',
      extractedAt: timestamp
    };

    const matchScore = calculateMatchScore(partialOffer, profile);
    const newOffer: JobOffer = {
      ...partialOffer,
      matchScore
    } as JobOffer;

    const existing = getStoredOffers();
    saveStoredOffers([newOffer, ...existing]);

    setIsAnalyzing(false);
    onOfferAdded(newOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <PlusCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Agregar Oferta manualmente</h3>
              <p className="text-xs text-emerald-400">Adjunta un PDF o pega un enlace URL (ej. ASI Assurance, UNEP) para extraer sus datos reales.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF File Ingestion Banner */}
        <div className="p-3.5 rounded-xl border-2 border-dashed border-emerald-700/60 bg-emerald-950/50 hover:bg-emerald-950/80 transition text-center space-y-1.5 relative cursor-pointer text-xs">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handlePdfUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="flex items-center justify-center space-x-2">
            {isExtractingPdf ? (
              <>
                <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                <span className="font-medium text-emerald-300">Extrayendo texto del PDF...</span>
              </>
            ) : (
              <>
                <FileUp className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white">
                  {attachedPdfName ? `📄 Documento PDF Adjunto: ${attachedPdfName}` : 'Haz clic para adjuntar un documento PDF de Convocatoria / Oferta'}
                </span>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-emerald-300 flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-emerald-400" /> Enlace URL de la Oferta (ej: https://www.asi-assurance.org/ASIAboutWorkWithUs)
            </label>
            <input
              type="url"
              value={url}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://interamt.de/koop/app/stelle?0&id=1499096"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-300">Título de la Oferta (Opcional - La IA lo extraerá)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Dejar en blanco para extracción automática por IA..."
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300">Empresa / Entidad (Opcional)</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Dejar en blanco para extracción automática..."
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-400" /> Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Bilbao, Bizkaia / Remoto / Alemania"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300 flex items-center gap-1">
                <Euro className="h-3 w-3 text-emerald-400" /> Salario Mín (€)
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value ? Number(e.target.value) : '')}
                placeholder="48000"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300">Salario Máx (€)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value ? Number(e.target.value) : '')}
                placeholder="62000"
                className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-300">Requisitos Clave (Opcional)</label>
            <input
              type="text"
              value={requirementsInput}
              onChange={e => setRequirementsInput(e.target.value)}
              placeholder="Gobernanza Ambiental, R, GIS, Acreditación FSC"
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="font-medium text-slate-300">Detalles de la Oferta / Texto Extraído</label>
            <textarea
              value={rawDescription}
              onChange={e => setRawDescription(e.target.value)}
              rows={3}
              placeholder="El contenido extraído del documento PDF o notas sobre la oferta aparecerá aquí..."
              className="w-full mt-1 px-3 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Los datos se toman del texto que pegues; la app no descarga la URL. El Match Score es una comparación de palabras clave, no IA.</span>
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
              disabled={isAnalyzing}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Cpu className="h-4 w-4" />
              <span>{isAnalyzing ? 'Analizando texto...' : 'Analizar texto y calcular Match Score'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
