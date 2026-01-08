import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

export function GET() {
  const robotsTxt = `# Global directives
User-agent: *
Allow: /

# Specific directives for major crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 1

# Disallow admin and API endpoints
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /*?*$
Disallow: /_next/
Disallow: /favicon.ico
Disallow: /apple-touch-icon*
Disallow: /favicon-*
Disallow: /safari-pinned-tab.svg
Disallow: /browserconfig.xml
Disallow: /site.webmanifest

# Allow specific API endpoints for SEO
User-agent: *
Allow: /api/bank-data

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Additional directives
# Crawl budget optimization
User-agent: *
Crawl-delay: 1

# Image optimization
User-agent: Googlebot-Image
Allow: /images/
Allow: /og-image.png
Allow: /logo.png

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Applebot
Allow: /

# SEO tools
User-agent: AhrefsBot
Allow: /

User-agent: SEMrushBot
Allow: /

User-agent: MJ12bot
Allow: /

User-agent: DotBot
Allow: /

# Block unwanted bots
User-agent: ChatGPT-User
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Host directive for Yandex
Host: ${SITE_URL}

# Additional meta information
# This file was last updated: ${new Date().toISOString()}
# Website: شهادات الودائع البنكية المصرية
# Purpose: SEO optimization for Egyptian bank certificates calculator`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}