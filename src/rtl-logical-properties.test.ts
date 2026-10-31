import { describe, expect, it } from 'vitest';
import scrollProgressSource from './components/animations/ScrollProgress.tsx?raw';

const stylesheets = import.meta.glob('./**/*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const physicalProperty = /^\s*(?:left|right|margin-left|margin-right|padding-left|padding-right|border-left|border-right|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius)\s*:/gim;
const physicalTransformOrigin = /^\s*transform-origin\s*:\s*(?:left|right)\b/gim;
const directionalInsetShorthand = /^\s*inset\s*:\s*(?:[^\s;]+\s+){2,3}[^\s;]+\s*;/gim;

describe('FIX-088 logical RTL layout contract', () => {
  it('keeps production styles free of physical inline layout declarations', () => {
    const violations = Object.entries(stylesheets).flatMap(([path, source]) => {
      const matches = [
        ...source.matchAll(physicalProperty),
        ...source.matchAll(physicalTransformOrigin),
        ...source.matchAll(directionalInsetShorthand),
      ];

      return matches.map((match) => `${path}:${source.slice(0, match.index).split('\n').length} ${match[0].trim()}`);
    });

    expect(violations).toEqual([]);
  });

  it('centralizes the unavoidable transform direction instead of adding component RTL overrides', () => {
    const stylesheet = stylesheets['./index.css'];
    const componentOverrides = Object.entries(stylesheets).flatMap(([path, source]) => (
      path === './index.css'
        ? []
        : [...source.matchAll(/\[dir=['"]rtl['"]\]/g)].map((match) => `${path}:${match.index}`)
    ));

    expect(stylesheet).toContain('--inline-direction: 1;');
    expect(stylesheet).toContain('--inline-start-origin: 0%;');
    expect(stylesheet).toContain(":root[dir='rtl']");
    expect(componentOverrides).toEqual([]);
    expect(scrollProgressSource).toContain('className="fixed inset-x-0 top-0');
    expect(scrollProgressSource).not.toMatch(/\bleft-0\b|\bright-0\b/);
  });
});
