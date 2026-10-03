import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import type { ProjectCaseStudy } from '../data/profile';
import CaseStudyReadingLevels from './CaseStudyReadingLevels';

const caseStudy: ProjectCaseStudy = {
  eyebrow: { en: 'Case study', he: 'קייס סטאדי' },
  seoTitle: { en: 'Title', he: 'כותרת' },
  seoDescription: { en: 'Description', he: 'תיאור' },
  overview: {
    en: ['Full English context.'],
    he: ['הקשר מלא בעברית.'],
  },
  audience: { en: 'Product teams', he: 'צוותי מוצר' },
  proof: { en: 'Proof stays visible.', he: 'הראיה נשארת גלויה.' },
  decisions: {
    en: ['Use a typed registry.'],
    he: ['להשתמש ב־registry טיפוסי.'],
  },
  outcomes: {
    en: ['A maintainable content model.'],
    he: ['מודל תוכן תחזוקתי.'],
  },
  evidenceStatus: 'unknown',
  verifiedAt: null,
  evidenceLinks: null,
};

const buildLocalizedPath = vi.fn((language, target) => {
  if (target.route === 'projects') return `/${language}/projects/`;
  if (target.route === 'article') return `/${language}/blog/${target.id}/`;
  if (target.route === 'blog') return `/${language}/blog/`;
  return `/${language}/`;
}) as LocalizedPathBuilder;

const renderComponent = (language: 'en' | 'he' = 'en') => render(
  <MemoryRouter>
    <CaseStudyReadingLevels
      language={language}
      projectId="online_converter"
      buildLocalizedPath={buildLocalizedPath}
      caseStudy={caseStudy}
      problem={language === 'he' ? 'בעיה קצרה.' : 'A short problem.'}
      solution={language === 'he' ? 'גישה קצרה.' : 'A short approach.'}
      impact={language === 'he' ? 'תוצאה קצרה.' : 'A short outcome.'}
      role={language === 'he' ? 'תרומה קצרה.' : 'A short contribution.'}
      githubUrl="https://github.com/example/project"
      liveUrl="https://example.com/"
    />
  </MemoryRouter>,
);

describe('CaseStudyReadingLevels', () => {
  it('keeps the short summary, evidence, and actions available while full detail is closed', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: '30-second overview' })).toBeInTheDocument();
    expect(screen.getByText('A short problem.')).toBeInTheDocument();
    expect(screen.getByText('Evidence date and public sources are not yet verified.')).toBeInTheDocument();

    const actions = screen.getByRole('navigation', { name: 'Case study actions' });
    expect(within(actions).getByRole('link', { name: 'Back to projects' })).toHaveAttribute(
      'href',
      '/en/projects/',
    );
    expect(within(actions).getByRole('link', { name: 'Source code' })).toHaveAttribute(
      'href',
      'https://github.com/example/project',
    );
    expect(within(actions).getByRole('link', { name: 'Live product' })).toHaveAttribute(
      'href',
      'https://example.com/',
    );
    expect(within(actions).getByRole('link', { name: 'Related writing' })).toHaveAttribute(
      'href',
      '/en/blog/seo-discovery-is-product-work/',
    );

    const disclosure = screen.getByText('Read engineering details').closest('summary');
    expect(disclosure?.tagName).toBe('SUMMARY');
    expect(disclosure?.tabIndex).toBe(0);
    expect(disclosure?.parentElement).not.toHaveAttribute('open');
  });

  it('opens engineering decisions and an honest verification fallback with the native control', () => {
    renderComponent();

    const summary = screen.getByText('Read engineering details').closest('summary');
    expect(summary).not.toBeNull();
    fireEvent.click(summary as HTMLElement);

    expect(summary?.parentElement).toHaveAttribute('open');
    expect(screen.getByRole('heading', { name: 'Engineering decisions' })).toBeInTheDocument();
    expect(screen.getByText('Use a typed registry.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tests and verification' })).toBeInTheDocument();
    expect(screen.getByText('Public test and verification details are not documented yet.')).toBeInTheDocument();
    expect(screen.getByText('Close engineering details')).toBeInTheDocument();
  });

  it('renders Hebrew labels and routes through the injected localized path builder', () => {
    renderComponent('he');

    expect(screen.getByRole('heading', { name: 'תקציר של 30 שניות' })).toBeInTheDocument();
    expect(screen.getByText('הראיה נשארת גלויה.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'כתיבה קשורה' })).toHaveAttribute(
      'href',
      '/he/blog/seo-discovery-is-product-work/',
    );
    expect(buildLocalizedPath).toHaveBeenCalledWith('he', {
      route: 'article',
      id: 'seo-discovery-is-product-work',
    });
  });

  it('requires verified public evidence before presenting documented verification', () => {
    const verifiedCaseStudy: ProjectCaseStudy = {
      ...caseStudy,
      evidenceStatus: 'verified',
      verifiedAt: '2026-10-02',
      evidenceLinks: [
        {
          label: { en: 'Public verification', he: 'אימות ציבורי' },
          url: 'https://example.com/verification',
        },
      ],
    };

    render(
      <MemoryRouter>
        <CaseStudyReadingLevels
          language="en"
          projectId="online_converter"
          buildLocalizedPath={buildLocalizedPath}
          caseStudy={verifiedCaseStudy}
          problem="Problem"
          solution="Approach"
          impact="Outcome"
          role="Contribution"
          githubUrl="https://github.com/example/project"
          verification={{
            status: 'documented',
            items: {
              en: ['Verified public browser check.'],
              he: ['בדיקת דפדפן ציבורית מאומתת.'],
            },
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Verified public browser check.')).toBeInTheDocument();
    expect(screen.queryByText('Public test and verification details are not documented yet.')).not.toBeInTheDocument();
  });

  it('keeps the verification fallback when detailed claims lack public evidence', () => {
    render(
      <MemoryRouter>
        <CaseStudyReadingLevels
          language="en"
          projectId="online_converter"
          buildLocalizedPath={buildLocalizedPath}
          caseStudy={caseStudy}
          problem="Problem"
          solution="Approach"
          impact="Outcome"
          role="Contribution"
          githubUrl="https://github.com/example/project"
          verification={{
            status: 'documented',
            items: {
              en: ['Unverified detail.'],
              he: ['פרט לא מאומת.'],
            },
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Unverified detail.')).not.toBeInTheDocument();
    expect(screen.getByText('Public test and verification details are not documented yet.')).toBeInTheDocument();
  });
});
