export interface PageDocInfo {
  pageId: string;
  title: string;
  version: string; // e.g. "v1.2.0"
  lastUpdated: string; // YYYY-MM-DD
  summary: string;
  userSteps: string[];
  featuresExplained: { feature: string; description: string }[];
  isObsoleteCandidate?: boolean;
}

export interface ContextHelpTopic {
  id: string;
  tabId: string;
  title: string;
  content: string;
  keyTakeaway: string;
}

export interface GuidedStep {
  targetId: string;
  title: string;
  content: string;
  tabId: string;
}
