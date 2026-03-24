import type { CollectionEntry } from 'astro:content';

export function sortPublications(entries: CollectionEntry<'publications'>[]) {
  return [...entries].sort((left, right) => {
    if (right.data.year !== left.data.year) {
      return right.data.year - left.data.year;
    }

    return left.data.title.localeCompare(right.data.title);
  });
}
