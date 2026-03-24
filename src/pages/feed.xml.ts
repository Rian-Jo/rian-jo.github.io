import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { site } from '../data/site';
import { getWritingMeta, isRealWritingPost, sortWriting } from '../lib/writing';

export async function GET(context: APIContext) {
  const writing = sortWriting((await getCollection('writing')).filter(isRealWritingPost));

  return rss({
    title: `${site.title} Writing`,
    description: site.description,
    site: context.site ?? site.url,
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
}
