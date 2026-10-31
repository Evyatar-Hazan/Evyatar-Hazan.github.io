import { describe, expect, it } from 'vitest';
import stylesheet from './index.css?raw';
import caseStudyStylesheet from './components/CaseStudyStory.css?raw';
import heroStylesheet from './components/sections/LocalizedHeroLayout.module.css?raw';
import projectsStylesheet from './components/sections/Projects.css?raw';

const stylesheets = {
  'index.css': stylesheet,
  'CaseStudyStory.css': caseStudyStylesheet,
  'LocalizedHeroLayout.module.css': heroStylesheet,
  'Projects.css': projectsStylesheet,
};

const opaqueSurfaceTokens = [
  '--effect-compiler-layer',
  '--effect-about-module',
  '--effect-project-panel',
  '--effect-project-panel-muted',
  '--effect-writing-paper',
  '--effect-writing-paper-muted',
  '--effect-contact-panel',
  '--effect-contact-panel-muted',
  '--effect-shell-surface',
  '--effect-shell-surface-strong',
  '--effect-blog-paper',
  '--effect-blog-paper-muted',
];

describe('FIX-026 opaque surface contract', () => {
  it('keeps every principal surface token free of transparent color stops in both themes', () => {
    for (const token of opaqueSurfaceTokens) {
      const declarations = [...stylesheet.matchAll(new RegExp(`${token}:\\s*([^;]+);`, 'g'))];
      expect(declarations.length, token).toBe(2);
      for (const declaration of declarations) {
        expect(declaration[1], token).not.toContain('transparent');
      }
    }
  });

  it('does not reintroduce backdrop blur into application surfaces', () => {
    for (const [path, source] of Object.entries(stylesheets)) {
      expect(source, path).not.toMatch(/(?:-webkit-)?backdrop-filter\s*:/);
    }
  });

  it('keeps page-specific reading panels opaque', () => {
    expect(caseStudyStylesheet.match(/--case-panel:[^;]+;/g)).toHaveLength(2);
    expect(caseStudyStylesheet.match(/--case-panel:[^;]+;/g)?.every((value) => !value.includes('transparent'))).toBe(true);
    expect(heroStylesheet).toContain('background: var(--color-primary-700);');
    expect(projectsStylesheet).toContain('var(--color-neutral-950) 88%, var(--color-black)');
  });
});
