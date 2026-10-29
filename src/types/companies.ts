export type QuadrantType = 'DACH' | 'EUSKADI' | 'REMOTE' | 'GLOBAL';

export interface CompanyContact {
  id: string;
  name: string;
  role: string; // e.g. "Investigador Principal (PI)", "Director Técnico", "Hiring Manager", "Reclutador"
  email?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface CompanyDossier {
  id: string;
  name: string;
  website: string;
  sector: string;
  size: string; // e.g. "50-200 empleados"
  headquarters: string;
  description: string;
  keyProjects: string[];
  recentNews: { title: string; date: string; snippet: string; url?: string }[];
  workCulture: string[];
  redFlags: string[];
  interviewArguments: string[]; // Key selling points to use in interviews
  techStack?: string[];
  lastResearched: string;
  quadrants?: QuadrantType[];
  contacts?: CompanyContact[];
  fundingTies?: string[];
}
