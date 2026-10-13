import { render, screen } from '@testing-library/react';
import { motionValue } from 'framer-motion';
import { describe, expect, it } from 'vitest';
import stylesheet from '../../index.css?raw';
import homeSource from '../../pages/Home.tsx?raw';
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
        progress={motionValue(0)}
        reduceMotion={false}
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
  });

  it('keeps RTL on the scene only and does not mirror text or icons', () => {
    render(
      <ProductCompilerVisual
        progress={motionValue(0)}
        reduceMotion
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

  it('defines a stable reduced-motion state and a dedicated overflow-safe mobile composition', () => {
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).toMatch(/\.product-compiler-scene,[\s\S]*opacity:\s*1\s*!important;[\s\S]*transform:\s*none\s*!important;/);
    expect(stylesheet).toContain("grid-template-areas:\n      'inputs'\n      'connectors'\n      'output'");
    expect(stylesheet).toContain('.product-compiler-connectors-mobile { display: block;');
    expect(stylesheet).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
    expect(stylesheet).toContain('overflow: hidden;');
  });
});
