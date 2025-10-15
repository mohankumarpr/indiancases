interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
}

export const updateSEO = (props: SEOProps) => {
  if (typeof window === 'undefined') return; // Server-side check

  const {
    title = 'IndiLegal Research - Legal Case Database',
    description = 'Comprehensive legal case research platform. Search and explore judgments from Supreme Court, High Courts, and District Courts across India.',
    keywords = 'legal research, case law, Supreme Court, High Court, judgments, legal database, India',
    canonicalUrl = 'https://indiancases.com',
    ogImage = 'https://indiancases.com/assets/og-image.png',
    ogType = 'website',
    structuredData
  } = props;

  // Update document title
  document.title = title;

  // Update meta description
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:description', description);

  // Update keywords
  updateMetaTag('name', 'keywords', keywords);

  // Update Open Graph tags
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:type', ogType);
  updateMetaTag('property', 'og:image', ogImage);
  updateMetaTag('property', 'og:url', canonicalUrl);

  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', ogImage);

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (canonical) {
    canonical.href = canonicalUrl;
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
  }

  // Update structured data
  if (structuredData) {
    updateStructuredData(structuredData);
  }
};

const updateMetaTag = (attribute: string, value: string, content: string) => {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  if (meta) {
    meta.content = content;
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    meta.content = content;
    document.head.appendChild(meta);
  }
};

const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title: 'IndiLegal Research - Legal Case Database | Supreme Court & High Court Judgments',
    description: 'Comprehensive legal case research platform. Search and explore judgments from Supreme Court, High Courts, and District Courts across India. Access case laws, legal precedents, and court decisions efficiently.',
    keywords: 'legal research, case law, Supreme Court, High Court, judgments, legal database, India, law cases, court decisions, legal precedents',
    canonicalUrl: 'https://indiancases.com',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'IndiLegal Research',
      'description': 'Comprehensive legal case research platform for Indian courts',
      'url': 'https://indiancases.com',
      'applicationCategory': 'Legal Research Application',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR'
      }
    }
  },
  
  search: {
    title: 'Search Legal Cases - IndiLegal Research | Case Law Database',
    description: 'Search through thousands of legal cases from Indian courts. Find relevant judgments, case laws, and legal precedents with advanced filtering options.',
    keywords: 'case search, legal case search, court judgment search, legal precedent search, case law search India',
    canonicalUrl: 'https://indiancases.com/search',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://indiancases.com/search?q={search_term}'
      },
      'query-input': 'required name=search_term'
    }
  },

  caseDetail: {
    title: (caseTitle: string, caseNumber: string) => 
      `${caseTitle} | ${caseNumber} - IndiLegal Research`,
    description: (summary: string, court: string) => 
      `${summary.substring(0, 160)}... Case from ${court}. Access full judgment details and related cases.`,
    keywords: (category: string, court: string) => 
      `legal case, ${category}, ${court}, judgment, case law, legal precedent`,
    canonicalUrl: (caseId: string) => `https://indiancases.com/case/${caseId}`,
    structuredData: (caseData: any) => ({
      '@context': 'https://schema.org',
      '@type': 'LegalDocument',
      'name': caseData.title,
      'description': caseData.summary,
      'dateCreated': caseData.dateOfJudgment,
      'author': {
        '@type': 'Organization',
        'name': caseData.court
      },
      'keywords': caseData.category,
      'about': caseData.category,
      'publisher': {
        '@type': 'Organization',
        'name': 'IndiLegal Research'
      }
    })
  }
};








