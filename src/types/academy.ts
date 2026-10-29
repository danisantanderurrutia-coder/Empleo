export type CourseCostType = 'FREE' | 'EU_SUBSIDIZED' | 'FREE_AUDIT' | 'OFFICIAL_EXAM';
export type CourseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export type AcademyBranch = 
  | 'geophysics'
  | 'biogeo'
  | 'software'
  | 'pm'
  | 'grassroots'
  | 'culture'
  | 'comms'
  | 'languages';

export interface AcademyCourse {
  id: string;
  title: string;
  provider: string;
  branch: AcademyBranch;
  branchName: string;
  isMarketGap?: boolean;
  gapId?: string;
  gapName?: string;
  costType: CourseCostType;
  costLabel: string;
  durationHours: number;
  certificationType: string;
  url: string;
  syllabusSummary: string;
  difficulty: CourseDifficulty;
  matchImpact: string;
  skillsLearned: string[];
  languages: ('ES' | 'EN' | 'DE')[];
  badgeIcon?: string;
  xpValue: number;
}

export interface UserCourseProgress {
  courseId: string;
  status: CourseStatus;
  progressPercent: number; // 0 - 100
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  certificateRef?: string;
}
