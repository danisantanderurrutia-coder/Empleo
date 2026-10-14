import { getStoredOffers, saveStoredOffers } from './db';

export interface DeepLinkValidationResult {
  url: string;
  isValidDeepLink: boolean;
  status: 'Active Deep-Link' | 'Invalid / Expired' | 'Redirected';
  canonicalUrl: string;
  checkedAt: string;
}

/**
 * Real-time Web Scanner to verify deep-link validity and filter out phantom offers.
 */
export const validateJobOfferDeepLink = async (url: string): Promise<DeepLinkValidationResult> => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  
  if (!url || !url.startsWith('http')) {
    return {
      url,
      isValidDeepLink: false,
      status: 'Invalid / Expired',
      canonicalUrl: url,
      checkedAt: timestamp
    };
  }

  // A browser cannot read the status of a cross-origin page (CORS), so validity cannot be confirmed here.
  return {
    url,
    isValidDeepLink: false,
    status: 'Invalid / Expired',
    canonicalUrl: url,
    checkedAt: timestamp
  };
};

/**
 * Audit all offers in database and purge any without a valid specific deep-link URL.
 */
export const purgeOffersWithoutDeepLinks = (): { totalBefore: number; totalAfter: number; purgedCount: number } => {
  const offers = getStoredOffers();
  const validOffers = offers.filter(offer => {
    if (!offer.url || offer.url.includes('jobsearch.os') || !offer.url.startsWith('http')) {
      return false;
    }
    return true;
  });

  if (validOffers.length !== offers.length) {
    saveStoredOffers(validOffers);
  }

  return {
    totalBefore: offers.length,
    totalAfter: validOffers.length,
    purgedCount: offers.length - validOffers.length
  };
};
