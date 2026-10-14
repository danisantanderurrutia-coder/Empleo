import { describe, it, expect } from 'vitest';
import { parseCVWithAntigravity } from '../antigravityEngine';

describe('parseCVWithAntigravity', () => {
  it('extracts email, phone, and name from text without inventing experiences', () => {
    const rawCv = `
      María García López
      maria.garcia@example.com | +34 612 345 678
      Ingeniera de software con 5 años de experiencia en desarrollo web.
    `;

    const result = parseCVWithAntigravity(rawCv);
    expect(result.fullName).toBe('María García López');
    expect(result.email).toBe('maria.garcia@example.com');
    expect(result.phone).toBe('+34 612 345 678');
    expect(result.summary).toContain('Ingeniera de software');
    // Crucial anti-theater verification: no fabricated experiences, education or skills!
    expect(result.experiences.length).toBe(0);
    expect(result.education.length).toBe(0);
    expect(result.skills.length).toBe(0);
  });

  it('does not return hardcoded identity for names containing santander or geofisico', () => {
    const rawCv = `
      Alberto Santander
      alberto.santander@univ.es
      Investigador geofísico en sismología.
    `;

    const result = parseCVWithAntigravity(rawCv);
    expect(result.fullName).toBe('Alberto Santander');
    expect(result.email).toBe('alberto.santander@univ.es');
    expect(result.email).not.toBe('danisantander.urrutia@gmail.com');
    expect(result.experiences.length).toBe(0);
  });
});
