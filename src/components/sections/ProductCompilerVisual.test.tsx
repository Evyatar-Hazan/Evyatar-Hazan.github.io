import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import stylesheet from '../../index.css?raw';
import appSource from '../../App.tsx?raw';
import homeSource from '../../pages/Home.tsx?raw';
import navbarSource from '../Navbar.tsx?raw';
import blogPreviewSource from './BlogPreview.tsx?raw';
import homeSectionPrimitivesSource from './HomeSectionPrimitives.tsx?raw';
import projectsSource from './Projects.tsx?raw';
import contactBriefSource from '../../features/contact/ContactBriefFeature.tsx?raw';
import ProductCompilerVisual from './ProductCompilerVisual';

const labels = {
  business: 'home.compiler.layers.business',
  experience: 'home.compiler.layers.experience',
  engineering: 'home.compiler.layers.engineering',
  ready: 'home.compiler.ready',
};

describe('ProductCompilerVisual', () => {
  it('renders three translated input modules that converge into a complete output', () => {
    render(
      <ProductCompilerVisual
        isHebrew={false}
        labels={labels}
      />,
    );

    const visual = screen.getByTestId('product-compiler-visual');
    expect(visual).toHaveAttribute('aria-hidden', 'true');
    expect(visual.querySelectorAll('[data-compiler-layer]')).toHaveLength(3);
    expect(visual.querySelector('[data-compiler-layer="business"]')).toHaveTextContent(labels.business);
    expect(visual.querySelector('[data-compiler-layer="experience"]')).toHaveTextContent(labels.experience);
    expect(visual.querySelector('[data-compiler-layer="engineering"]')).toHaveTextContent(labels.engineering);
    expect(visual.querySelector('[data-compiler-output="true"]')).toHaveTextContent(labels.ready);
    expect(visual.querySelectorAll('a, button, input, select, textarea, [tabindex]')).toHaveLength(0);
    visual.querySelectorAll('.product-compiler-connectors').forEach((connector) => {
      expect(connector).toHaveAttribute('aria-hidden', 'true');
      expect(connector).toHaveAttribute('focusable', 'false');
    });
  });

  it('keeps RTL on the scene only and does not mirror text or icons', () => {
    render(
      <ProductCompilerVisual
        isHebrew
        labels={labels}
      />,
    );

    const visual = screen.getByTestId('product-compiler-visual');
    expect(visual).toHaveClass('product-compiler-scene-rtl');
    expect(visual.querySelectorAll('.-scale-x-100')).toHaveLength(0);
  });

  it('uses the existing compiler translation keys from Home', () => {
    expect(homeSource).toContain("t('home.compiler.layers.business')");
    expect(homeSource).toContain("t('home.compiler.layers.experience')");
    expect(homeSource).toContain("t('home.compiler.layers.engineering')");
    expect(homeSource).toContain("t('home.compiler.ready')");
  });

  it('stays fully rendered without scroll or pointer-driven motion', () => {
    expect(homeSource).not.toContain('useScroll');
    expect(homeSource).not.toContain('sticky top-0');
    expect(homeSource).not.toContain('h-[150svh]');
    ['product-compiler-flow', 'product-compiler-input', 'product-compiler-output'].forEach((className) => {
      const rule = stylesheet.match(new RegExp(`\\.${className}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
      expect(rule).not.toContain('backdrop-filter');
    });
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).toContain("grid-template-areas:\n      'inputs'\n      'connectors'\n      'output'");
    expect(stylesheet).toContain('.product-compiler-connectors-mobile { display: block;');
    expect(stylesheet).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
    expect(stylesheet).toContain('overflow: hidden;');
  });

  it('keeps home-page content immediate instead of tying visibility to scrolling', () => {
    [blogPreviewSource].forEach((source) => {
      expect(source).not.toContain('whileInView');
      expect(source).not.toContain('useScroll');
      expect(source).not.toContain('useTransform');
    });
    expect(appSource).not.toContain("behavior: 'smooth'");
    expect(navbarSource).not.toContain("behavior: 'smooth'");
    expect(navbarSource).not.toContain('useScroll');
    expect(navbarSource).not.toContain('useMotionValueEvent');
  });

  it('uses one semantic visual system across every homepage section', () => {
    [projectsSource, blogPreviewSource, contactBriefSource].forEach((source) => {
      expect(source).toContain('HomeSectionHeader');
      expect(source).toContain('home-section');
    });
    expect(homeSectionPrimitivesSource).toContain('home-section-header');
    expect(appSource).toContain('data-home-section-fallback');
    [
      '--home-page-max',
      '--home-gutter',
      '--home-section-space',
      '--home-title',
      '--home-surface-raised',
      '--home-border',
      '--home-radius-control',
      '--home-shadow-raised',
    ].forEach((token) => expect(stylesheet).toContain(token));
    expect(stylesheet).toContain('.home-action--primary');
    expect(stylesheet).toContain('.home-action--secondary');
    expect(stylesheet).toContain('.home-section-fallback__rail');
  });
});
