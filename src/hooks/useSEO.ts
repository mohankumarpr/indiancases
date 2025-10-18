import { useEffect } from 'react';
import { updateSEO, SEOProps } from '../utils/seo';

export const useSEO = (seoProps: SEOProps) => {
  useEffect(() => {
    // Only run SEO updates in web environment
    if (typeof document !== 'undefined') {
      updateSEO(seoProps);
    } else {
      console.log('🔍 useSEO: Skipping SEO update in React Native environment');
    }
  }, [seoProps.title, seoProps.description, seoProps.keywords, seoProps.canonicalUrl]);
};

export default useSEO;








