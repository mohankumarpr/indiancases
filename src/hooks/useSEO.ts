import { useEffect } from 'react';
import { updateSEO, SEOProps } from '../utils/seo';

export const useSEO = (seoProps: SEOProps) => {
  useEffect(() => {
    updateSEO(seoProps);
  }, [seoProps.title, seoProps.description, seoProps.keywords, seoProps.canonicalUrl]);
};

export default useSEO;








