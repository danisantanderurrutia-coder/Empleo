import type { Achievement, WorkExperience, Education, SkillItem, LanguageItem } from './profile';

export type CVTemplateId = 
  | 'europass' 
  | 'es_standard' 
  | 'en_tech' 
  | 'de_two_page' 
  | 'de_short' 
  | 'ats_clean' 
  | 'academic_ngo';

export interface CVTemplateInfo {
  id: CVTemplateId;
  name: string;
  language: 'es' | 'en' | 'de';
  pages: string;
  description: string;
  targetAudience: string;
  accentColor: string;
}

export interface CVVersion {
  id: string;
  name: string;
  templateId: CVTemplateId;
  language: 'es' | 'en' | 'de';
  createdAt: string;
  updatedAt: string;
  targetOfferId?: string;
  targetCompany?: string;
  selectedExperiences: string[];
  selectedEducation: string[];
  selectedSkills: string[];
  selectedAchievements: string[];
  customSummary?: string;
  compiledData: {
    fullName: string;
    contactInfo: {
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      github?: string;
    };
    summary: string;
    experiences: WorkExperience[];
    education: Education[];
    skills: SkillItem[];
    languages: LanguageItem[];
    achievements: Achievement[];
    otherCourses?: string[];
  };
}
