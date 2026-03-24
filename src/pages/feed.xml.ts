import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

import { site } from '../data/site';
import { buildRssFeed } from '../lib/rss';
import { getWritingMeta, isRealWritingPost, sortWriting } from '../lib/writing';

export async function GET(context: APIContext) {
  const writing = sortWriting((await getCollection('writing')).filter(isRealWritingPost));

  const xml = buildRssFeed({
    title: `${site.title} Writing`,
    description: site.description,
    site: context.site?.toString() ?? site.url,
    items: writing.map((entry) => {
      const meta = getWritingMeta(entry);
      return {
        title: entry.data.title,
        description: meta.excerpt,
        pubDate: meta.publishedAt,
        link: `/writing/${meta.canonicalSlug}/`,
      };
    }),
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
