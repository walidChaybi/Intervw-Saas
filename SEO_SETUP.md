# SEO Setup Guide for Intervw

This document outlines the SEO implementation for the Intervw AI Interview Practice platform.

## Overview

The SEO implementation includes:
- Comprehensive metadata for all pages
- JSON-LD schema markup (Organization, SoftwareApplication, FAQ)
- Open Graph tags for social sharing
- Twitter Card metadata
- Optimized keywords (short-tail and long-tail)

## Environment Variables

Make sure to set the following environment variable in your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

If not set, it will default to `https://intervw.com`.

## SEO Keywords

### Short Keywords (High Competition)
- AI interview practice
- Mock interview AI
- Interview preparation
- AI interview coach
- Video interview practice
- Interview simulator
- AI job interview
- Interview prep tool

### Long-tail Keywords (Easier to Rank)
- AI-powered interview practice platform
- Practice job interviews with AI video calls
- AI interview coach for job preparation
- Mock interview simulator with AI
- Video interview practice with artificial intelligence
- AI interview preparation software
- Practice interviews online with AI
- AI interview training platform
- Virtual interview practice with AI coach
- AI interview simulator for job seekers
- Interview practice app with AI feedback
- AI-powered mock interview tool

## Files Structure

- `src/lib/seo.ts` - Central SEO configuration and metadata
- `src/components/seo-schema.tsx` - JSON-LD schema markup component
- `src/app/layout.tsx` - Root layout with base SEO metadata
- `src/app/(auth)/sign-in/page.tsx` - Sign-in page metadata
- `src/app/(auth)/sign-up/page.tsx` - Sign-up page metadata
- `src/app/(dashboard)/page.tsx` - Dashboard page metadata

## Adding SEO to New Pages

When creating a new page, add metadata like this:

```typescript
import type { Metadata } from "next";
import { PAGE_SEO, BASE_SEO } from "@/lib/seo";

export const metadata: Metadata = {
  ...BASE_SEO,
  title: PAGE_SEO.yourPage.title,
  description: PAGE_SEO.yourPage.description,
  openGraph: {
    ...BASE_SEO.openGraph,
    title: PAGE_SEO.yourPage.title,
    description: PAGE_SEO.yourPage.description,
    url: "/your-page",
  },
  alternates: {
    canonical: "/your-page",
  },
};
```

Don't forget to add the page SEO to `PAGE_SEO` object in `src/lib/seo.ts`.

## Schema Markup

The following schema types are included:
1. **Organization Schema** - Company information
2. **SoftwareApplication Schema** - App details and ratings
3. **FAQ Schema** - Frequently asked questions

These are automatically added to all pages via the `SEOSchema` component.

## Best Practices

1. **Update Keywords Regularly**: Review and update keywords based on search trends
2. **Monitor Performance**: Use Google Search Console to track rankings
3. **Content Optimization**: Use keywords naturally in page content
4. **Image Alt Text**: Always include descriptive alt text with keywords
5. **Internal Linking**: Link between related pages using keyword-rich anchor text
6. **Page Speed**: Ensure fast page load times (affects SEO rankings)

## Next Steps

1. Create OG images (`/public/og-image.png` - 1200x630px)
2. Add sitemap.xml
3. Add robots.txt
4. Set up Google Search Console
5. Add analytics tracking
6. Create blog/content pages with SEO-optimized articles

## Testing

Test your SEO implementation:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)

