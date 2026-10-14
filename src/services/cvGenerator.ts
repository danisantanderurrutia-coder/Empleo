import type { MasterProfile } from '../types/profile';
import type { CVTemplateId, CVVersion } from '../types/cv';

export const generateCVFromProfile = (
  templateId: CVTemplateId,
  name: string,
  profile: MasterProfile,
  selectedExpIds?: string[],
  selectedSkillIds?: string[],
  selectedAchievementIds?: string[],
  customSummary?: string
): CVVersion => {
  const language = templateId.startsWith('de_') ? 'de' : templateId === 'en_tech' ? 'en' : 'es';
  
  const expFiltered = selectedExpIds && selectedExpIds.length > 0 
    ? profile.experiences.filter(e => selectedExpIds.includes(e.id))
    : profile.experiences;

  const skillsFiltered = selectedSkillIds && selectedSkillIds.length > 0
    ? profile.skills.filter(s => selectedSkillIds.includes(s.id))
    : profile.skills;

  const achievementsFiltered = selectedAchievementIds && selectedAchievementIds.length > 0
    ? profile.achievementsBank.filter(a => selectedAchievementIds.includes(a.id))
    : profile.achievementsBank;

  return {
    id: `cv-${Date.now()}`,
    name: name || `CV Adaptado ${templateId.toUpperCase()}`,
    templateId,
    language,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    selectedExperiences: expFiltered.map(e => e.id),
    selectedEducation: profile.education.map(ed => ed.id),
    selectedSkills: skillsFiltered.map(s => s.id),
    selectedAchievements: achievementsFiltered.map(a => a.id),
    customSummary: customSummary || profile.summary,
    compiledData: {
      fullName: profile.fullName,
      contactInfo: {
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedin: profile.linkedin,
        github: profile.github
      },
      summary: customSummary || profile.summary,
      experiences: expFiltered,
      education: profile.education,
      skills: skillsFiltered,
      languages: profile.languages,
      achievements: achievementsFiltered,
      otherCourses: profile.otherCourses || []
    }
  };
};
