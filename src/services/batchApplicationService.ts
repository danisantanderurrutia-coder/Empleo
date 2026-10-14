import type { JobOffer } from '../types/offers';
import type { ApplicationItem } from '../types/applications';
import type { MasterProfile } from '../types/profile';
import type { IApplicationRepository, IProfileRepository } from '../types/repositories';
import { generateTailoredCoverLetter } from './coverLetterCopilot';
import { LocalStorageApplicationRepository, LocalStorageProfileRepository } from './repositories/localStorageRepositories';

/**
 * Generate tailored CV highlights for a specific offer and company.
 */
export const generateTailoredCV = (profile: MasterProfile, offerTitle: string, company: string) => {
  return {
    highlights: [
      `Enfoque en ${offerTitle}: Destacada experiencia en R, Python, QGIS y Google Earth Engine.`,
      `Alineación estratégica con ${company}: Doble Máster en Alemania y Polonia en Gestión y Protección Ambiental.`,
      `Gobernanza Socio-Ecológica: Facilitación de mesas de diálogo multi-actor y redacción de informes normativos.`,
      `Sede en Bilbao (${profile.location}): Disponibilidad técnica inmediata y movilidad profesional.`
    ]
  };
};

export interface IBatchApplicationService {
  prepareApplicationDraft(offer: JobOffer): Promise<ApplicationItem>;
  prepareBatchDrafts(offers: JobOffer[]): Promise<ApplicationItem[]>;
  approveBatchApplications(appIds: string[]): ApplicationItem[];
  dispatchBatchApplications(appIds: string[]): { dispatchedCount: number; updatedApplications: ApplicationItem[] };
}

/**
 * Batch Application Service (SRP & DIP: Domain Generator & Repository-backed Review Manager)
 * Handles batch generation of adapted CVs and Cover Letters, batch approval, and assisted dispatch.
 */
export class BatchApplicationService implements IBatchApplicationService {
  private appRepo: IApplicationRepository;
  private profileRepo: IProfileRepository;

  constructor(
    appRepo?: IApplicationRepository,
    profileRepo?: IProfileRepository
  ) {
    this.appRepo = appRepo || new LocalStorageApplicationRepository();
    this.profileRepo = profileRepo || new LocalStorageProfileRepository();
  }

  /**
   * Auto-generate application draft (CV + Cover Letter) for an offer.
   */
  async prepareApplicationDraft(offer: JobOffer): Promise<ApplicationItem> {
    const profile = this.profileRepo.getProfile();
    const existingApps = this.appRepo.getApplications();
    const existing = existingApps.find(a => a.offerId === offer.id || a.offerTitle.toLowerCase() === offer.title.toLowerCase());

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 10);
    const fullTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Generate Tailored Cover Letter
    const coverLetterObj = generateTailoredCoverLetter(offer, 'es');
    const coverLetterText = coverLetterObj.fullMarkdown;

    // Generate Tailored CV content summary
    const tailoredCV = generateTailoredCV(profile, offer.title, offer.company);

    const appId = existing ? existing.id : `CAND-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const applicationItem: ApplicationItem = {
      id: appId,
      offerId: offer.id,
      offerTitle: offer.title,
      companyName: offer.company,
      location: offer.location,
      currentStage: existing ? existing.currentStage : 6, // Stage 6: Revisión Final / Borrador Listo
      status: 'En Progreso',
      createdDate: existing ? existing.createdDate : timestamp,
      updatedDate: timestamp,
      cvVersionId: `cv-version-${offer.id}`,
      cvVersionName: `CV Adaptado - ${offer.company}`,
      coverLetter: coverLetterText,
      offerUrl: offer.url,
      isBatchApproved: existing?.isBatchApproved || false,
      batchReviewStatus: existing?.batchReviewStatus || 'Borrador Generado',
      adaptedCvSummary: tailoredCV.highlights,
      humanApprovalGranted: existing?.humanApprovalGranted || false,
      formDraft: {
        'nombre_completo': profile.fullName,
        'email': profile.email,
        'telefono': profile.phone,
        'ubicacion_actual': profile.location,
        'perfil_linkedin': profile.linkedin,
        'carta_presentacion': coverLetterText
      },
      history: existing ? existing.history : [
        {
          id: `hist-${Date.now()}-1`,
          timestamp: fullTimestamp,
          stage: 1,
          title: 'Búsqueda & Verificación Completada',
          note: 'Oferta verificada y filtrada con score alto.',
          actor: 'Agente IA'
        },
        {
          id: `hist-${Date.now()}-2`,
          timestamp: fullTimestamp,
          stage: 6,
          title: 'Borrador de CV y Carta Generado (Fase 6: Revisión Final)',
          note: 'Documentos personalizados preparados para revisión en lote.',
          actor: 'Agente IA'
        }
      ]
    };

    // Save/update via repository abstraction
    const otherApps = existingApps.filter(a => a.id !== appId);
    this.appRepo.saveApplications([applicationItem, ...otherApps]);

    return applicationItem;
  }

  /**
   * Bulk prepare drafts for multiple verified offers.
   */
  async prepareBatchDrafts(offers: JobOffer[]): Promise<ApplicationItem[]> {
    const results: ApplicationItem[] = [];
    for (const offer of offers) {
      const app = await this.prepareApplicationDraft(offer);
      results.push(app);
    }
    return results;
  }

  /**
   * Approve a list of application IDs ("Batch OK").
   */
  approveBatchApplications(appIds: string[]): ApplicationItem[] {
    const apps = this.appRepo.getApplications();
    const updated = apps.map(app => {
      if (appIds.includes(app.id)) {
        return {
          ...app,
          isBatchApproved: true,
          humanApprovalGranted: true,
          batchReviewStatus: 'Aprobado Listo para Enviar' as const,
          updatedDate: new Date().toISOString().replace('T', ' ').substring(0, 10)
        };
      }
      return app;
    });
    this.appRepo.saveApplications(updated);
    return updated;
  }

  /**
   * Assisted Dispatch: Move approved applications to Stage 7 (Enviada/Aprobada) upon user confirmation.
   */
  dispatchBatchApplications(appIds: string[]): { dispatchedCount: number; updatedApplications: ApplicationItem[] } {
    const apps = this.appRepo.getApplications();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 10);
    const fullTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let count = 0;
    const updated = apps.map(app => {
      if (appIds.includes(app.id)) {
        count++;
        return {
          ...app,
          currentStage: 7 as const, // Stage 7: Enviar (Aprobado)
          status: 'Enviada' as const,
          batchReviewStatus: 'Despachado' as const,
          humanApprovalGranted: true,
          approvalTimestamp: fullTimestamp,
          updatedDate: timestamp,
          history: [
            ...app.history,
            {
              id: `hist-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              timestamp: fullTimestamp,
              stage: 7 as const,
              title: 'Candidatura Enviada (Despacho Asistido)',
              note: 'Envío en portal de la empresa confirmado por el usuario.',
              actor: 'Usuario' as const
            }
          ]
        };
      }
      return app;
    });

    this.appRepo.saveApplications(updated);
    return { dispatchedCount: count, updatedApplications: updated };
  }

  // Static helper wrappers for backwards compatibility
  static async prepareApplicationDraftStatic(offer: JobOffer): Promise<ApplicationItem> {
    return new BatchApplicationService().prepareApplicationDraft(offer);
  }

  static async prepareBatchDraftsStatic(offers: JobOffer[]): Promise<ApplicationItem[]> {
    return new BatchApplicationService().prepareBatchDrafts(offers);
  }

  static approveBatchApplicationsStatic(appIds: string[]): ApplicationItem[] {
    return new BatchApplicationService().approveBatchApplications(appIds);
  }

  static dispatchBatchApplicationsStatic(appIds: string[]): { dispatchedCount: number; updatedApplications: ApplicationItem[] } {
    return new BatchApplicationService().dispatchBatchApplications(appIds);
  }
}
