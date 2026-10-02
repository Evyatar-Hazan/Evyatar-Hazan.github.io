import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import en from '../locales/en.json';
import he from '../locales/he.json';
import type { CaseStudyEvidence as CaseStudyEvidenceData } from '../data/caseStudyEvidence';
import CaseStudyEvidence from './CaseStudyEvidence';

const verifiedEvidence: CaseStudyEvidenceData = {
  evidenceStatus: 'verified',
  verifiedAt: '2026-10-02',
  evidenceLinks: [
    {
      label: { en: 'Live product', he: 'המוצר החי' },
      url: 'https://example.com/product',
    },
    {
      label: { en: 'Source code', he: 'קוד מקור' },
      url: 'https://github.com/example/product',
    },
  ],
};

const labelsFor = (language: 'en' | 'he') => {
  const locale = language === 'he' ? he : en;
  return {
    sources: locale.projects.caseStudyEvidenceSources,
    unknown: locale.projects.caseStudyEvidenceUnknown,
    verifiedOn: locale.projects.caseStudyVerifiedOn,
  };
};

describe('CaseStudyEvidence', () => {
  it.each([
    ['en', 'October 2, 2026', 'Live product', 'Source code'],
    ['he', '2 באוקטובר 2026', 'המוצר החי', 'קוד מקור'],
  ] as const)('renders a dated, accessible verified state in %s', (language, date, liveLabel, codeLabel) => {
    render(
      <CaseStudyEvidence
        evidence={verifiedEvidence}
        labels={labelsFor(language)}
        language={language}
      />,
    );

    const sourceList = screen.getByRole('list', { name: labelsFor(language).sources });
    expect(within(sourceList).getByRole('link', { name: liveLabel })).toHaveAttribute(
      'href',
      'https://example.com/product',
    );
    expect(within(sourceList).getByRole('link', { name: codeLabel })).toHaveAttribute(
      'href',
      'https://github.com/example/product',
    );
    within(sourceList).getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    expect(screen.getByText(date)).toHaveAttribute('datetime', '2026-10-02');
  });

  it.each(['en', 'he'] as const)('renders an explicit unknown state without a date or sources in %s', (language) => {
    const { container } = render(
      <CaseStudyEvidence
        evidence={{ evidenceStatus: 'unknown', verifiedAt: null, evidenceLinks: null }}
        labels={labelsFor(language)}
        language={language}
      />,
    );

    expect(screen.getByText(labelsFor(language).unknown)).toBeInTheDocument();
    expect(container.querySelector('time')).not.toBeInTheDocument();
    expect(container.querySelector('a')).not.toBeInTheDocument();
  });
});
