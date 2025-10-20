/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://shopsifu.live',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  
  // Exclude admin routes and auth routes from sitemap
  exclude: [
    '/admin/*',
    '/sign-in',
    '/sign-up',
    '/verify-code',
    '/reset-password',
    '/verify-2fa',
    '/verify-email',
    '/oauth-google-callback',
    '/user/*',
    '/cart',
    '/checkout/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500'
  ],

  // Transform URLs for better SEO
  transform: async (config, path) => {
    // Set different priorities and change frequencies for different page types
    let priority = 0.7;
    let changefreq = 'daily';

    // Homepage - highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Product category pages - high priority
    else if (path.includes('-cat.')) {
      priority = 0.9;
      changefreq = 'daily';
    }
    // Product detail pages - high priority
    else if (path.startsWith('/products/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Shop pages - medium priority
    else if (path.startsWith('/shop/')) {
      priority = 0.7;
      changefreq = 'weekly';
    }
    // Policy and static pages - lower priority
    else if (path === '/policy') {
      priority = 0.5;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths to include in sitemap
  additionalPaths: async (config) => {
    const result = [];

    // Add common category pages (you should replace these with actual categories from your API)
    const commonCategories = [
      'thoi-trang-nam-cat.1',
      'thoi-trang-nu-cat.2', 
      'giay-dep-cat.3',
      'dien-thoai-cat.4',
      'laptop-cat.5',
      'nha-cua-cat.6',
      'me-be-cat.7',
      'lam-dep-cat.8',
      'the-thao-cat.9',
      'o-to-xe-may-cat.10'
    ];

    for (const category of commonCategories) {
      result.push({
        loc: `/${category}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });
    }

    return result;
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/user/',
          '/cart',
          '/checkout/',
          '/api/',
          '/_next/',
          '/sign-in',
          '/sign-up',
          '/verify-*',
          '/oauth-*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/user/',
          '/cart',
          '/checkout/',
          '/api/'
        ],
      }
    ],
    additionalSitemaps: [
      'https://shopsifu.live/sitemap.xml',
    ],
  },
};