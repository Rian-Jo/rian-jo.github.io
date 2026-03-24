import { describe, expect, it } from 'vitest';

import { buildRssFeed, escapeXml } from '../src/lib/rss';

describe('rss feed generation', () => {
  it('escapes XML-sensitive characters', () => {
    expect(escapeXml(`A&B <tag> "quote" 'apostrophe'`)).toBe(
      'A&amp;B &lt;tag&gt; &quot;quote&quot; &apos;apostrophe&apos;',
    );
  });

  it('builds a valid RSS document for writing entries', () => {
    const xml = buildRssFeed({
      title: 'Joonhee Jo Writing',
      description: 'Research-first writing archive',
      site: 'https://rian-jo.github.io',
      items: [
        {
          title: 'Control & Contact',
          description: 'Notes on locomotion <and> balance',
          pubDate: new Date('2026-03-24T00:00:00Z'),
          link: '/writing/control-contact/',
        },
      ],
    });

    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('<title>Joonhee Jo Writing</title>');
    expect(xml).toContain('<link>https://rian-jo.github.io/writing/control-contact/</link>');
    expect(xml).toContain('Notes on locomotion &lt;and&gt; balance');
    expect(xml).toContain('<guid>https://rian-jo.github.io/writing/control-contact/</guid>');
  });
});
