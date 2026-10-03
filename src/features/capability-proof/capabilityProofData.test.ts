import { describe, expect, it } from 'vitest';
import { portfolioCapabilityGroups } from '../../data/portfolioCapabilities';
import {
  capabilityProofDefinitions,
  getCapabilityProofGroups,
} from './capabilityProofData';

describe('capability proof data', () => {
  it('covers every canonical capability group exactly once', () => {
    expect(Object.keys(capabilityProofDefinitions)).toEqual(
      portfolioCapabilityGroups.map((group) => group.id),
    );
    expect(getCapabilityProofGroups('en')).toHaveLength(7);
    expect(getCapabilityProofGroups('he')).toHaveLength(7);
  });

  it.each(['en', 'he'] as const)('resolves every mapped project and article in %s', (language) => {
    const groups = getCapabilityProofGroups(language);

    groups.flatMap((group) => group.demonstrations).forEach((demonstration) => {
      expect(demonstration.title.trim()).not.toBe('');
      expect(demonstration.summary.trim()).not.toBe('');
    });
  });

  it('keeps unsupported AI/CV claims explicit instead of borrowing unrelated evidence', () => {
    const aiGroup = getCapabilityProofGroups('en').find((group) => group.id === 'aiCv');

    expect(aiGroup?.demonstrations).toEqual([]);
    expect(aiGroup?.publicEvidenceGap).toMatch(/No canonical public project or article/);
  });

  it('does not promote demonstrations to measured outcomes while task72 evidence is unknown', () => {
    getCapabilityProofGroups('en').forEach((group) => {
      expect(group.measuredOutcomes).toEqual([]);
    });
  });

  it('maps automation practice while disclosing that named device tools are not all verified', () => {
    const automation = getCapabilityProofGroups('en').find((group) => group.id === 'automation');

    expect(automation?.demonstrations.map(({ kind, id }) => `${kind}:${id}`)).toEqual([
      'project:online_converter',
      'project:test_yourself',
      'article:tests-need-honest-environments',
      'article:performance-optimizations-need-product-verification',
    ]);
    expect(automation?.publicEvidenceGap).toMatch(/do not publicly verify every named/);
  });
});
