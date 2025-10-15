export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  court: string;
  dateOfJudgment: string;
  judges: string[];
  parties: {
    petitioner: string;
    respondent: string;
  };
  summary: string;
  category: string;
  citation: string;
  status: string;
  pdfUrl?: string;
}

export interface SearchFilters {
  court?: string;
  year?: number;
  category?: string;
  judge?: string;
  bench?: string;
}

export interface SearchResult {
  totalResults: number;
  cases: Case[];
  currentPage: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionType: 'free' | 'premium' | 'professional';
  avatar?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Search: { query?: string; filters?: SearchFilters };
  CaseDetail: { caseId: string; case?: Case };
  Judgment: { caseData?: any };
  Citation: undefined;
  Profile: undefined;
};

