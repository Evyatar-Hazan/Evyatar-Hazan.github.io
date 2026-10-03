import { describe, expect, it } from 'vitest';
import { audiencePaths, getAudiencePaths } from './audiencePaths';

describe('audience paths', () => {
  it('keeps product-seeking visitors first and recruiters second', () => {
    expect(audiencePaths.map(({ id, priority }) => ({ id, priority }))).toEqual([
      { id: 'product-partner', priority: 'primary' },
      { id: 'recruiter', priority: 'secondary' },
    ]);
  });

  it('routes each audience into existing content instead of a duplicate page', () => {
    expect(audiencePaths.map(({ cta }) => cta.target)).toEqual([
      { route: 'contact' },
      { route: 'projects' },
    ]);
  });

  it('provides complete English and Hebrew copy without employment claims', () => {
    for (const language of ['en', 'he'] as const) {
      const localizedPaths = getAudiencePaths(language);

      expect(localizedPaths).toHaveLength(2);
      localizedPaths.forEach((path) => {
        expect(path.audience).not.toHaveLength(0);
        expect(path.title).not.toHaveLength(0);
        expect(path.description).not.toHaveLength(0);
        expect(path.cta.label).not.toHaveLength(0);
      });
    }

    const publicCopy = JSON.stringify(audiencePaths).toLowerCase();
    expect(publicCopy).not.toMatch(/open to work|available for hire|seeking a role/);
  });
});
