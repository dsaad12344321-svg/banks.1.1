import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

const SITE_CONFIG = {
  name: 'شهادات الودائع البنكية المصرية',
  description: 'استكشف أفضل شهادات الادخار المصرية واحسب أرباحك بسهولة مع حاسبة الشهادات البنكية المتقدمة',
  url: 'https://egyptian-bank-certificates.vercel.app',
  ogImage: '/og-image.png',
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
  ]
};

export function generateSEOMetadata(config: SEOConfig = {}): Metadata {
  const title = config.title || SITE_CONFIG.name;
  const description = config.description || SITE_CONFIG.description;
  const keywords = config.keywords?.length ? config.keywords : SITE_CONFIG.keywords;
  const ogImage = config.ogImage || SITE_CONFIG.ogImage;
  const canonical = config.canonical || SITE_CONFIG.url;

  return {
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    
    // Open Graph
    openGraph: {
      type: config.ogType || 'website',
      locale: 'ar_EG',
      url: canonical,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@EgyptianBanks',
      site: '@EgyptianBanks',
    },
    
    // Facebook
    facebook: {
      appId: '1234567890123456',
    },
    
    // TikTok
    other: {
      'tiktok:owner': '@egyptianbanks',
      'tiktok:title': title,
      'tiktok:description': description,
      'tiktok:image': ogImage,
    },
    
    // App metadata
    applicationName: SITE_CONFIG.name,
    appleWebApp: {
      capable: true,
      title: SITE_CONFIG.name,
      statusBarStyle: 'default',
    },
    
    // Verification
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    
    // Robots
    robots: {
      index: !config.noindex,
      follow: !config.noindex,
      googleBot: {
        index: !config.noindex,
        follow: !config.noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: canonical,
    },
    
    // Additional meta tags
    other: {
      'theme-color': '#2563eb',
      'msapplication-TileColor': '#2563eb',
      'msapplication-config': '/browserconfig.xml',
    },
  };
}

export function generateStructuredData(type: string, data: Record<string, any>) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return {
    __html: JSON.stringify(baseStructuredData, null, 2),
  };
}

export function generateBankCalculatorStructuredData() {
  return generateStructuredData('SoftwareApplication', {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EGP',
    },
    creator: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    featureList: [
      'حاسبة أرباح الشهادات البنكية',
      'مقارنة بين شهادات الادخار',
      'حساب العائد الاستثماري',
      'معلومات عن أسعار الفائدة',
      'تحليل الشهادات المتدرجة'
    ],
    screenshot: SITE_CONFIG.ogImage,
  });
}

export function generateBankStructuredData(bank: any) {
  return generateStructuredData('BankOrCreditUnion', {
    name: bank.name,
    description: `بنك مصري يقدم شهادات ادخار متنوعة بأفضل أسعار الفائدة`,
    url: `${SITE_CONFIG.url}#bank-${bank.id}`,
    logo: bank.logo,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'شهادات الادخار',
      itemListElement: bank.certificates.map((cert: any, index: number) => ({
        '@type': 'Offer',
        position: index + 1,
        name: cert.name,
        description: cert.description,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: cert.minAmount,
          priceCurrency: 'EGP',
        },
        category: cert.returnType === 'graduated' ? 'شهادة متدرجة' : 
                  cert.returnType === 'variable' ? 'شهادة متغيرة' : 'شهادة ثابتة',
      })),
    },
  });
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

export const SITE_URL = SITE_CONFIG.url;
export const SITE_NAME = SITE_CONFIG.name;
export const SITE_DESCRIPTION = SITE_CONFIG.description;