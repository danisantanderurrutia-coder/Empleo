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
}
