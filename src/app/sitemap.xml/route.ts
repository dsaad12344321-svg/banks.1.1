import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

interface BankData {
  banks: Array<{
    id: string;
    name: string;
    certificates: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

async function getBankData(): Promise<BankData> {
  try {
    const response = await fetch('http://localhost:3000/api/bank-data', {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch bank data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bank data for sitemap:', error);
    return { banks: [] };
  }
}

export async function GET() {
  const bankData = await getBankData();
  
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    },
  ];

  const bankPages = bankData.banks.map((bank) => ({
    url: `${SITE_URL}#bank-${bank.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const certificatePages = bankData.banks.flatMap((bank) =>
    bank.certificates.map((certificate) => ({
      url: `${SITE_URL}#certificate-${certificate.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  const allPages = [...staticPages, ...bankPages, ...certificatePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Main pages -->
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  
  <!-- Image sitemap entries -->
  <url>
    <loc>${SITE_URL}</loc>
    <image:image>
      <image:loc>${SITE_URL}/og-image.png</image:loc>
      <image:title>شهادات الودائع البنكية المصرية</image:title>
      <image:caption>استكشف أفضل شهادات الادخار المصرية واحسب أرباحك</image:caption>
    </image:image>
  </url>
  
  <!-- Alternate language versions (if available) -->
  <url>
    <loc>${SITE_URL}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}" />
  </url>
  
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}