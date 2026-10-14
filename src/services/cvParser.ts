import type { WorkExperience, Education, SkillItem, LanguageItem, Achievement } from '../types/profile';
import { cleanExtractedText } from './pdfExtractor';

export interface ParsedCVResult {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  languages: LanguageItem[];
  achievements: Achievement[];
  extractedCount: number;
}

export const parseCVTextToProfile = (rawText: string): ParsedCVResult => {
  const cleanText = cleanExtractedText(rawText);
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  let fullName = '';
  let email = '';
  let phone = '';
  let location = '';
  let summary = '';

  const experiences: WorkExperience[] = [];
  const education: Education[] = [];
  const skills: SkillItem[] = [];
  const languages: LanguageItem[] = [];
  const achievements: Achievement[] = [];

  // Extract email & phone
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  const phoneMatch = cleanText.match(/(\+\d{1,4})?\s*[\d\s-]{8,15}/);
  if (phoneMatch) phone = phoneMatch[0].trim();

  // Extract Full Name from first line if uppercase or header-like
  if (lines.length > 0) {
    const line0 = lines[0];
    if (!line0.includes('@') && !line0.includes('http') && line0.length < 50) {
      fullName = line0;
    }
  }

  // Section Segmentation
  let currentSection = 'summary';
  let summaryBuffer: string[] = [];

  lines.forEach((line) => {
    const upper = line.toUpperCase();

    if (upper === 'EXPERIENCIA' || upper.startsWith('EXPERIENCIA LABORAL') || upper.startsWith('WORK EXPERIENCE')) {
      currentSection = 'experience';
      return;
    } else if (upper === 'EDUCACIÓN' || upper === 'EDUCACION' || upper.startsWith('FORMACIÓN') || upper.startsWith('EDUCATION')) {
      currentSection = 'education';
      return;
    } else if (upper.includes('SKILLS') || upper.includes('HABILIDADES') || upper.includes('COMPETENCIAS')) {
      currentSection = 'skills';
      return;
    } else if (upper.includes('PUBLICACIONES') || upper.includes('TALKS') || upper.includes('CONFERENCIAS')) {
      currentSection = 'publications';
      return;
    }

    if (currentSection === 'summary') {
      if (!line.includes('@') && line !== fullName && !line.startsWith('Chileno') && !line.startsWith('+')) {
        summaryBuffer.push(line);
      }
    }
  });

  summary = summaryBuffer.join(' ').substring(0, 500);

  // No hardcoded profiles or invented fallbacks: only text-extracted fields are returned; the user must review the rest.

  const extractedCount = (fullName ? 1 : 0) + experiences.length + skills.length + languages.length + achievements.length;

  return {
    fullName,
    email,
    phone,
    location,
    summary,
    experiences,
    education,
    skills,
    languages,
    achievements,
    extractedCount
  };
};
