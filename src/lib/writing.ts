import type { CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';
import { buildLegacyWritingPath } from './legacy';

export type WritingMeta = {
  canonicalSlug: string;
  legacySlug: string;
  legacyPath: string;
  publishedAt: Date;
  excerpt: string;
  language: 'en' | 'ko';
  readingMinutes: number;
  categorySegments: string[];
};

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+]\([^)]+\)/g, '$1')
    .replace(/[>#*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSegments(value: string | string[] | undefined): string[] {
  if (!value) {
    return ['writing'];
  }

  if (Array.isArray(value)) {
    return value.flatMap((segment) => normalizeSegments(segment));
  }

  return value
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function getWritingDate(entry: CollectionEntry<'writing'>): Date {
  if (entry.data.date) {
    return entry.data.date;
  }

  const match = DATE_PREFIX.exec(entry.id);
  if (!match) {
    throw new Error(`Missing date for writing entry ${entry.id}`);
  }

  const [, year, month, day] = match;
  return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

export function getWritingSlugStem(entry: CollectionEntry<'writing'>): string {
  const match = DATE_PREFIX.exec(entry.id);
  return match ? match[4] : entry.id;
}

export function getCanonicalWritingSlug(entry: CollectionEntry<'writing'>): string {
  return getWritingSlugStem(entry)
    .replace(/\[([^\]]+)]/g, '$1')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function getLegacyWritingSlug(entry: CollectionEntry<'writing'>): string {
  return getWritingSlugStem(entry).replace(/\[([^\]]+)]/g, '$1');
}

export function getWritingLanguage(entry: CollectionEntry<'writing'>): 'en' | 'ko' {
  if (entry.id.includes('welcome-to-jekyll')) {
    return 'en';
  }

  return 'ko';
}

export function isRealWritingPost(entry: CollectionEntry<'writing'>): boolean {
  return !entry.id.includes('welcome-to-jekyll');
}

export function getWritingMeta(entry: CollectionEntry<'writing'>): WritingMeta {
  const publishedAt = getWritingDate(entry);
  const legacySlug = getLegacyWritingSlug(entry);
  const categorySegments = normalizeSegments(entry.data.categories);

  return {
    canonicalSlug: getCanonicalWritingSlug(entry),
    legacySlug,
    legacyPath: buildLegacyWritingPath({
      categorySegments,
      date: publishedAt,
      legacySlug,
    }),
    publishedAt,
    excerpt:
      entry.data.summary ??
      entry.data.subtitle ??
      stripMarkdown(entry.body).slice(0, 180).trim(),
    language: getWritingLanguage(entry),
    readingMinutes: Math.max(1, Math.round(readingTime(entry.body).minutes)),
    categorySegments,
  };
}

export function sortWriting(entries: CollectionEntry<'writing'>[]) {
  return [...entries].sort(
    (left, right) => getWritingDate(right).getTime() - getWritingDate(left).getTime(),
  );
}
