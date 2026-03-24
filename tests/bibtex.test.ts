import { describe, expect, it } from 'vitest';

import { parseBibEntries } from '../src/lib/bibtex';

const sampleBib = `
@inproceedings{UR2020,
  author    = {Jo, Joonhee and
  Oh, Yonghwan},
  title     = {Contact Force based Balancing and Tracking Control of a Ballbot using Projected Task Space Dynamics with Inequality Constraints},
  booktitle = {International Conference on Ubiquitous Robots (UR)},
  year      = {2020},
  doi       = {10.1109/UR49135.2020.9144840},
  url_pdf   = {files/UR2020.pdf},
  url_link  = {https://ieeexplore.ieee.org/document/9144840}
}
`;

describe('BibTeX parsing', () => {
  it('extracts publication metadata from the legacy bib files', () => {
    const [entry] = parseBibEntries(sampleBib);

    expect(entry.key).toBe('UR2020');
    expect(entry.type).toBe('inproceedings');
    expect(entry.title).toContain('Ballbot');
    expect(entry.authors).toEqual(['Joonhee Jo', 'Yonghwan Oh']);
    expect(entry.venue).toBe('International Conference on Ubiquitous Robots (UR)');
    expect(entry.year).toBe(2020);
    expect(entry.links.pdf).toBe('files/UR2020.pdf');
    expect(entry.links.external).toBe('https://ieeexplore.ieee.org/document/9144840');
  });
});
