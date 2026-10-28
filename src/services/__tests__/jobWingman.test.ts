import { describe, it, expect, beforeAll } from 'vitest';
import { getStoredDossiers, getDossierForOffer, THUENEN_TECHWORMS_DOSSIER, UBA_KILAB_DOSSIER } from '../jobWingmanService';
import { generateTailoredCoverLetter } from '../coverLetterCopilot';
import type { JobOffer } from '../../types/offers';

describe('Job Wingman Intelligence System', () => {
  beforeAll(() => {
    const store: Record<string, string> = {};
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => { store[key] = String(val); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k in store) delete store[k]; },
      length: 0,
      key: () => null
    } as unknown as Storage;
  });
  it('retrieves the canonical Thünen TechWorms dossier with Axel Don as lead', () => {
    const dossiers = getStoredDossiers();
    expect(dossiers.length).toBeGreaterThan(0);
    const thuenen = dossiers.find(d => d.id === THUENEN_TECHWORMS_DOSSIER.id);
    expect(thuenen).toBeDefined();
    expect(thuenen?.leadProfile.name).toBe('Axel Don');
    expect(thuenen?.leadProfile.email).toBe('axel.don@thuenen.de');
    expect(thuenen?.projectPainPoints.length).toBeGreaterThan(0);
    expect(thuenen?.technicalHooks.length).toBeGreaterThan(0);
  });

  it('matches a Thünen job offer to the canonical TechWorms dossier', () => {
    const mockOffer: Partial<JobOffer> = {
      id: 'job-thuenen-test',
      company: 'Johann Heinrich von Thünen-Institut',
      title: 'Wissenschaftliche*r Mitarbeiter*in TechWorms',
      rawDescription: 'Forschung zu Makroporen und Wurzelökologie.',
      requirements: ['R', 'RootBox']
    };
    const dossier = getDossierForOffer(mockOffer as JobOffer);
    expect(dossier.leadProfile.name).toBe('Axel Don');
    expect(dossier.coldApproachEmail.bodyDe).toContain('Sehr geehrter Herr Prof. Dr. Don');
    expect(dossier.coldApproachEmail.bodyEn).toContain('Dear Prof. Dr. Don');
  });

  it('generates a high-value tailored cover letter incorporating the PI and geophysical hooks', () => {
    const mockOffer: Partial<JobOffer> = {
      id: 'job-thuenen-techworms-369',
      company: 'Johann Heinrich von Thünen-Institut',
      title: 'Wissenschaftliche*r Mitarbeiter*in / Doktorand*in TechWorms',
      rawDescription: 'TechWorms Subsoil Carbon Sequestration RootBox',
      requirements: ['R', 'RootBox', 'Makroporen']
    };

    // Test German letter
    const letterDe = generateTailoredCoverLetter(
      mockOffer as JobOffer, 
      'de', 
      THUENEN_TECHWORMS_DOSSIER.leadProfile, 
      THUENEN_TECHWORMS_DOSSIER
    );
    expect(letterDe.salutation).toBe('Sehr geehrter Herr Prof. Dr. Don,');
    expect(letterDe.bodyParagraphs[0]).toContain('TechWorms');
    expect(letterDe.bodyParagraphs[1]).toContain('anisotropes poröses Medium');
    expect(letterDe.bodyParagraphs[2]).toContain('RootBox');

    // Test English letter
    const letterEn = generateTailoredCoverLetter(
      mockOffer as JobOffer, 
      'en', 
      THUENEN_TECHWORMS_DOSSIER.leadProfile, 
      THUENEN_TECHWORMS_DOSSIER
    );
    expect(letterEn.salutation).toBe('Dear Prof. Dr. Axel Don,');
    expect(letterEn.bodyParagraphs[1]).toContain('anisotropic, heterogeneous porous medium');

    // Test Spanish reference letter
    const letterEs = generateTailoredCoverLetter(
      mockOffer as JobOffer, 
      'es', 
      THUENEN_TECHWORMS_DOSSIER.leadProfile, 
      THUENEN_TECHWORMS_DOSSIER
    );
    expect(letterEs.salutation).toBe('Estimado Prof. Dr. Axel Don:');
    expect(letterEs.bodyParagraphs[1]).toContain('medio poroso anisótropo');
  });

  it('retrieves and matches UBA KI-Lab dossier (Interamt 1499096 / Kennziffer 8/LB/26)', () => {
    const ubaOffer: Partial<JobOffer> = {
      id: 'job-uba-ki-product-owner-1499096',
      company: 'Umweltbundesamt (UBA)',
      title: 'Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)',
      rawDescription: 'Anwendungslabor für Künstliche Intelligenz und Big Data Kennziffer 8/LB/26 Interamt 1499096 TVöD E 13',
      requirements: ['Scrum', 'KI', 'Product Owner']
    };

    const dossier = getDossierForOffer(ubaOffer as JobOffer);
    expect(dossier.id).toBe(UBA_KILAB_DOSSIER.id);
    expect(dossier.targetCompany).toContain('Umweltbundesamt');
    expect(dossier.technicalHooks.join(' ')).toContain('Wetland Monitor');
    expect(dossier.technicalHooks.join(' ')).toContain('AgriTwin');
    expect(dossier.technicalHooks.join(' ')).toContain('Rewilding Field Suite');

    // Test German Anschreiben incorporates the 3 digital twins / environmental apps
    const letterDe = generateTailoredCoverLetter(ubaOffer as JobOffer, 'de', dossier.leadProfile, dossier);
    expect(letterDe.bodyParagraphs[0]).toContain('8/LB/26');
    expect(letterDe.bodyParagraphs[0]).toContain('1499096');
    expect(letterDe.bodyParagraphs[2]).toContain('Wetland Monitor');
    expect(letterDe.bodyParagraphs[2]).toContain('AgriTwin');
    expect(letterDe.bodyParagraphs[2]).toContain('Rewilding Field Suite');
  });
});
