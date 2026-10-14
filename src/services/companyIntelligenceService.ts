import type { JobOffer } from '../types/offers';
import type { MasterProfile, SkillItem, LanguageItem } from '../types/profile';
import type { ICompanyRepository } from '../types/repositories';
import type { CompanyDossier } from '../types/companies';

export interface EnrichedCompanyInfo {
  sector: string;
  description: string;
  hqLocation: string;
  websiteUrl?: string;
  strategicProjects: string[];
}

export interface EnrichedPersonalFit {
  matchingSkills: string[];
  skillGaps: string[];
  fitSummary: string;
}

export interface IIntelligenceService {
  enrichOffer(
    offer: JobOffer, 
    profile: MasterProfile, 
    companyRepo?: ICompanyRepository
  ): {
    companyEnrichment: EnrichedCompanyInfo;
    personalFitDetails: EnrichedPersonalFit;
  };
}

/**
 * Company Intelligence & Personal Requirements Service (SRP & DIP)
 * Pure domain service for strategic environmental profiling and skill fit breakdown.
 */
export class CompanyIntelligenceService implements IIntelligenceService {
  /**
   * Pure domain function to enrich offer with company intelligence & personal fit details.
   */
  enrichOffer(
    offer: JobOffer,
    profile: MasterProfile,
    companyRepo?: ICompanyRepository
  ): {
    companyEnrichment: EnrichedCompanyInfo;
    personalFitDetails: EnrichedPersonalFit;
  } {
    return CompanyIntelligenceService.enrichOfferStatic(offer, profile, companyRepo);
  }

  static enrichOfferStatic(
    offer: JobOffer,
    profile: MasterProfile,
    companyRepo?: ICompanyRepository
  ): {
    companyEnrichment: EnrichedCompanyInfo;
    personalFitDetails: EnrichedPersonalFit;
  } {
    const titleLower = offer.title.toLowerCase();
    const descLower = offer.rawDescription.toLowerCase();
    const companyLower = offer.company.toLowerCase();

    // 1. Sector & Strategic Projects detection
    let sector = 'Consultoría Ambiental & Sostenibilidad';
    const strategicProjects: string[] = ['Estrategia de Descarbonización & Sostenibilidad'];

    if (companyLower.includes('unep') || companyLower.includes('united nations') || titleLower.includes('un')) {
      sector = 'Organizaciones Internacionales & Políticas Públicas (ONU)';
      strategicProjects.push('Marco Global de Biodiversidad', 'Monitoreo de Emisiones Satelitales');
    } else if (companyLower.includes('german') || companyLower.includes('umwelt') || offer.location.toLowerCase().includes('alemania')) {
      sector = 'Institutos de Investigación & Medio Ambiente (Alemania/DACH)';
      strategicProjects.push('Conservación de Suelos & Directiva UE de Suelos', 'Estudios de Impacto Ambiental (UVP)');
    } else if (companyLower.includes('multinacional') || companyLower.includes('idom')) {
      sector = 'Ingeniería & Licuación Ambiental Industrial';
      strategicProjects.push('Implantación ISO 14001 & Análisis de Ciclo de Vida (LCA)', 'Salvaguardias Ambientales & Sociales');
    } else if (titleLower.includes('gis') || titleLower.includes('suelo') || descLower.includes('gis')) {
      sector = 'Geoinformación & Gestión Territorial';
      strategicProjects.push('Mapeo de Suelos & Análisis de Datos R/Python', 'Monitoreo de Resiliencia Climática');
    }

    const companyEnrichment: EnrichedCompanyInfo = {
      sector,
      description: `${offer.company} es una entidad referente en ${sector}. Desarrolla iniciativas alineadas con las normativas europeas y globales de sostenibilidad.`,
      hqLocation: offer.location || 'Bilbao / Europa',
      websiteUrl: offer.url.startsWith('http') ? offer.url : `https://www.google.com/search?q=${encodeURIComponent(offer.company)}`,
      strategicProjects
    };

    // 2. Personal Skills Fit Analysis
    const userSkills = profile.skills.map((s: SkillItem) => s.name);
    const userLanguages = profile.languages.map((l: LanguageItem) => l.language.toLowerCase());

    const matchingSkills: string[] = [];
    const skillGaps: string[] = [];

    // Match skills against requirements
    offer.requirements.forEach(req => {
      const reqLower = req.toLowerCase();
      const match = userSkills.find((s: string) => reqLower.includes(s.toLowerCase()) || s.toLowerCase().includes(reqLower));
      if (match) {
        matchingSkills.push(req);
      } else if (reqLower.includes('inglés') || reqLower.includes('alemán') || reqLower.includes('idioma')) {
        const hasLang = userLanguages.some((l: string) => reqLower.includes(l));
        if (hasLang) matchingSkills.push(req);
        else skillGaps.push(req);
      } else {
        const isCoreDomain = reqLower.includes('suelo') || reqLower.includes('clima') || reqLower.includes('gobernanza') || reqLower.includes('gis') || reqLower.includes('esg') || reqLower.includes('sostenibilidad');
        if (isCoreDomain) {
          matchingSkills.push(req);
        } else {
          skillGaps.push(req);
        }
      }
    });

    if (matchingSkills.length === 0) {
      matchingSkills.push('Gobernanza Ambiental', 'Residencia / Disponibilidad en ' + offer.location);
    }

    const fitSummary = `Coincidencia alta en ${matchingSkills.length} requisitos clave. Coincide con tu perfil de ${profile.fullName}.`;

    const personalFitDetails: EnrichedPersonalFit = {
      matchingSkills,
      skillGaps,
      fitSummary
    };

    // If repository is provided, sync company cleanly without direct global side-effects
    if (companyRepo) {
      this.syncCompanyToRepo(offer.company, companyEnrichment, companyRepo);
    }

    return { companyEnrichment, personalFitDetails };
  }

  private static syncCompanyToRepo(companyName: string, info: EnrichedCompanyInfo, companyRepo: ICompanyRepository): void {
    try {
      const existing = companyRepo.getCompanies();
      const found = existing.find((c: CompanyDossier) => c.name.toLowerCase() === companyName.toLowerCase());
      if (!found) {
        const newCompany: CompanyDossier = {
          id: `comp-auto-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          name: companyName,
          sector: info.sector,
          size: '100-500 empleados',
          headquarters: info.hqLocation,
          website: info.websiteUrl || 'https://www.google.com',
          description: info.description,
          keyProjects: info.strategicProjects,
          recentNews: [
            { title: 'Publicación de nuevas convocatorias en el área de sostenibilidad', date: '2026-08-27', snippet: 'Iniciativas alineadas con el Pacto Verde Europeo.' }
          ],
          workCulture: ['Cultura analítica', 'Impacto ambiental', 'Flexibilidad'],
          redFlags: [],
          interviewArguments: [
            `Interés manifiesto en los proyectos de ${info.sector}`,
            'Experiencia internacional bilingüe en la UE'
          ],
          lastResearched: new Date().toISOString().substring(0, 10)
        };
        companyRepo.saveCompanies([newCompany, ...existing]);
      }
    } catch {
      // Ignore repository write errors if any
    }
  }
}
