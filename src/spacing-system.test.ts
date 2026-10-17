import { describe, expect, it } from 'vitest';
import stylesheet from './index.css?raw';
import caseStudyStylesheet from './components/CaseStudyStory.css?raw';
import projectsStylesheet from './pages/ProjectsPage.css?raw';
import aboutPageSource from './pages/AboutPage.tsx?raw';

const ruleBody = (css: string, selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
};

describe('FIX-025 canonical section spacing', () => {
  it('defines one responsive spacing scale and keeps the homepage aliases on it', () => {
    expect(stylesheet).toContain('--space-section-compact: clamp(3.5rem, 5vw, 5rem);');
    expect(stylesheet).toContain('--space-section: clamp(4rem, 7vw, 6rem);');
    expect(stylesheet).toContain('--space-section-spacious: clamp(4.75rem, 7vw, 7rem);');
    expect(stylesheet).toContain('--home-section-space: var(--space-section-spacious);');
    expect(stylesheet).toContain('--home-section-space-compact: var(--space-section-compact);');
  });

  it('uses semantic section classes instead of page-specific vertical padding', () => {
    const sectionSpaceRule = ruleBody(stylesheet, '.section-space');
    expect(sectionSpaceRule).toContain('margin-block: 0;');
    expect(sectionSpaceRule).toContain('padding-block: var(--space-section);');
    expect(aboutPageSource.match(/className="section-space /g)).toHaveLength(3);
    expect(aboutPageSource).not.toContain('className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12"');
  });

  it('keeps major page boundaries on spacing tokens without arbitrary margins', () => {
    expect(ruleBody(projectsStylesheet, '.projects-hub-section')).toContain('padding-block: var(--space-section-spacious);');
    expect(ruleBody(caseStudyStylesheet, '.case-story-section')).toContain('padding-block: var(--space-section);');
    expect(ruleBody(caseStudyStylesheet, '.case-story-section')).toContain('margin-block: 0;');

    for (const selector of ['.reading-routes-section', '.blog-library', '.blog-reading-layout', '.blog-article-next']) {
      const rule = ruleBody(stylesheet, selector);
      expect(rule).toContain('margin-block-start: var(--space-section');
      expect(rule).not.toContain('margin-top: clamp(');
    }
  });
});
