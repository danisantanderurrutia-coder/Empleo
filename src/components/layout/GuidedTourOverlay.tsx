import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, X, Zap } from 'lucide-react';

interface GuidedStep {
  tabId: string;
  targetId?: string;
  title: string;
  description: string;
  actionHint: string;
}

const STEPS: GuidedStep[] = [
  {
    tabId: 'dashboard',
    title: 'Paso 1: Centro de Mando (Dashboard)',
    description: 'Aquí ves de un vistazo tus métricas de búsqueda, tasa de respuesta, ofertas de alto encaje y acciones recomendadas.',
    actionHint: 'Haz clic en las tarjetas de KPI o ejecuta el botón /daily-job-search en la barra superior.'
  },
  {
    tabId: 'profile',
    title: 'Paso 2: Master Profile (Fuente Única de Verdad)',
    description: 'Introduce tus datos personales, trayectoria e idioma. Configura Bilbao como ubicación preferida con bonificación de score.',
    actionHint: 'Añade logros en el Banco de Logros con métricas cuantificables (+35% eficiencia).'
  },
  {
    tabId: 'cvs',
    title: 'Paso 3: CVs & Plantillas Adaptadas',
    description: 'Genera versiones de CV (Español, English Tech, Europass, ATS, Alemán) basadas directamente en el Master Profile sin duplicidad.',
    actionHint: 'Previsualiza cualquier plantilla y expórtala en formato impreso/PDF.'
  },
  {
    tabId: 'sources',
    title: 'Paso 4: Fuentes de Empleo',
    description: 'Gestiona ilimitadas fuentes de empleo (LinkedIn, EURES, Tecnoempleo, Tecnalia, Sherpa.ai, Lanbide).',
    actionHint: 'El Scout Agent visitará estas fuentes para extraer ofertas automáticamente.'
  },
  {
    tabId: 'offers',
    title: 'Paso 5: Ofertas con Match Score 0-100',
    description: 'Explora ofertas clasificadas por nivel de encaje. Consulta la justificación transparente y requisitos pendientes.',
    actionHint: 'Haz clic en "Ver Justificación Match" o "Iniciar Candidatura".'
  },
  {
    tabId: 'applications',
    title: 'Paso 6: Pipeline de Candidaturas (9 Pasos)',
    description: 'Flujo paso a paso desde revisión de oferta hasta entrevista y contratación.',
    actionHint: 'IMPORTANTE: En el Paso 6/7, la IA requerirá tu aprobación humana manual obligatoria antes de enviar.'
  },
  {
    tabId: 'intelligence',
    title: 'Paso 7: Inteligencia & Asesor de Estrategia',
    description: 'Examina estadísticas de rendimiento y chatea con la IA para optimizar tu estrategia de búsqueda.',
    actionHint: 'Pregunta a la IA qué plantillas de CV obtienen mayor tasa de entrevista.'
  },
  {
    tabId: 'tutorial',
    title: 'Paso 8: Tutorial Integrado & Agente de Documentación',
    description: 'Manual auto-actualizable con el estado de la documentación (v1.0.5) y botón /update-documentation.',
    actionHint: 'Utiliza el botón de ayuda (?) en la barra superior en cualquier momento.'
  }
];

interface GuidedTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onSelectTab(STEPS[nextIndex].tabId);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onSelectTab(STEPS[prevIndex].tabId);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full glass-panel border border-amber-500/40 rounded-2xl p-5 shadow-2xl shadow-amber-500/10 space-y-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
          <Zap className="h-4 w-4 retro-red-glow animate-pulse text-rose-500" />
          <span>Modo Guiado Job Search OS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
            {currentStepIndex + 1} de {STEPS.length}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-bold text-slate-100 text-base">{currentStep.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-amber-300 font-medium">
          💡 Accion: {currentStep.actionHint}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Anterior</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          <span>{currentStepIndex === STEPS.length - 1 ? 'Finalizar Tour' : 'Siguiente'}</span>
          {currentStepIndex === STEPS.length - 1 ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
