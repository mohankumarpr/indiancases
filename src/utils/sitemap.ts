// Sitemap generator for SEO
export const generateSitemap = () => {
  const baseUrl = 'https://indiancases.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/search',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: '/profile',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  // Generate sitemap XML
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
    sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  return sitemap;
};

// Robots.txt generator
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://indiancases.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin areas (if any)
Disallow: /admin/
Disallow: /api/

# Allow all legal case pages
Allow: /case/
Allow: /search
`;
};








