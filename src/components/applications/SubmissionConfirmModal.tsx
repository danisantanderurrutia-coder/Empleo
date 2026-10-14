import React from 'react';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import type { ApplicationItem } from '../../types/applications';

interface SubmissionConfirmModalProps {
  application: ApplicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmission: (appId: string) => void;
}

export const SubmissionConfirmModal: React.FC<SubmissionConfirmModalProps> = ({
  application,
  isOpen,
  onClose,
  onConfirmSubmission
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-amber-500/40 shadow-2xl space-y-4 animate-in zoom-in duration-200">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Control de Aprobación Humana Obligatoria</h3>
            <p className="text-xs text-amber-300 font-medium">Acción Irreversible: Envío de Solicitud (Paso 7)</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p>
            La candidatura para <strong className="text-white">{application.offerTitle}</strong> en <strong className="text-white">{application.companyName}</strong> está lista en el Paso 6 (Revisión Final).
          </p>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-slate-300">
            <div className="font-semibold text-indigo-300">Resumen de Documentos a Transmitir:</div>
            <div>• CV Asignado: <span className="text-white font-medium">{application.cvVersionName}</span></div>
            <div>• Carta de Presentación: <span className="text-emerald-400 font-medium">Redactada y verificada</span></div>
            <div>• Formulario: <span className="text-sky-400 font-medium">Borrador validado por Antigravity Apply</span></div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start space-x-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Regla fundamental:</strong> La IA tiene estrictamente prohibido enviar solicitudes de empleo de forma autónoma. Al confirmar, certificas que has revisado los datos y autorizas el envío.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar y Revisar Más Tarde
          </button>

          <button
            onClick={() => onConfirmSubmission(application.id)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
            <span>Confirmar Envío Manualmente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
