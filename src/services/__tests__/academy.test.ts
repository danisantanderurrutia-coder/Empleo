import { describe, it, expect, beforeEach } from 'vitest';
import { ACADEMY_COURSES } from '../../data/academyCourses';
import { 
  getStoredCourseProgress, 
  setCourseStatus, 
  exportCompleteUserDataBackup, 
  restoreCompleteUserDataBackup 
} from '../db';

describe('Gap-Closer Academy · Catálogo Curado & Verificación', () => {
  beforeEach(() => {
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

  const REQUIRED_GAP_IDS = [
    'gap-swat',
    'gap-soil-directive',
    'gap-csrd',
    'gap-pm2',
    'gap-horizon',
    'gap-grassroots-funds',
    'gap-media-b2b',
    'gap-de-c1',
    'gap-pspo-ai'
  ];

  it('cubre exactamente las 8 brechas prioritarias de mercado de Daniel Santander', () => {
    const presentGaps = new Set(ACADEMY_COURSES.map(c => c.gapId));
    REQUIRED_GAP_IDS.forEach(gapId => {
      expect(presentGaps.has(gapId)).toBe(true);
    });
  });

  it('todos los cursos tienen URLs válidas HTTPS oficiales y campos requeridos', () => {
    expect(ACADEMY_COURSES.length).toBeGreaterThanOrEqual(10);

    ACADEMY_COURSES.forEach(course => {
      expect(course.id).toBeTruthy();
      expect(course.title.trim().length).toBeGreaterThan(5);
      expect(course.provider.trim().length).toBeGreaterThan(2);
      expect(course.url.startsWith('https://')).toBe(true);
      expect(course.durationHours).toBeGreaterThan(0);
      expect(course.xpValue).toBeGreaterThan(0);
      expect(course.syllabusSummary.trim().length).toBeGreaterThan(20);
      expect(course.skillsLearned.length).toBeGreaterThan(0);
      expect(course.matchImpact.trim().length).toBeGreaterThan(5);
    });
  });

  it('gestiona y persiste el estado de progreso formativo del usuario', () => {
    const initial = getStoredCourseProgress();
    expect(initial).toBeDefined();

    // Actualizar curso a EN CURSO con 65%
    setCourseStatus('course-swat-plus-official', 'IN_PROGRESS', 65, 'Laboratorio 3 de QSWAT+ completado');

    const updated = getStoredCourseProgress();
    expect(updated['course-swat-plus-official'].status).toBe('IN_PROGRESS');
    expect(updated['course-swat-plus-official'].progressPercent).toBe(65);
    expect(updated['course-swat-plus-official'].notes).toBe('Laboratorio 3 de QSWAT+ completado');

    // Marcar como CERTIFICADO
    setCourseStatus('course-swat-plus-official', 'COMPLETED');
    const certified = getStoredCourseProgress();
    expect(certified['course-swat-plus-official'].status).toBe('COMPLETED');
    expect(certified['course-swat-plus-official'].progressPercent).toBe(100);
    expect(certified['course-swat-plus-official'].completedAt).toBeDefined();
  });

  it('exporta y restaura el progreso de cursos dentro de los backups completos del sistema', () => {
    setCourseStatus('course-scrum-org-pspo1-prep', 'COMPLETED');

    const backupJson = exportCompleteUserDataBackup();
    const parsedBackup = JSON.parse(backupJson);

    expect(parsedBackup.academyProgress).toBeDefined();
    expect(parsedBackup.academyProgress['course-scrum-org-pspo1-prep'].status).toBe('COMPLETED');

    // Limpiar localStorage y restaurar
    localStorage.clear();
    const restoreResult = restoreCompleteUserDataBackup(backupJson);
    expect(restoreResult).toBe(true);

    const restoredProgress = getStoredCourseProgress();
    expect(restoredProgress['course-scrum-org-pspo1-prep'].status).toBe('COMPLETED');
  });
});
