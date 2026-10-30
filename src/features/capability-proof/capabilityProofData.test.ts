import { describe, expect, it } from 'vitest';
import { portfolioCapabilityGroups } from '../../data/portfolioCapabilities';
import {
  capabilityProofDefinitions,
  getCapabilityProofGroups,
} from './capabilityProofData';

describe('capability proof data', () => {
  it('defines every canonical capability but publishes only groups with public proof', () => {
    expect(Object.keys(capabilityProofDefinitions)).toEqual(
      portfolioCapabilityGroups.map((group) => group.id),
    );
    expect(getCapabilityProofGroups('en')).toHaveLength(6);
    expect(getCapabilityProofGroups('he')).toHaveLength(6);

    getCapabilityProofGroups('en').forEach((group) => {
      expect(group.demonstrations.length).toBeGreaterThan(0);
    });
  });

  it.each(['en', 'he'] as const)('resolves every mapped project and article in %s', (language) => {
    const groups = getCapabilityProofGroups(language);

    groups.flatMap((group) => group.demonstrations).forEach((demonstration) => {
      expect(demonstration.title.trim()).not.toBe('');
      expect(demonstration.summary.trim()).not.toBe('');
    });
  });

  it('removes unsupported AI/CV claims instead of borrowing unrelated evidence', () => {
    const aiGroup = getCapabilityProofGroups('en').find((group) => group.id === 'aiCv');

    expect(capabilityProofDefinitions.aiCv.demonstrations).toEqual([]);
    expect(aiGroup).toBeUndefined();
  });

  it('promotes only projects with verified public evidence to measured outcomes', () => {
    const groups = getCapabilityProofGroups('en');
    const measuredProjectIds = Object.fromEntries(groups.map((group) => [
      group.id,
      group.measuredOutcomes.map((outcome) => outcome.projectId),
    ]));

    expect(measuredProjectIds).toEqual({
      webMobile: ['nis_boutique', 'online_converter', 'emergency_protocol', 'united_hatzalah'],
      languages: [],
      devops: ['online_converter', 'emergency_protocol', 'united_hatzalah'],
      databases: ['emergency_protocol', 'united_hatzalah'],
      automation: ['online_converter'],
      methodologies: ['nis_boutique', 'online_converter', 'emergency_protocol', 'united_hatzalah'],
    });

    groups.flatMap((group) => group.measuredOutcomes).forEach((outcome) => {
      expect(outcome.evidence.evidenceStatus).toBe('verified');
      expect(outcome.evidence.evidenceLinks.length).toBeGreaterThan(0);
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
