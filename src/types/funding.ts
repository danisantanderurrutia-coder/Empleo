export type FundingCategory = 'grant' | 'fellowship' | 'prize' | 'project';
export type FundingRegion = 'germany' | 'europe' | 'euskadi' | 'international';
export type FundingStatus = 'open' | 'upcoming' | 'rolling';

export interface FundingOpportunity {
  id: string;
  title: string;
  organization: string;
  category: FundingCategory;
  region: FundingRegion;
  amount: string;
  deadline: string;
  deadlineDays: number; // -1 if rolling
  status: FundingStatus;
  eligibility: string[];
  targetDisciplines: string[];
  officialUrl: string;
  description: string;
  strategicFit: string;
  isBookmarked?: boolean;
}
