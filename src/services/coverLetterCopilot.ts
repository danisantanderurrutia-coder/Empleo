import { getStoredProfile } from './db';
import type { JobOffer } from '../types/offers';

export interface GeneratedCoverLetter {
  language: 'es' | 'en';
  title: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  fullMarkdown: string;
}

export interface ApplicationQAPair {
  question: string;
  recommendedAnswer: string;
  tips: string;
}

/**
 * Cover letter TEMPLATE generator (no AI). It only fills in data that exists in the user's profile
 * and in the offer, and leaves [COMPLETAR] placeholders where the user must write their own,
 * truthful content. It never claims skills, achievements or knowledge of the company.
 */
export const generateTailoredCoverLetter = (offer: JobOffer, language: 'es' | 'en' = 'es'): GeneratedCoverLetter => {
  const profile = getStoredProfile();
  const companyName = offer.company || (language === 'en' ? 'the organisation' : 'la organización');
  const jobTitle = offer.title || (language === 'en' ? 'the position' : 'el puesto');
  const location = offer.location || '';
  const skills = profile.skills.slice(0, 6).map(s => s.name).join(', ');
  const contact = [profile.email, profile.phone, profile.location].filter(Boolean).join(' | ');

  if (language === 'en') {
    const salutation = `Dear Hiring Team at ${companyName},`;
    const bodyParagraphs = [
      `I am writing to apply for the position of ${jobTitle} at ${companyName}${location ? ` (${location})` : ''}.`,
      `[COMPLETAR: explain, in your own words, why your experience fits this role.${skills ? ` Skills listed in your profile: ${skills}.` : ''}]`,
      `[COMPLETAR: explain why you want to work at ${companyName}, based on what you have actually read about them.]`,
      'Thank you for your time and consideration. I would be glad to discuss my application in an interview.'
    ];
    const closing = `Sincerely, ${profile.fullName}`;
    const fullMarkdown = `**${profile.fullName}**  \n${contact}\n\n**${companyName}**  \n**Position:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();
    return {
      language: 'en',
      title: `Cover Letter - ${jobTitle} (${companyName})`,
      salutation,
      bodyParagraphs,
      closing,
      fullMarkdown
    };
  }

  const salutation = `Estimado equipo de selección de ${companyName}:`;
  const bodyParagraphs = [
    `Me dirijo a ustedes para presentar mi candidatura al puesto de ${jobTitle} en ${companyName}${location ? ` (${location})` : ''}.`,
    `[COMPLETAR: explica con tus palabras por qué tu experiencia encaja con este puesto.${skills ? ` Habilidades de tu perfil: ${skills}.` : ''}]`,
    `[COMPLETAR: explica por qué quieres trabajar en ${companyName}, basándote en lo que realmente sabes de ellos.]`,
    'Agradezco su atención y quedo a su disposición para ampliar información en una entrevista.'
  ];
  const closing = `Atentamente, ${profile.fullName}`;
  const fullMarkdown = `**${profile.fullName}**  \n${contact}\n\n**${companyName}**  \n**Puesto:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();

  return {
    language: 'es',
    title: `Carta de Presentación - ${jobTitle} (${companyName})`,
    salutation,
    bodyParagraphs,
    closing,
    fullMarkdown
  };
};

/**
 * Application Q&A TEMPLATE: question prompts with fill-in placeholders. Only the salary
 * answer uses real data (profile expectations and the offer's salary, if any).
 */
export const generateApplicationQA = (offer: JobOffer): ApplicationQAPair[] => {
  const profile = getStoredProfile();
  const company = offer.company || 'la organización';
  const title = offer.title || 'el puesto';
  const salaryInfo = offer.salaryMin
    ? `Rango de la oferta: ${offer.salaryMin.toLocaleString()}${offer.salaryMax ? '–' + offer.salaryMax.toLocaleString() : ''} ${offer.salaryCurrency || ''}.`.trim()
    : 'La oferta no indica salario.';
  const expectation = profile.desiredSalary ? `Tu expectativa guardada: ${profile.desiredSalary.toLocaleString()}.` : 'No tienes expectativa salarial guardada en el perfil.';

  return [
    {
      question: `1. ¿Por qué es su perfil adecuado para ${title} en ${company}?`,
      recommendedAnswer: '[COMPLETAR con tu experiencia real relacionada con los requisitos de la oferta.]',
      tips: 'Usa ejemplos concretos y verificables de tu CV.'
    },
    {
      question: '2. Describa un logro profesional relevante para este puesto.',
      recommendedAnswer: '[COMPLETAR: elige un logro de tu banco de logros.]',
      tips: 'Incluye contexto, tu papel y el resultado medible si lo hay.'
    },
    {
      question: '3. ¿Cuáles son sus pretensiones salariales y disponibilidad?',
      recommendedAnswer: `[COMPLETAR] ${salaryInfo} ${expectation}`,
      tips: 'Confirma tu disponibilidad real de incorporación.'
    }
  ];
};
