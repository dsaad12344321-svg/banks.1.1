import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorClient from '@/components/calculator-client';
import BanksDisplay from '@/components/banks-display';
import FooterClient from '@/components/footer-client';
import FAQAccordion from '@/components/faq-accordion';
import { generateSEOMetadata, generateBankCalculatorStructuredData, generateFAQStructuredData, generateBreadcrumbStructuredData, SITE_URL } from '@/lib/seo';
import Image from 'next/image';

interface Certificate {
  id: string;
  name: string;
  duration: number;
  interestRate: number;
  returnType: 'fixed' | 'variable' | 'graduated';
  graduatedRates?: {
    year1: number;
    year2: number;
    year3: number;
  };
  type: 'monthly' | 'quarterly' | 'annual';
  minAmount: number;
  description: string;
  features: string[];
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  certificates: Certificate[];
}

export const metadata = generateSEOMetadata({
  title: 'حاسبة شهادات الودائع البنكية المصرية',
  description: 'احسب أرباح شهادات الادخار المصرية بدقة. مقارنة بين أفضل البنوك المصرية وأسعار الفائدة للشهادات الثابتة والمتغيرة والمتدرجة.',
  keywords: [
    'حاسبة الشهادات البنكية',
    'حساب أرباح الشهادات',
    'شهادات الادخار المصرية',
    'أسعار الفائدة البنكية',
    'مقارنة البنوك المصرية',
    'استثمار آمن في مصر',
    'شهادات الثابتة والمتغيرة',
    'أفضل عائد استثماري',
    'حساب الربح الشهري',
    'شهادات البنك الأهلي',
    'شهادات بنك مصر'
  
  ],
  ogType: 'website',
  canonical: SITE_URL,
});

async function getBankData() {
  try {
    const response = await fetch('/api/bank-data');
    const data = await response.json();
    return { banks: data.banks || [], loading: false, error: '' };
  } catch (error) {
    return { 
      banks: [], 
      loading: false, 
      error: `فشل في تحميل بيانات البنوك: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

const faqs = [
  {
    question: 'ما هي أفضل شهادة ادخار في البنوك المصرية لعام 2026؟',
    answer: ' أفضل شهادة ادخار تعتمد على احتياجاتك ومبلغ الاستثمار. الشهادة الثابتة هي الخيار الأمثل حالياً حيث توفر عائداً ثابتا مع مرور الوقت',
    visible: false
  },
  {
    question: 'كيف أحسب أرباح شهادة الادخار؟',
    answer: 'يمكنك حساب أرباح شهادة الادخار بضرب مبلغ الاستثمار في نسبة الفائدة السنوية، ثم ضرب الناتج في عدد سنوات الاستثمار. حاسبتنا تقوم بهذا الحساب تلقائياً.',
    visible: false
  },
  {
    question: 'ما الفرق بين الشهادة الثابتة والمتغيرة والمتدرجة؟',
    answer: 'الشهادة الثابتة لها فائدة ثابتة طوال فترة الاستثمار، والمتغيرة تتغير حسب سياسات البنك، والمتدرجة تقل الفائدة مع مرور الوقت (سنة بعد سنة). الشهادة الثابتة توفر استقرار في العائد، بينما المتدرجة توفر عائد مرتفع في البداية.',
    visible: false
  },
  {
    question: 'ما هو الحد الأدنى لشراء شهادة الادخار؟',
    answer: 'الحد الأدنى يختلف من بنك لآخر وشهادة لأخرى، لكنه يبدأ عادة من 500 جنيه مصري للشهادات الصغيرة. بعض البنوك تقدم شهادات تبدأ من 1,000 جنيه أو حتى 5,000 جنيه للحد الأدنى، مع إمكانية إضافة مبالغ أكبر.',
    visible: false
  },
  {
    question: 'متى يتم صرف أرباح الشهادات البنكية؟',
    answer: 'يتم صرف الأرباح حسب نوع الشهادة: شهرياً، ربع سنوي، أو سنوياً. الشهادات السنوية عادة ما توفر عائداً أعلى.',
    visible: false
  }
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: SITE_URL },
  { name: 'حاسبة الشهادات', url: SITE_URL },
  { name: 'البنوك المصرية', url: `${SITE_URL}#banks` }
];

export default async function Home() {
  const { banks, loading, error } = await getBankData();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateBankCalculatorStructuredData()}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateFAQStructuredData(faqs.filter(faq => !faq.visible))}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateBreadcrumbStructuredData(breadcrumbItems)}
      />
      
      {/* Bank structured data */}
      {banks.map((bank) => (
        <script
          key={bank.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BankOrCreditUnion',
              name: bank.name,
              description: `بنك مصري يقدم شهادات ادخار متنوعة بأفضل أسعار الفائدة`,
              url: `${SITE_URL}#bank-${bank.id}`,
              logo: bank.logo,
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'شهادات الادخار',
                itemListElement: bank.certificates.map((cert, index) => ({
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
            }),
          }}
        />
      ))}

      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8 pt-8">
            <div className="flex justify-center mb-4">
              <Image src='/logo.png' width={100} height={100} alt='daleelak elbankey logo'/>  
            </div>
            
            
            <h1 className="text-4xl font-bold text-foreground mb-2">
               شهادات وودائع البنوك المصرية
            </h1>
            <p className="text-muted-foreground text-lg">
              استكشف أفضل شهادات الادخار واحسب أرباحك بسهولة
            </p>
          </header>

          {/* Banks Grid */}
          <section id="banks" className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              قائمة البنوك
            </h2>
            
            <BanksDisplay banks={banks} loading={loading} error={error} />
          </section>

          {/* Calculator Section */}
          <section className="mb-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  حاسبة الأرباح
                </CardTitle>
                <CardDescription>
                  احسب أرباحك من شهادات الادخار البنكية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CalculatorClient banks={banks} loading={loading} error={error} />
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <FAQAccordion faqs={faqs} />
          </section>

          {/* Footer */}
          <FooterClient />
        </div>
      </div>
    </>
  );
}
