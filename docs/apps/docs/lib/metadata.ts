import type { Metadata } from 'next/types';
import { Page } from './source';

function getConfiguredBaseUrl(): URL {
  const configured =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configured) return new URL('http://localhost:3000');
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return new URL(configured);
  }

  return new URL(`https://${configured}`);
}

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl.toString(),
      images: '/banner.png',
      siteName: 'Fumadocs',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@fuma_nama',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      types: {
        'application/rss+xml': [
          {
            title: 'Fumadocs Blog',
            url: new URL('/blog/rss.xml', baseUrl).toString(),
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export function getPageImage(page: Page) {
  const segments = [...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}

export const baseUrl = getConfiguredBaseUrl();
