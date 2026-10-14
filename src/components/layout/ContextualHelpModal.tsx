import React from 'react';
import { HelpCircle, BookOpen, X, CheckCircle2 } from 'lucide-react';

interface ContextualHelpModalProps {
  currentTab: string;
  isOpen: boolean;
  onClose: () => void;
  onGoToTutorial: () => void;
}

export const ContextualHelpModal: React.FC<ContextualHelpModalProps> = ({
  currentTab,
  isOpen,
  onClose,
  onGoToTutorial
}) => {
  if (!isOpen) return null;

  const getTabHelpContent = (tab: string) => {
    switch (tab) {
      case 'profile':
        return {
          title: 'Master Profile & Fuente Única de Verdad',
          summary: 'Tus datos personales, formación (Geofísica, Doble Máster), experiencia en gobernanza ambiental, modelación (R, GIS) y Banco de Logros.',
          tips: [
            'Puedes adjuntar o arrastrar un archivo PDF de tu CV para desglosarlo automáticamente.',
            'Los datos del Master Profile alimentan la generación de CVs en español, inglés y alemán.',
            'Cualquier campo es 100% editable o eliminable.'
          ]
        };
      case 'offers':
        return {
          title: 'Ofertas Encontradas & Match Score (0–100)',
          summary: 'Scoring transparente con bonificación por residencia o vacantes en Bilbao y Bizkaia.',
          tips: [
            'Usa el botón "Agregar Oferta" para pegar un enlace o adjuntar un PDF de convocatoria pública (BOE/BOPV).',
            'Haz clic en "Ver Sitio Web" para previsualizar la página de la oferta.',
            'El botón "Ver Desglose Score" explica por qué la oferta obtuvo su porcentaje.'
          ]
        };
      case 'companies':
        return {
          title: 'Fichas de Empresa & Inteligencia Corporativa',
          summary: 'Investigaciones de empresas y centros I+D compiladas por el Researcher Agent.',
          tips: [
            'Haz clic en "Generar Reporte IA" para obtener un informe ejecutivo imprimible.',
            'Revisa los argumentos estratégicos de entrevista antes de cada reunión.'
          ]
        };
      case 'applications':
        return {
          title: 'Fase 3 del Pipeline: Despacho Asistido & Seguimiento',
          summary: 'Flujo estructurado con guardagujas de Aprobación Humana Obligatoria.',
          tips: [
            'El Pipeline general consta de 3 Fases: 1. Exploración ➔ 2. Selección & Armería ➔ 3. Despacho Asistido.',
            'La IA no puede enviar solicitudes sin tu confirmación expresa en cada candidatura.'
          ]
        };
      default:
        return {
          title: 'Job Search OS — Centro de Mando',
          summary: 'Plataforma para automatizar la búsqueda de empleo sin alucinación de datos.',
          tips: [
            'Navega por las pestañas para gestionar tu búsqueda.',
            'Consulta el manual completo en la pestaña Tutorial.'
          ]
        };
    };
  };

  const help = getTabHelpContent(currentTab);

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 border border-emerald-500/40 shadow-2xl space-y-4 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <HelpCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">{help.title}</h3>
              <p className="text-xs text-emerald-400">Manual Contextual — Versión 4.0</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-emerald-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-emerald-100">
          <p className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/60 leading-relaxed">
            {help.summary}
          </p>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider">Consejos Rápidos para esta Pestaña:</h4>
            <div className="space-y-1.5">
              {help.tips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-2 p-2 rounded-lg bg-emerald-950/50 border border-emerald-900/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-emerald-900/60">
          <button
            onClick={() => {
              onClose();
              onGoToTutorial();
            }}
            className="text-xs text-emerald-300 hover:text-emerald-100 font-semibold flex items-center space-x-1"
          >
            <BookOpen className="h-4 w-4" />
            <span>Abrir Tutorial Completo (v4.0)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
