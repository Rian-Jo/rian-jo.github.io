export type RssItem = {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
};

export type RssFeedInput = {
  title: string;
  description: string;
  site: string;
  items: RssItem[];
};

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveLink(site: string, link: string): string {
  return new URL(link, site).toString();
}

export function buildRssFeed({ title, description, site, items }: RssFeedInput): string {
  const channelLink = new URL('/', site).toString();
  const lastBuildDate =
    items.length > 0
      ? new Date(Math.max(...items.map((item) => item.pubDate.getTime())))
      : new Date();
  const itemXml = items
    .map((item) => {
      const url = resolveLink(site, item.link);

      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <description>${escapeXml(item.description)}</description>`,
        `      <pubDate>${item.pubDate.toUTCString()}</pubDate>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid>${escapeXml(url)}</guid>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
    '    <language>en</language>',
    itemXml,
    '  </channel>',
    '</rss>',
  ].join('\n');
}
