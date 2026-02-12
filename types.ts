
export enum UserRole {
  INDIVIDUAL = 'INDIVIDUAL',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  twinMaturity: number; // 0-100
  earnings: number;
  industries: string[];
  personality: string;
  values: string;
  habits: string;
  avatarUrl?: string; // Generated avatar
  verticalExpertise?: Record<string, string>;
  // New survey fields
  surveyAnswers?: Record<string, string>;
}

export interface VirtualMerchant {
  id: string;
  name: string;
  industry: string;
  logoColor: string;
  intent: string; // What they want to know
}

export interface InteractionLog {
  merchantName: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface ResearchInquiry {
  industry: string;
  question: string;
  audienceFilter: string;
}

export interface SimulationResult {
  personaName: string;
  response: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  fidelityScore: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SynthesisReport {
  executiveSummary: string;
  behavioralInsights: string[];
  demographicPatterns: string;
  strategicRecommendations: string[];
  sources?: GroundingSource[];
}
