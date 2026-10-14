import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '../matchEngine';
import type { MasterProfile } from '../../types/profile';
import type { JobOffer } from '../../types/offers';

const createMockProfile = (overrides?: Partial<MasterProfile>): MasterProfile => ({
  fullName: 'Test Candidate',
  email: 'test@example.com',
  phone: '+34 600 000 000',
  location: 'Bilbao, España',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: 'Perfil de prueba para tests unitarios',
  preferredCity: 'Bilbao',
  locationPreferences: [
    { city: 'Bilbao', country: 'España', isPreferredHome: true, scoreMultiplier: 1.0, openToRemote: true, openToRelocation: false }
  ],
  targetRoles: [
    { id: 'tr-1', title: 'Senior Developer', minSalaryExpected: 40000, desiredSalary: 50000, seniorityLevel: 'Senior', keywords: ['TypeScript', 'React'] }
  ],
  minSalary: 40000,
  desiredSalary: 50000,
  experiences: [],
  education: [],
  skills: [
    { id: 'sk-1', name: 'TypeScript', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 },
    { id: 'sk-2', name: 'React', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 },
    { id: 'sk-3', name: 'Node.js', category: 'Tech', level: 'Intermedio', yearsOfExperience: 2 }
  ],
  languages: [],
  achievementsBank: [],
  pendingFields: [],
  lastUpdated: '2026-10-14',
  ...overrides
});

describe('calculateMatchScore', () => {
  it('returns 0 score when there is no match or evidence', () => {
    const profile = createMockProfile({
      skills: [{ id: 'sk-1', name: 'Fortran', category: 'Tech', level: 'Avanzado', yearsOfExperience: 5 }],
      locationPreferences: []
    });

    const offer: Partial<JobOffer> = {
      title: 'Marketing Specialist',
      rawDescription: 'Se busca experto en publicidad digital en Valencia.',
      location: 'Valencia',
      requirements: ['SEO', 'SEM']
    };

    const breakdown = calculateMatchScore(offer, profile);
    expect(breakdown.totalScore).toBe(0);
    expect(breakdown.matchingSkills.length).toBe(0);
    expect(breakdown.skillFitScore).toBe(0);
    expect(breakdown.locationScore).toBe(0);
    expect(breakdown.salaryScore).toBe(0);
  });

  it('correctly scores matching skills without artificial floor', () => {
    const profile = createMockProfile();
    const offer: Partial<JobOffer> = {
      title: 'Fullstack React & TypeScript Engineer',
      rawDescription: 'Desarrollo web moderno con React y TypeScript en frontend.',
      location: 'Bilbao',
      requirements: ['React', 'TypeScript']
    };

    const breakdown = calculateMatchScore(offer, profile);
    expect(breakdown.matchingSkills).toContain('React');
    expect(breakdown.matchingSkills).toContain('TypeScript');
    expect(breakdown.skillFitScore).toBeGreaterThan(0);
    expect(breakdown.locationScore).toBeGreaterThan(0);
  });

  it('correctly scores salary based on candidate profile limits', () => {
    const profile = createMockProfile({ minSalary: 40000, desiredSalary: 50000 });

    const lowOffer: Partial<JobOffer> = { salaryMin: 30000 };
    const lowScore = calculateMatchScore(lowOffer, profile);
    expect(lowScore.salaryScore).toBe(0);

    const midOffer: Partial<JobOffer> = { salaryMin: 42000 };
    const midScore = calculateMatchScore(midOffer, profile);
    expect(midScore.salaryScore).toBe(10);

    const highOffer: Partial<JobOffer> = { salaryMin: 55000 };
    const highScore = calculateMatchScore(highOffer, profile);
    expect(highScore.salaryScore).toBe(15);
  });
});
