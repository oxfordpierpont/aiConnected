import { Feed } from 'feed';
import { blog } from '@/lib/source';
import { baseUrl } from '@/lib/metadata';
import { NextResponse } from 'next/server';

export const revalidate = false;

export function GET() {
  const siteUrl = baseUrl.toString().replace(/\/$/, '');
  const feed = new Feed({
    title: 'Fumadocs Blog',
    id: `${siteUrl}/blog`,
    link: `${siteUrl}/blog`,
    language: 'en',

    image: `${siteUrl}/banner.png`,
    favicon: `${siteUrl}/icon.png`,
    copyright: 'All rights reserved 2025, Fuma Nama',
  });

  for (const page of blog.getPages().sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  })) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${siteUrl}${page.url}`,
      date: new Date(page.data.date),

      author: [
        {
          name: page.data.author,
        },
      ],
    });
  }

  return new NextResponse(feed.rss2());
}
