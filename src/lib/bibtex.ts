export type ParsedBibEntry = {
  key: string;
  type: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  abstract?: string;
  keywords: string[];
  pages?: string;
  links: {
    pdf?: string;
    video?: string;
    external?: string;
  };
};

function splitEntries(source: string): string[] {
  const entries: string[] = [];
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

function normalizeAuthors(authorField?: string): string[] {
  if (!authorField) {
    return [];
  }

  return authorField
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

function extractFieldMap(entry: string): Record<string, string> {
  const fieldMap: Record<string, string> = {};
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
    } else if (body[cursor] === '"') {
      cursor += 1;
      const start = cursor;

      while (cursor < body.length && body[cursor] !== '"') {
        cursor += 1;
      }

      value = body.slice(start, cursor);
      cursor += 1;
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

export function parseBibEntries(source: string): ParsedBibEntry[] {
  return splitEntries(source).map((entry) => {
    const headerMatch = /^@([A-Za-z]+)\{([^,]+),/.exec(entry.trim());
    if (!headerMatch) {
      throw new Error(`Invalid BibTeX entry: ${entry.slice(0, 40)}`);
    }

    const [, type, key] = headerMatch;
    const fields = extractFieldMap(entry);

    return {
      key,
      type: type.toLowerCase(),
      title: fields.title,
      authors: normalizeAuthors(fields.author),
      venue: fields.booktitle ?? fields.journal ?? '',
      year: Number(fields.year),
      doi: fields.doi,
      abstract: fields.abstract,
      keywords: fields.keywords ? fields.keywords.split(',').map((item) => item.trim()).filter(Boolean) : [],
      pages: fields.pages,
      links: {
        pdf: fields.url_pdf,
        video: fields.url_video,
        external: fields.url_link,
      },
    };
  });
}
