# Joonhee Jo Homepage

This repository now contains the canonical Astro site for [rian-jo.github.io](https://rian-jo.github.io).

## Stack

- Astro
- MDX
- Typed content collections for writing, projects, and publications
- Vitest for migration and parsing checks
- GitHub Pages deployment via Actions

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run check
npm run build
```

## Content Sources

- `src/content/writing/`: migrated writing archive
- `src/content/projects/`: curated research and systems projects
- `src/content/publications/`: generated publication metadata
- `data/legacy/`: preserved source bib files used during migration

## Notes

- `/home/*` routes are preserved as redirects to the new canonical pages.
- Legacy dated blog URLs are preserved for migrated writing posts.
- The public profile and CV are kept concise and research-first rather than mirroring a full resume export.
