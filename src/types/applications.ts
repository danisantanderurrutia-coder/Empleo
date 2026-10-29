export type ApplicationStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StageInfo {
  stage: ApplicationStage;
  label: string;
  shortName: string;
  description: string;
  isIrreversible?: boolean;
}

export const STAGES: StageInfo[] = [
  { 
    stage: 1, 
    label: '1. Cuenta Diana', 
    shortName: 'Cuenta Diana', 
    description: 'Selección de la organización o centro I+D prioritario por cuadrante (DACH, Euskadi, Global).' 
  },
  { 
    stage: 2, 
    label: '2. Revisión de Oferta / Proyecto', 
    shortName: 'Oferta / Proyecto', 
    description: 'Revisión técnica de la vacante, proyecto de I+D o convocatoria específica detectada.' 
  },
  { 
    stage: 3, 
    label: '3. Mapeo del Decisor', 
    shortName: 'Decisor & Entidad', 
    description: 'Investigación técnica de la entidad e identificación del Hiring Manager, PI o Reclutador.' 
  },
  { 
    stage: 4, 
    label: '4. Capacidades & CV Adaptado', 
    shortName: 'CV Transdisciplinar', 
    description: 'Selección de capacidades transdisciplinarias y ensamblaje de CV adaptado desde hechos verificados.' 
  },
  { 
    stage: 5, 
    label: '5. Gancho Directo & Carta Formal', 
    shortName: 'Gancho & Carta', 
    description: 'Redacción del mensaje directo corto para el decisor y la carta formal de respaldo técnico.' 
  },
  { 
    stage: 6, 
    label: '6. Control de Calidad', 
    shortName: 'Revisión Final', 
    description: 'Auditoría de consistencia técnica, verificación de enlaces del portafolio y confirmación del usuario.' 
  },
  { 
    stage: 7, 
    label: '7. Envío y Despacho', 
    shortName: 'Despacho', 
    description: 'Registro de canal utilizado (LinkedIn, correo del PI, portal oficial) y fecha de confirmación.', 
    isIrreversible: true 
  },
  { 
    stage: 8, 
    label: '8. Seguimiento & Reunión', 
    shortName: 'Seguimiento', 
    description: 'Temporizador de 5 días hábiles, registro de respuestas, diálogo técnico y preparación de reuniones.' 
  }
];

export interface ApplicationHistoryEvent {
  id: string;
  timestamp: string;
  stage: ApplicationStage | number;
  title: string;
  note?: string;
  actor: 'Usuario' | 'Procedimiento Táctico' | 'Agente IA' | 'Browser Agent';
}

export interface ApplicationItem {
  id: string; // ID e.g. "CAND-2026-001"
  offerId: string;
  offerTitle: string;
  companyName: string;
  location: string;
  currentStage: ApplicationStage;
  status: 'En Progreso' | 'Pausada' | 'Enviada' | 'En Seguimiento' | 'Entrevista' | 'Reunión Agendada' | 'Oferta Recibida' | 'Desestimada';
  createdDate: string;
  updatedDate: string;
  
  // Decisor & Contacto Directo (NP2 / PD-3)
  decisionMakerName?: string;
  decisionMakerRole?: string;
  decisionMakerChannel?: 'LinkedIn' | 'Email' | 'Portal Oficial' | 'Referencia';
  decisionMakerEmail?: string;
  decisionMakerLinkedin?: string;
  
  // Gancho Directo & Carta Formal (NP4 + PA4 / PD-5)
  directPitchHook?: string; // Mensaje corto (<100 palabras) para LinkedIn/Email
  coverLetter?: string;     // Carta formal de 5 párrafos rigurosos
  selectedCapabilities?: string[]; // Capacidades transdisciplinarias seleccionadas
  
  // Documentos asociados
  cvVersionId?: string;
  cvVersionName?: string;
  formDraft?: Record<string, string>;
  
  // Control de Envío (PD-7)
  humanApprovalGranted: boolean;
  approvalTimestamp?: string;
  offerUrl?: string;
  adaptedCvSummary?: string[];
  
  // Batch Review Compatibility
  isBatchApproved?: boolean;
  batchReviewStatus?: 'Borrador Generado' | 'Revisado por Usuario' | 'Aprobado Listo para Enviar' | 'Despachado';
  
  // Cadencia de Seguimiento & Reunión (PD-8)
  followUpDueDate?: string;
  interviewDate?: string;
  interviewNotes?: string;
  outcome?: 'Contratado' | 'Rechazado' | 'Oferta Rechazada' | 'Sin Respuesta';
  
  history: ApplicationHistoryEvent[];
}
