export interface IntelligenceMetrics {
  totalOffersScouted: number;
  activeCandidatures: number;
  totalSubmissions: number;
  interviewsScheduled: number;
  responseRatePercent: number; // Submissions that led to interviews
  averageMatchScore: number;
  topPerformingCVTemplate: string;
  topPerformingSource: string;
  bilbaoOffersCount: number;
  offersBySource: { sourceName: string; count: number; avgScore: number }[];
  candidaturesByStage: { stage: number; label: string; count: number }[];
  cvPerformance: { templateId: string; templateName: string; usedCount: number; interviewCount: number; conversionRate: number }[];
}

export interface StrategyChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
