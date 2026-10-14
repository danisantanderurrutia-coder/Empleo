export type ApplicationStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface StageInfo {
  stage: ApplicationStage;
  label: string;
  shortName: string;
  description: string;
  isIrreversible?: boolean;
}

export const STAGES: StageInfo[] = [
  { stage: 1, label: '1. Revisar Oferta', shortName: 'Revisión', description: 'Analizar encaje, requisitos y score de la oferta.' },
  { stage: 2, label: '2. Investigar Empresa', shortName: 'Investigación', description: 'Recopilar proyectos, noticias y argumentos estratégicos.' },
  { stage: 3, label: '3. Adaptar CV', shortName: 'CV Adaptado', description: 'Generar versión de CV optimizada a partir del Master Profile.' },
  { stage: 4, label: '4. Redactar Carta', shortName: 'Carta Presentación', description: 'Redactar carta personalizada sin inventar experiencia.' },
  { stage: 5, label: '5. Preparar Formulario', shortName: 'Formulario', description: 'Autorellenar respuestas de solicitud con Browser Agent.' },
  { stage: 6, label: '6. Revisión Final', shortName: 'Revisión Final', description: 'Verificación de datos y confirmación del usuario.' },
  { stage: 7, label: '7. Enviar (Aprobado)', shortName: 'Enviada', description: 'Envío confirmado por el usuario.', isIrreversible: true },
  { stage: 8, label: '8. Entrevista', shortName: 'Entrevista', description: 'Preparación de preguntas y seguimiento de entrevistas.' },
  { stage: 9, label: '9. Resultado', shortName: 'Resultado', description: 'Resultado final (Aceptada / Rechazada / Retirada).' },
];

export interface ApplicationHistoryEvent {
  id: string;
  timestamp: string;
  stage: ApplicationStage;
  title: string;
  note?: string;
  actor: 'Usuario' | 'Agente IA' | 'Browser Agent';
}

export interface ApplicationItem {
  id: string; // ID e.g. "CAND-2026-001"
  offerId: string;
  offerTitle: string;
  companyName: string;
  location: string;
  currentStage: ApplicationStage;
  status: 'En Progreso' | 'Pausada' | 'Enviada' | 'Entrevista' | 'Oferta Recibida' | 'Desestimada';
  createdDate: string;
  updatedDate: string;
  
  // Associated documents
  cvVersionId?: string;
  cvVersionName?: string;
  coverLetter?: string;
  formDraft?: Record<string, string>; // Key-value pairs for auto-filled forms
  
  // Human approval checkpoint for Stage 7
  humanApprovalGranted: boolean;
  approvalTimestamp?: string;

  // Batch Review & Dispatch (Pestaña Lote)
  offerUrl?: string;
  isBatchApproved?: boolean;
  batchReviewStatus?: 'Borrador Generado' | 'Revisado por Usuario' | 'Aprobado Listo para Enviar' | 'Despachado';
  adaptedCvSummary?: string[];
  
  // Interview tracking
  interviewDate?: string;
  interviewNotes?: string;
  outcome?: 'Contratado' | 'Rechazado' | 'Oferta Rechazada' | 'Sin Respuesta';
  
  history: ApplicationHistoryEvent[];
}
