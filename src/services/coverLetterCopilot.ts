import { getStoredProfile } from './db';
import type { JobOffer } from '../types/offers';
import type { TargetLeadProfile, JobDossier } from '../types/intelligence';
import { scoreFacts } from './cvStudio';
import { CANONICAL_CONTACT } from '../data/verifiedCvFacts';

export interface GeneratedCoverLetter {
  language: 'es' | 'en' | 'de';
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
 * Generador de BORRADOR de carta de presentación anclado en la Fuente Única de Verdad (Portafolio)
 * y enriquecido por el subsistema "Job Wingman" (Target Intelligence & PI Dossier).
 */
export const generateTailoredCoverLetter = (
  offer: JobOffer,
  language: 'es' | 'en' | 'de' = 'es',
  targetLead?: TargetLeadProfile,
  dossier?: JobDossier
): GeneratedCoverLetter => {
  const profile = getStoredProfile();
  const companyName = offer.company || (language === 'en' ? 'the organisation' : language === 'de' ? 'die Organisation' : 'la organización');
  const jobTitle = offer.title || (language === 'en' ? 'the position' : language === 'de' ? 'die Stelle' : 'el puesto');
  const location = offer.location || '';
  const contact = [profile.email || CANONICAL_CONTACT.email, profile.phone, profile.location || CANONICAL_CONTACT.defaultLocation].filter(Boolean).join(' | ');

  const activeLead = targetLead || offer.leadProfile || dossier?.leadProfile;
  const activeDossier = dossier || offer.jobDossier;

  // Detección de contexto Thünen / Axel Don / TechWorms
  const isThuenenContext = 
    activeDossier?.id === 'dossier-thuenen-techworms-axel-don' ||
    companyName.toLowerCase().includes('thünen') ||
    companyName.toLowerCase().includes('thuenen') ||
    jobTitle.toLowerCase().includes('techworm') ||
    (activeLead?.name && activeLead.name.toLowerCase().includes('axel don'));

  const scored = scoreFacts(offer);
  const matchedExperiences = scored
    .filter((s) => s.fact.section === 'experience' && s.matchedTags.length > 0)
    .sort((a, b) => b.score - a.score);
  const topExp = matchedExperiences[0]?.fact || scored.find((s) => s.fact.section === 'experience')?.fact;
  const matchedKeywords = Array.from(new Set(scored.flatMap((s) => s.matchedTags))).slice(0, 5);

  // ==========================================================================
  // INGLÉS (EN)
  // ==========================================================================
  if (language === 'en') {
    let salutation = `Dear Hiring Team at ${companyName},`;
    if (activeLead?.name) {
      salutation = `Dear ${activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : ''}${activeLead.name},`;
    }

    let bodyParagraphs: string[] = [];

    if (isThuenenContext) {
      bodyParagraphs = [
        `I am writing to submit my application for the doctoral / research position within the "TechWorms" project at the Thünen Institute of Climate-Smart Agriculture. Having closely followed your research on subsoil organic carbon dynamics and root-accessible macropores (including insights from SUBSOM and SOIL3), I am eager to contribute my quantitative geophysical background to this investigation.`,
        `Rather than approaching subsoil compaction and root penetration from a purely descriptive agronomic viewpoint, my training as an Environmental Geophysicist (Universidad de Chile, with distinction) frames soil as an anisotropic, heterogeneous porous medium. This perspective allows me to model preferential bypass flow, unsaturated matrix potential gradients, and mechanical impedance along artificial earthworm burrows using formal continuum physics and numerical transport equations.`,
        `On the methodological front, my experience in scientific computing (R and Python) and spatial signal processing enables the automated, unbiased analysis of root images captured by the RootBox under UV fluorescence. Furthermore, my understanding of mass-balance dynamics allows me to critically tackle the isotopic tracing (13C/15N) of root-derived carbon—rigorously assessing the balance between organo-mineral stabilization in the drilosphere versus potential priming effects on indigenous subsoil carbon.`,
        `Having conducted extensive all-weather hydrogeophysical and peatland greenhouse-gas fieldwork, I am accustomed to physically demanding core sampling and long-term in-situ instrumentation. Currently completing my M.Sc. in Environmental Management at CAU Kiel, I am based in northern Germany and prepared for immediate deployment in Braunschweig.`,
        `Thank you for considering my application. I would welcome the opportunity to discuss how my quantitative skillset can advance the experimental and analytical goals of the TechWorms team.`
      ];
    } else {
      const expSnippet = topExp
        ? `In particular, my work on ${topExp.en.title} (${topExp.en.short || ''}) provides direct, verified evidence supporting this application.`
        : '';
      const kwSnippet = matchedKeywords.length > 0
        ? `My background connects directly with your technical requirements in ${matchedKeywords.join(', ')}.`
        : '';
      const hooksSnippet = activeDossier?.technicalHooks?.length
        ? `Specifically: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
        : '';

      bodyParagraphs = [
        `I am writing to apply for the position of ${jobTitle} at ${companyName}${location ? ` (${location})` : ''}.`,
        `As an Environmental Geophysicist (Universidad de Chile, with distinction) and dual European M.Sc. candidate in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland), I combine quantitative environmental modeling with empirical fieldwork and scientific software development in R and Python. ${kwSnippet} ${expSnippet} ${hooksSnippet}`.trim(),
        activeDossier?.candidateValueThesis || `My analytical foundation and field autonomy enable me to resolve key data integration and experimental bottlenecks effectively.`,
        'Thank you for your time and consideration. I would welcome the opportunity to discuss my application in an interview.'
      ];
    }

    const closing = `Sincerely,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
    const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Position:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();
    return {
      language: 'en',
      title: `Cover Letter - ${jobTitle} (${companyName})`,
      salutation,
      bodyParagraphs,
      closing,
      fullMarkdown
    };
  }

  // ==========================================================================
  // ALEMÁN (DE)
  // ==========================================================================
  if (language === 'de') {
    let salutation = `Sehr geehrte Damen und Herren,`;
    if (activeLead?.name) {
      const title = activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : '';
      const lastName = activeLead.name.split(' ').slice(-1)[0];
      salutation = `Sehr geehrter Herr ${title}${lastName},`;
    }

    let bodyParagraphs: string[] = [];

    if (isThuenenContext) {
      bodyParagraphs = [
        `hiermit bewerbe ich mich mit großem wissenschaftlichem Interesse um die Promotionsstelle im Projekt „TechWorms“ (Künstliche Makroporen zur Unterbodenerschließung) am Thünen-Institut für Agrarklimaschutz. Ihre Pionierarbeiten zur Kohlenstoffdynamik in Unterböden (insbesondere die Erkenntnisse aus SUBSOM und SOIL3) verfolge ich seit Langem; die Erforschung von Makroporen als Schnittstelle zwischen Trockenheitsresilienz und C-Sequestrierung trifft exakt meine wissenschaftliche Ausrichtung.`,
        `Als Umweltgeophysiker (Universidad de Chile, mit Auszeichnung) und M.Sc.-Kandidat für Umweltmanagement an der CAU Kiel betrachte ich den Unterboden nicht als rein deskriptives Substrat, sondern als anisotropes poröses Medium. Dies ermöglicht es mir, präferentiellen Fluss, hydraulische Gradienten im ungesättigten Bereich und mechanische Penetrationswiderstände entlang künstlicher Regenwurmgänge mit den mathematisch-physikalischen Werkzeugen der Kontinuumsmechanik und Transportgleichungen quantitativ zu analysieren.`,
        `Methodisch bringe ich fundierte Praxis in der wissenschaftlichen Datenanalyse und Modellierung mit R und Python sowie in der räumlichen Signalverarbeitung mit. Damit kann ich die automatisierte Bildanalyse der RootBox (UV-Fluoreszenz zur quantitativen Bestimmung der Wurzellängendichte RLD) robust weiterentwickeln. Zudem erlaubt mir mein quantitativer Hintergrund, die geplante Isotopenanalytik (13C/15N) mit der gebotenen thermodynamischen und massenbilanziellen Schärfe zu bearbeiten – insbesondere im Hinblick auf das kritische Spannungsfeld zwischen mineralischer Stabilisierung in der Drilosphäre und potentiellem Priming-Effekt auf Alt-Humus.`,
        `Aus meiner feldgeophysikalischen Praxis (unter anderem bei hydrogeophysikalischen Messungen und Treibhausgasmessungen in Mooren) bin ich an anspruchsvolle, wetterunabhängige Beprobungskampagnen und kontinuierliche in-situ-Sensorik gewöhnt. Durch meinen Wohnsitz in Kiel bin ich regional unmittelbar angebunden und kurzfristig einsatzbereit.`,
        `Über die Gelegenheit, mich und meinen Beitrag zum Projekt TechWorms in einem persönlichen Gespräch vorzustellen, freue ich mich sehr.`
      ];
    } else {
      const hooksSnippetDe = activeDossier?.technicalHooks?.length
        ? `Konkret: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
        : '';

      bodyParagraphs = [
        `hiermit bewerbe ich mich mit großem Interesse auf die Stelle als ${jobTitle} bei ${companyName}${location ? ` (${location})` : ''}.`,
        `Als Umweltgeophysiker (Universidad de Chile, mit Auszeichnung) und M.Sc.-Kandidat für Umweltmanagement an der CAU Kiel verbinde ich quantitative Feldarbeit und Datenanalyse (R, Python) mit fundierter wissenschaftlicher Praxis in Deutschland und Europa. ${hooksSnippetDe}`.trim(),
        activeDossier?.candidateValueThesis || `Mein quantitatives Profil und meine Selbstständigkeit im Feld ermöglichen es mir, komplexe experimentelle Fragestellungen und datenanalytische Engpässe zielgerichtet zu lösen.`,
        'Über eine Gelegenheit, meine Motivation und Qualifikationen in einem persönlichen Gespräch zu vertiefen, freue ich mich sehr.'
      ];
    }

    const closing = `Mit freundlichen Grüßen,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
    const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Position:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();
    return {
      language: 'de',
      title: `Anschreiben - ${jobTitle} (${companyName})`,
      salutation,
      bodyParagraphs,
      closing,
      fullMarkdown
    };
  }

  // ==========================================================================
  // ESPAÑOL (ES)
  // ==========================================================================
  let salutation = `Estimado equipo de selección de ${companyName}:`;
  if (activeLead?.name) {
    salutation = `Estimado ${activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : ''}${activeLead.name}:`;
  }

  let bodyParagraphs: string[] = [];

  if (isThuenenContext) {
    bodyParagraphs = [
      `Me dirijo a usted con alto interés científico para presentar mi postulación a la posición doctoral en el proyecto "TechWorms" (macroporos artificiales para la colonización del subsuelo, dinámica radicular y secuestro de carbono) en el Thünen-Institut für Agrarklimaschutz. Sigo de cerca sus contribuciones sobre la dinámica del carbono en horizontes profundos (en particular las investigaciones de SUBSOM y SOIL3); el estudio de los macroporos como interfaz entre resiliencia ante sequías y almacenamiento de C coincide plenamente con mi vocación investigadora.`,
      `En lugar de abordar la compactación del subsuelo y la penetración radicular desde una perspectiva agronómica meramente descriptiva, mi formación como Geofísico Ambiental (Universidad de Chile, con distinción) y candidato a M.Sc. en Manejo Ambiental (CAU Kiel) concibe el suelo como un medio poroso anisótropo y heterogéneo. Este enfoque permite modelar el flujo preferencial por derivación (bypass), los gradientes de potencial hídrico en la matriz no saturada y la impedancia mecánica a lo largo de las galerías artificiales aplicando herramientas cuantitativas de mecánica de fluidos y ecuaciones de transporte.`,
      `En el plano metodológico, aporto experiencia práctica en análisis numérico y modelado en R y Python, así como en procesamiento de señales espaciales. Esto me capacita para optimizar y automatizar el pipeline de visión por computadora de la RootBox (cuantificación de densidad de longitud radicular bajo fluorescencia UV). Asimismo, mi base cuantitativa me permite abordar los balances isotópicos (13C/15N) con rigor termodinámico y de balance de masa, profundizando en el balance crítico entre la estabilización organomineral en la drilósfera artificial y el potencial efecto priming sobre el carbono nativo del subsuelo.`,
      `Mi experiencia de campo en geofísica ambiental e hidrología (campañas pesadas de prospección y medición in-situ de flujos de gases de efecto invernadero en turberas bajo condiciones meteorológicas rigurosas) me confiere total autonomía operativa en muestreos profundos de suelo y mantenimiento de sensores continuos. Estando radicado en Kiel, cuento con disponibilidad y vinculación inmediata para integrarme al equipo en Braunschweig.`,
      `Agradezco su atención y consideración. Quedo a su entera disposición para dialogar en detalle sobre mi propuesta y encaje técnico en el proyecto TechWorms.`
    ];
  } else {
    const expSnippetEs = topExp
      ? `En particular, mi labor en ${topExp.es.title} (${topExp.es.short || ''}) aporta respaldo empírico directo a estas competencias.`
      : '';
    const kwSnippetEs = matchedKeywords.length > 0
      ? `He contrastado los requisitos de la vacante con mi trayectoria acreditada en ${matchedKeywords.join(', ')}.`
      : '';
    const hooksSnippetEs = activeDossier?.technicalHooks?.length
      ? `Específicamente: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
      : '';

    bodyParagraphs = [
      `Me dirijo a ustedes para presentar mi candidatura al puesto de ${jobTitle} en ${companyName}${location ? ` (${location})` : ''}.`,
      `Mi perfil como Geofísico (Universidad de Chile, con distinción) y candidato a doble Máster en Ciencias en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia) combina trabajo cuantitativo de terreno y modelación con desarrollo de aplicaciones científicas y análisis de datos en R y Python. ${kwSnippetEs} ${expSnippetEs} ${hooksSnippetEs}`.trim(),
      activeDossier?.candidateValueThesis || `Aporto capacidad analítica avanzada y autonomía operativa en campo para resolver los retos técnicos del rol.`,
      'Agradezco su atención y quedo a su entera disposición para ampliar cualquier antecedente en una entrevista.'
    ];
  }

  const closing = `Atentamente,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
  const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Puesto:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();

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
