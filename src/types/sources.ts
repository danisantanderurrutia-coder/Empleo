export type SourceType = 
  | 'linkedin' 
  | 'eures' 
  | 'job_board' 
  | 'company_portal' 
  | 'university' 
  | 'ngo' 
  | 'research_center' 
  | 'public_admin';

export type PriorityLevel = 'Alta' | 'Media' | 'Baja';
export type SyncFrequency = 'Diario' | 'Cada 2 días' | 'Semanal' | 'Manual';
export type SourceStatus = 'Activo' | 'Pausado' | 'Error';

export interface JobSource {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  priority: PriorityLevel;
  frequency: SyncFrequency;
  status: SourceStatus;
  lastScraped: string;
  offersExtracted: number;
  notes?: string;
  selectorRules?: {
    searchQuery?: string;
    locationFilter?: string;
  };
}
