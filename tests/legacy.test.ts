import { describe, expect, it } from 'vitest';

import { buildLegacyWritingPath, resolveHomeRedirect } from '../src/lib/legacy';

describe('legacy redirects', () => {
  it('maps old /home section pages to the new canonical pages', () => {
    expect(resolveHomeRedirect('/home/about/')).toBe('/about/');
    expect(resolveHomeRedirect('/home/publications/')).toBe('/publications/');
    expect(resolveHomeRedirect('/home/projects/')).toBe('/projects/');
  });

  it('preserves the dated writing path shape for old blog links', () => {
    expect(
      buildLegacyWritingPath({
        categorySegments: ['devlog'],
        date: new Date('2021-03-17T00:00:00Z'),
        legacySlug: 'System-WSL-devEnv-setup',
      }),
    ).toBe('/devlog/2021/03/17/System-WSL-devEnv-setup/');
  });
});
