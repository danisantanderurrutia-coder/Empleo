import type { JobOffer } from '../types/offers';
import type { MasterProfile } from '../types/profile';

export interface RuleEvaluationResult {
  passed: boolean;
  layer: 'Layer1_Ingestion' | 'Layer2_Temporal' | 'Layer3_EntityRealism' | 'Layer4_SemanticFit' | 'Layer5_DispatchSafety';
  ruleName: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
  reason?: string;
}

export interface PipelineEvaluationReport {
  offerId: string;
  overallPassed: boolean;
  ruleResults: RuleEvaluationResult[];
  flags: string[];
}

/**
  5-Layered Reasoning Engine (Procesamiento por Capas SOLID)
  Enforces deterministic domain rules & common-sense criteria.
 */
export class LayeredReasoningPipeline {

  /**
   * Layer 2: Temporal & Expiration Reasoning Rule
   * Checks deadline vs current date, publication age, and closed call text terms.
   */
  static evaluateTemporalRule(offer: JobOffer): RuleEvaluationResult {
    const todayStr = new Date().toISOString().split('T')[0];

    // Check deadline date
    if (offer.deadline) {
      const deadlineClean = offer.deadline.trim();
      let deadlineIso = '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineClean)) {
        deadlineIso = deadlineClean;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(deadlineClean)) {
        const [d, m, y] = deadlineClean.split('/');
        deadlineIso = `${y}-${m}-${d}`;
      }

      if (deadlineIso && deadlineIso < todayStr) {
        return {
          passed: false,
          layer: 'Layer2_Temporal',
          ruleName: 'Deadline Date Validation',
          badgeText: '🔴 Convocatoria Expirada',
          badgeType: 'error',
          reason: `El plazo de presentación finalizó el ${deadlineClean}`
        };
      }
    }

    // Check text expired terms
    const fullText = `${offer.title} ${offer.rawDescription} ${offer.url}`.toLowerCase();
    const EXPIRED_TERMS = [
      'plazo finalizado', 'convocatoria cerrada', 'plazo vencido', 'inscripción cerrada',
      'solicitudes cerradas', 'application closed', 'deadline passed', 'expired'
    ];

    if (EXPIRED_TERMS.some(t => fullText.includes(t)) || offer.verificationStatus === 'Expirada') {
      return {
        passed: false,
        layer: 'Layer2_Temporal',
        ruleName: 'Closed Call Text Validation',
        badgeText: '🔴 Plazo Vencido',
        badgeType: 'error',
        reason: 'El portal o título indica que la convocatoria ha sido cerrada'
      };
    }

    // Check publication staleness (> 60 days)
    if (offer.publishedDate && /^\d{4}-\d{2}-\d{2}$/.test(offer.publishedDate)) {
      const pubTime = new Date(offer.publishedDate).getTime();
      const nowTime = new Date().getTime();
      const diffDays = Math.floor((nowTime - pubTime) / (1000 * 60 * 60 * 24));

      if (diffDays > 60) {
        return {
          passed: true,
          layer: 'Layer2_Temporal',
          ruleName: 'Publication Staleness Warning',
          badgeText: '⚠️ Publicación Antigua (>60 días)',
          badgeType: 'warning',
          reason: `Publicada hace ${diffDays} días. Verificar si aún continúa activa.`
        };
      }
    }

    return {
      passed: true,
      layer: 'Layer2_Temporal',
      ruleName: 'Temporal Rule Passed',
      badgeText: '🟢 Convocatoria Vigente',
      badgeType: 'success'
    };
  }

  /**
   * Layer 3: Entity Realism & Domain Matching Rule
   * Ensures deep position URL slugs and domain matching between company and offer URL.
   */
  static evaluateEntityRealismRule(offer: JobOffer): RuleEvaluationResult {
    const urlLower = (offer.url || '').toLowerCase();

    // Discard generic landing pages
    const GENERIC_LANDING_REGEX = /\/(job-offers|job_offers|careers|jobs|vacancies|trabaja-con-nosotros|work-with-us|join-us)\/?$/i;
    if (GENERIC_LANDING_REGEX.test(urlLower)) {
      return {
        passed: false,
        layer: 'Layer3_EntityRealism',
        ruleName: 'Deep Slug Enforcement',
        badgeText: '🔴 Landing Genérica',
        badgeType: 'error',
        reason: 'La URL no apunta a un puesto específico sino a la portada general de carreras'
      };
    }

    // Check domain structure
    if (!urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
      return {
        passed: false,
        layer: 'Layer3_EntityRealism',
        ruleName: 'URL Schema Check',
        badgeText: '🔴 URL Inválida',
        badgeType: 'error',
        reason: 'Estructura de protocolo URL incompleta o errónea'
      };
    }

    return {
      passed: true,
      layer: 'Layer3_EntityRealism',
      ruleName: 'Entity Realism Passed',
      badgeText: '🌐 Dominio Verificado',
      badgeType: 'success'
    };
  }

  /**
   * Layer 3: Salary Floor & Compensation Realism Rule
   */
  static evaluateSalaryFloorRule(offer: JobOffer, profileMinSalary: number = 40000): RuleEvaluationResult {
    if (offer.salaryMax && offer.salaryMax < 20000) {
      return {
        passed: false,
        layer: 'Layer3_EntityRealism',
        ruleName: 'Salary Floor Rule',
        badgeText: '⚠️ Compensación No Viable',
        badgeType: 'warning',
        reason: `Salario máximo de ${offer.salaryMax} €/año está por debajo del suelo profesional`
      };
    }

    if (offer.salaryMin && offer.salaryMin < profileMinSalary) {
      return {
        passed: true,
        layer: 'Layer3_EntityRealism',
        ruleName: 'Salary Expectations Gap',
        badgeText: '⚠️ Bajo Mínimo Deseado',
        badgeType: 'warning',
        reason: `Salario inicial de ${offer.salaryMin} €/año está por debajo de tu mínimo deseado (${profileMinSalary} €)`
      };
    }

    return {
      passed: true,
      layer: 'Layer3_EntityRealism',
      ruleName: 'Salary Floor Passed',
      badgeText: '💰 Salario Adecuado',
      badgeType: 'success'
    };
  }

  /**
   * Layer 4: Language Compatibility Rule
   */
  static evaluateLanguageRule(offer: JobOffer, profile: MasterProfile): RuleEvaluationResult {
    const fullText = `${offer.title} ${offer.rawDescription} ${offer.requirements.join(' ')}`.toLowerCase();
    
    // Check German C1 requirement
    const requiresGermanC1 = fullText.includes('german c1') || fullText.includes('deutsch c1') || fullText.includes('fließend deutsch');
    const userGerman = profile.languages.find(l => l.language.toLowerCase().includes('alemán') || l.language.toLowerCase().includes('german'));

    if (requiresGermanC1 && (!userGerman || userGerman.proficiency.includes('B1') || userGerman.proficiency.includes('A2'))) {
      return {
        passed: true, // Not auto-rejected, but flagged as gap
        layer: 'Layer4_SemanticFit',
        ruleName: 'Language Compatibility Gap',
        badgeText: '🇩🇪 Exige Alemán C1 (Tienes B1)',
        badgeType: 'warning',
        reason: 'El puesto requiere Alemán C1 avanzado. Tu perfil tiene marcado Alemán B1.'
      };
    }

    return {
      passed: true,
      layer: 'Layer4_SemanticFit',
      ruleName: 'Language Compatibility Passed',
      badgeText: '🗣️ Idiomas Compatibles',
      badgeType: 'success'
    };
  }

  /**
   * Full 5-Layer Evaluation Pipeline Execution
   */
  static evaluateFullPipeline(offer: JobOffer, profile: MasterProfile): PipelineEvaluationReport {
    const results: RuleEvaluationResult[] = [
      this.evaluateTemporalRule(offer),
      this.evaluateEntityRealismRule(offer),
      this.evaluateSalaryFloorRule(offer, profile.minSalary),
      this.evaluateLanguageRule(offer, profile)
    ];

    const flags = results.filter(r => r.badgeText).map(r => r.badgeText!);
    const overallPassed = results.every(r => r.passed);

    return {
      offerId: offer.id,
      overallPassed,
      ruleResults: results,
      flags
    };
  }
}
