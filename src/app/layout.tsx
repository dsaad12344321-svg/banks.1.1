import './globals.css';
import { generateSEOMetadata, SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    'شهادات الادخار المصرية',
    'حاسبة الأرباح البنكية', 
    'شهادات البنوك المصرية',
    'استثمار البنوك في مصر',
    'أسعار الفائدة المصرية',
    'أفضل شهادات الادخار',
    'حساب أرباح الشهادات',
    'شهادات البنك المركزي',
    'ودائع بنكية مصرية',
    'استثمار آمن في مصر'
  ],
  ogType: 'website',
  canonical: SITE_URL,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Additional SEO meta tags */}
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Egypt" />
        <meta name="geo.position" content="30.0444;31.2357" />
        <meta name="ICBM" content="30.0444, 31.2357" />
        <meta name="language" content="Arabic" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph additional tags */}
        <meta property="og:locale" content="ar_EG" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:country-name" content="Egypt" />
        
        {/* Twitter additional tags */}
        <meta name="twitter:domain" content="egyptian-bank-certificates.vercel.app" />
        
        {/* Facebook additional tags */}
        <meta property="fb:app_id" content="1234567890123456" />
        <meta property="fb:admins" content="123456789" />
        
        {/* TikTok additional tags */}
        <meta name="tiktok:owner" content="@egyptianbanks" />
        
        {/* Additional structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/logo.png`,
                  width: 512,
                  height: 512,
                },
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}