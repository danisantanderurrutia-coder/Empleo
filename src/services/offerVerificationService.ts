import type { JobOffer } from '../types/offers';

export interface VerificationResult {
  isVerified: boolean;
  verificationStatus: 'Vigente y Verificada' | 'Pendiente' | 'Pendiente de Verificación Manual' | 'No Disponible / Caída' | 'Expirada';
  cleanedTitle: string;
  cleanedCompany: string;
  checkedAt: string;
  httpStatus?: number;
  reason?: string;
}

export interface IOfferVerifier {
  verifyOffer(offer: JobOffer): Promise<VerificationResult>;
  verifyOffersBatch(offers: JobOffer[]): Promise<JobOffer[]>;
}

/**
 * Offer Verification Service (Single Responsibility Principle: Strict Verification & Quality Control)
 * Strictly verifies link liveness. Unconfirmed links are marked 'Pendiente de Verificación Manual' (no false positives).
 */
export class OfferVerificationService implements IOfferVerifier {
  async verifyOffer(offer: JobOffer): Promise<VerificationResult> {
    return OfferVerificationService.verifyOfferStatic(offer);
  }

  async verifyOffersBatch(offers: JobOffer[]): Promise<JobOffer[]> {
    return OfferVerificationService.verifyOffersBatchStatic(offers);
  }

  static async verifyOfferStatic(offer: JobOffer): Promise<VerificationResult> {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Clean up Junk titles or trailing portal tags
    let cleanedTitle = offer.title
      .replace(/\s+/g, ' ')
      .replace(/\s*-\s*LinkedIn\s*/i, '')
      .replace(/\s*-\s*GreenJobs\s*/i, '')
      .trim();
    
    let cleanedCompany = offer.company
      .replace(/\s*\([^)]*\)/g, '')
      .trim() || 'Empresa Confidencial / Sector Ambiental';

    if (!offer.url || offer.url.startsWith('#') || offer.url.includes('example.com')) {
      return {
        isVerified: false,
        verificationStatus: 'No Disponible / Caída',
        cleanedTitle,
        cleanedCompany,
        checkedAt: timestamp,
        reason: 'URL no válida o incompleta'
      };
    }

    // Deadline Date & Expiration Verification
    const todayStr = new Date().toISOString().split('T')[0];
    let isExpired = false;
    let expirationReason = '';

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
        isExpired = true;
        expirationReason = `El plazo de presentación finalizó el ${deadlineClean} (Convocatoria Caducada)`;
      }
    }

    const fullOfferText = `${offer.title} ${offer.rawDescription} ${offer.url}`.toLowerCase();
    const EXPIRED_TERMS = [
      'plazo finalizado', 'convocatoria cerrada', 'plazo vencido', 'inscripción cerrada',
      'solicitudes cerradas', 'application closed', 'deadline passed', 'expired'
    ];

    if (!isExpired && EXPIRED_TERMS.some(term => fullOfferText.includes(term))) {
      isExpired = true;
      expirationReason = 'La oferta indica que el plazo de presentación de solicitudes ha finalizado';
    }

    if (isExpired) {
      return {
        isVerified: false,
        verificationStatus: 'Expirada',
        cleanedTitle,
        cleanedCompany,
        checkedAt: timestamp,
        reason: expirationReason
      };
    }

    try {
      const response = await fetch(`/api/check-link?url=${encodeURIComponent(offer.url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.alive) {
          return {
            isVerified: true,
            verificationStatus: 'Vigente y Verificada',
            cleanedTitle,
            cleanedCompany,
            checkedAt: timestamp,
            httpStatus: data.status || 200
          };
        } else {
          return {
            isVerified: false,
            verificationStatus: 'No Disponible / Caída',
            cleanedTitle,
            cleanedCompany,
            checkedAt: timestamp,
            reason: data.reason || 'Servidor remoto respondió con error 404 / 500'
          };
        }
      }
    } catch {
      // Unconfirmed network ping
    }

    // STRICT NO-FALSE-POSITIVE RULE: If HTTP ping fails or is unconfirmed, mark as 'Pendiente de Verificación Manual'
    const isUrlStructureValid = offer.url.startsWith('http://') || offer.url.startsWith('https://');
    return {
      isVerified: false, // NOT marked verified until human or HTTP confirms
      verificationStatus: isUrlStructureValid ? 'Pendiente de Verificación Manual' : 'No Disponible / Caída',
      cleanedTitle,
      cleanedCompany,
      checkedAt: timestamp,
      reason: 'Enlace estructurado pero requiere verificación manual del usuario en el portal'
    };
  }

  static async verifyOffersBatchStatic(offers: JobOffer[]): Promise<JobOffer[]> {
    return Promise.all(
      offers.map(async (offer) => {
        const result = await this.verifyOfferStatic(offer);
        return {
          ...offer,
          title: result.cleanedTitle,
          company: result.cleanedCompany,
          isVerified: result.isVerified,
          verificationStatus: result.verificationStatus,
          verifiedAt: result.checkedAt,
          httpStatus: result.httpStatus,
          verificationReason: result.reason
        };
      })
    );
  }
}
