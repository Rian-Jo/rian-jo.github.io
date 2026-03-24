import { describe, expect, it } from 'vitest';

import { profile } from '../src/data/profile';

describe('profile', () => {
  it('publishes the canonical public identity', () => {
    expect(profile.name).toBe('Joonhee Jo');
    expect(profile.headline).toContain('Robotics');
    expect(profile.currentRole.title).toContain('Robotics');
    expect(profile.currentRole.organization).toContain('Hyundai');
  });

  it('keeps the public contact surface focused', () => {
    expect(profile.contactLinks.map((link) => link.label)).toEqual(
      expect.arrayContaining(['GitHub', 'LinkedIn', 'Email']),
    );
  });
});
