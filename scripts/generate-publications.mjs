import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import slugify from 'slugify';

const rootDir = process.cwd();
const inputDir = path.join(rootDir, 'data', 'legacy');
const outputDir = path.join(rootDir, 'src', 'content', 'publications');
const featuredKeys = new Set(['IROS2020', 'ICRA2021', 'UR2020', 'RAS2021']);

function splitEntries(source) {
  const entries = [];
  let start = -1;
  let depth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (char === '@' && depth === 0) {
      start = index;
    }

    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;

      if (depth === 0 && start >= 0) {
        entries.push(source.slice(start, index + 1));
        start = -1;
      }
    }
  }

  return entries;
}

function extractFieldMap(entry) {
  const fieldMap = {};
  const body = entry.slice(entry.indexOf(',') + 1, entry.lastIndexOf('}'));

  let cursor = 0;
  while (cursor < body.length) {
    while (cursor < body.length && /[\s,]/.test(body[cursor])) {
      cursor += 1;
    }

    if (cursor >= body.length) {
      break;
    }

    const keyMatch = /^[A-Za-z_][A-Za-z0-9_-]*/.exec(body.slice(cursor));
    if (!keyMatch) {
      break;
    }

    const key = keyMatch[0].toLowerCase();
    cursor += key.length;

    while (cursor < body.length && /\s/.test(body[cursor])) {
      cursor += 1;
    }

    if (body[cursor] !== '=') {
      break;
    }
    cursor += 1;

    while (cursor < body.length && /\s/.test(body[cursor])) {
      cursor += 1;
    }

    let value = '';

    if (body[cursor] === '{') {
      cursor += 1;
      let depth = 1;
      const start = cursor;

      while (cursor < body.length && depth > 0) {
        if (body[cursor] === '{') {
          depth += 1;
        } else if (body[cursor] === '}') {
          depth -= 1;
        }
        cursor += 1;
      }

      value = body.slice(start, cursor - 1);
    } else {
      const start = cursor;
      while (cursor < body.length && body[cursor] !== ',') {
        cursor += 1;
      }
      value = body.slice(start, cursor);
    }

    fieldMap[key] = value.replace(/\s+/g, ' ').trim();
  }

  return fieldMap;
}

function normalizeAuthors(value = '') {
  return value
    .split(/\sand\s/gi)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((part) => {
      const cleaned = part.replace(/,+$/, '');
      if (!cleaned.includes(',')) {
        return cleaned;
      }

      const [family, given] = cleaned.split(',').map((segment) => segment.trim()).filter(Boolean);
      return given ? `${given} ${family}` : family;
    });
}

function normalizeRelativeLink(value) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith('http')) {
    return value;
  }

  return `/publications/${value}`;
}

function parseBibFile(source) {
  return splitEntries(source).map((entry) => {
    const headerMatch = /^@([A-Za-z]+)\{([^,]+),/.exec(entry.trim());
    if (!headerMatch) {
      throw new Error(`Invalid BibTeX entry: ${entry.slice(0, 40)}`);
    }

    const [, type, key] = headerMatch;
    const fields = extractFieldMap(entry);
    const title = fields.title;
    const slug = slugify(title, { lower: true, strict: true });

    return {
      key,
      slug,
      type: type.toLowerCase(),
      title,
      authors: normalizeAuthors(fields.author),
      venue: fields.booktitle ?? fields.journal ?? '',
      year: Number(fields.year),
      doi: fields.doi || undefined,
      abstract: fields.abstract || undefined,
      keywords: fields.keywords
        ? fields.keywords.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      pages: fields.pages || undefined,
      featured: featuredKeys.has(key),
      links: {
        pdf: normalizeRelativeLink(fields.url_pdf),
        video: fields.url_video || undefined,
        external: fields.url_link || undefined,
      },
    };
  });
}

await mkdir(outputDir, { recursive: true });

for (const file of await readdir(outputDir)) {
  if (file.endsWith('.json')) {
    await rm(path.join(outputDir, file));
  }
}

const sources = await Promise.all(
  ['bib_conference.bib', 'bib_journal.bib'].map(async (file) =>
    readFile(path.join(inputDir, file), 'utf8'),
  ),
);

const entries = sources.flatMap(parseBibFile);

for (const entry of entries) {
  await writeFile(
    path.join(outputDir, `${entry.slug}.json`),
    `${JSON.stringify(entry, null, 2)}\n`,
    'utf8',
  );
}
