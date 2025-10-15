export const COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#000000',
  gray: '#757575',
  lightGray: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  text: '#333333',
  textSecondary: '#666666',
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};

export const COURTS = [
  'Supreme Court',
  'High Court',
  'District Court',
  'Family Court',
  'Consumer Court',
  'Labour Court',
  'Administrative Tribunal',
];

export const CASE_CATEGORIES = [
  'Civil Rights',
  'Constitutional Law',
  'Criminal Law',
  'Corporate Law',
  'Family Law',
  'Employment Law',
  'Intellectual Property',
  'Environmental Law',
  'Tax Law',
  'Real Estate Law',
];

export const SAMPLE_CASES: any[] = [
  {
    id: '1',
    title: 'State of Maharashtra vs. Bhimla Ram',
    caseNumber: 'CA 1234 of 2024',
    court: 'Supreme Court',
    dateOfJudgment: '2024-01-15',
    judges: ['Justice A.K. Mishra', 'Justice K.S. Roshan Singh'],
    parties: {
      petitioner: 'State of Maharashtra',
      respondent: 'Bhimla Ram',
    },
    summary: 'Landmark judgment on environmental conservation with significant implications for sustainable development policies.',
    category: 'Environmental Law',
    citation: 'AIR 2024 SC 1234',
    status: 'Disposed',
  },
  {
    id: '2',
    title: 'ABC Corp vs. XYZ Ltd',
    caseNumber: 'CS 5678 of 2024',
    court: 'High Court',
    dateOfJudgment: '2024-02-20',
    judges: ['Justice Rajesh Kumar'],
    parties: {
      petitioner: 'ABC Corp',
      respondent: 'XYZ Ltd',
    },
    summary: 'Commercial dispute regarding intellectual property rights and contractual obligations in digital platform services.',
    category: 'Intellectual Property',
    citation: 'ILR 2024 High Court 890',
    status: 'Ongoing',
  },
  {
    id: '3',
    title: 'Priya Sharma vs. State of Delhi',
    caseNumber: 'WP 9012 of 2024',
    court: 'High Court',
    dateOfJudgment: '2024-03-10',
    judges: ['Justice Rekha Singh', 'Justice Vijay Kumar'],
    parties: {
      petitioner: 'Priya Sharma',
      respondent: 'State of Delhi',
    },
    summary: 'Women\'s employment rights case dealing with maternity benefits and equal pay for equal work.',
    category: 'Employment Law',
    citation: 'ILR 2024 Delhi 456',
    status: 'Disposed',
  },
];

