import type { MasterProfile } from '../types/profile';
import type { JobOffer, MatchScoreBreakdown } from '../types/offers';

/**
 * Keyword-based match scorer (NOT AI). It only compares the profile against the offer text:
 *  - skills: profile skill names found in the offer text
 *  - location: profile locationPreferences vs. offer location / remote flag
 *  - salary: offer salary vs. profile expectations (0 if the offer gives none)
 *  - experience: seniority words in the offer (0 if undetectable)
 * No points are granted for missing information, so a score of 0 means "no evidence".
 */
export const calculateMatchScore = (offer: Partial<JobOffer>, profile: MasterProfile): MatchScoreBreakdown => {
  const rationale: string[] = [];
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  const pendingVerificationRequirements: string[] = [];

  const reqsText = (offer.requirements || []).join(' ') + ' ' + (offer.title || '') + ' ' + (offer.rawDescription || '');
  const reqsLower = reqsText.toLowerCase();

  // --- Skills ---
  profile.skills.forEach(skill => {
    const name = skill.name.toLowerCase().trim();
    if (name && reqsLower.includes(name)) matchingSkills.push(skill.name);
  });

  let skillFitScore = 0;
  if (matchingSkills.length > 0) {
    const denominator = Math.max(3, Math.min(profile.skills.length, 8));
    skillFitScore = Math.min(35, Math.round((matchingSkills.length / denominator) * 35));
    rationale.push(`Habilidades del perfil encontradas en la oferta (${matchingSkills.join(', ')}): +${skillFitScore} pts.`);
  } else {
    rationale.push('Ninguna habilidad de tu perfil aparece en el texto de la oferta: 0 pts.');
  }

  // --- Location & modality (from the user's own preferences) ---
  let locationScore = 0;
  const locLower = (offer.location || '').toLowerCase();
  const isRemote = !!offer.isRemote || locLower.includes('remoto') || locLower.includes('remote');

  const matchedPref = profile.locationPreferences.find(pref => {
    const tokens = pref.city.toLowerCase().split(/[\s/(),]+/).filter(t => t.length > 3);
    return tokens.some(t => locLower.includes(t));
  });

  if (matchedPref) {
    locationScore = Math.round(25 * matchedPref.scoreMultiplier);
    rationale.push(`Ubicación coincide con tu preferencia "${matchedPref.city}": +${locationScore} pts.`);
  } else if (isRemote && profile.locationPreferences.some(p => p.openToRemote)) {
    locationScore = 20;
    rationale.push('Oferta remota y aceptas remoto: +20 pts.');
  } else if (!offer.location) {
    rationale.push('Ubicación no indicada: 0 pts.');
    pendingVerificationRequirements.push('Ubicación no indicada en la oferta');
  } else {
    rationale.push(`Ubicación (${offer.location}) fuera de tus preferencias: 0 pts.`);
  }

  // --- Salary ---
  let salaryScore = 0;
  if (offer.salaryMin) {
    if (profile.desiredSalary && offer.salaryMin >= profile.desiredSalary) {
      salaryScore = 15;
      rationale.push(`Salario (${offer.salaryMin}) alcanza tu expectativa (${profile.desiredSalary}): +15 pts.`);
    } else if (profile.minSalary && offer.salaryMin >= profile.minSalary) {
      salaryScore = 10;
      rationale.push(`Salario (${offer.salaryMin}) supera tu mínimo (${profile.minSalary}): +10 pts.`);
    } else {
      rationale.push('Salario por debajo de tu mínimo (o sin mínimo definido): 0 pts.');
    }
  } else {
    rationale.push('Salario no especificado: 0 pts (no se asume nada).');
    pendingVerificationRequirements.push('Rango salarial no indicado en la oferta');
  }

  // --- Seniority (very rough: looks for words in the offer text) ---
  let experienceScore = 0;
  if (reqsLower.includes('senior') || reqsLower.includes('lead') || reqsLower.includes('coordinador') || reqsLower.includes('responsable')) {
    if (profile.targetRoles.some(r => r.seniorityLevel === 'Senior' || r.seniorityLevel === 'Lead / Director')) {
      experienceScore = 14;
      rationale.push('Oferta de nivel senior y tus roles objetivo son senior: +14 pts.');
    }
  } else if (reqsLower.includes('junior')) {
    experienceScore = 4;
    rationale.push('Oferta de nivel junior: +4 pts.');
  } else {
    rationale.push('Nivel de seniority no detectable en el texto: 0 pts.');
  }

  const companyQualityScore = 0;
  const totalScore = Math.min(100, skillFitScore + locationScore + salaryScore + experienceScore + companyQualityScore);

  return {
    totalScore,
    skillFitScore,
    locationScore,
    salaryScore,
    experienceScore,
    companyQualityScore,
    rationale,
    matchingSkills,
    missingSkills,
    pendingVerificationRequirements
  };
};
