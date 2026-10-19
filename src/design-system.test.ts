import { describe, expect, it } from 'vitest';
import stylesheet from './index.css?raw';

const componentStyles = import.meta.glob('./**/*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

describe('canonical design tokens', () => {
  it('defines shared color, spacing, measure, radius, and shadow foundations', () => {
    for (const token of [
      '--color-copper-600',
      '--color-cyan-600',
      '--color-orange-600',
      '--color-warning-400',
      '--color-warning-700',
      '--space-section-compact',
      '--space-section',
      '--space-section-spacious',
      '--measure-body',
      '--radius-xs',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
      '--radius-xl',
      '--radius-2xl',
      '--radius-3xl',
      '--radius-circle',
      '--radius-pill',
      '--shadow-inset-highlight',
      '--shadow-card-subtle',
      '--shadow-focus-primary',
      '--shadow-drawer-start',
      '--shadow-drawer-end',
    ]) {
      expect(stylesheet, token).toContain(token);
    }
  });

  it('keeps component color values sourced from the centralized palette', () => {
    const hardcodedColorPattern = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i;

    for (const [path, source] of Object.entries(componentStyles)) {
      if (path.endsWith('/index.css')) continue;
      expect(source, path).not.toMatch(hardcodedColorPattern);
    }
  });

  it('routes repeated component radii through the canonical scale', () => {
    const repeatedRawRadius = /border-radius:\s*(?:0\.25|0\.5|0\.75|1|1\.25|1\.5|2)rem\b|border-radius:\s*(?:50%|999px)/;

    for (const [path, source] of Object.entries(componentStyles)) {
      expect(source, path).not.toMatch(repeatedRawRadius);
    }
  });

  it('keeps compatibility aliases on the canonical radius scale', () => {
    expect(stylesheet).toContain('--home-radius-control: var(--radius-md);');
    expect(stylesheet).toContain('--home-radius-panel: var(--radius-xl);');
  });

  it('keeps compatibility aliases on the canonical spacing scale', () => {
    expect(stylesheet).toContain('--home-section-space: var(--space-section-spacious);');
    expect(stylesheet).toContain('--home-section-space-compact: var(--space-section-compact);');
  });

  it('keeps long-form body copy on the canonical readable measure', () => {
    expect(stylesheet).toContain('--measure-body: 62ch;');
    expect(stylesheet).toContain('max-inline-size: var(--measure-body);');
    expect(stylesheet).toMatch(/\.blog-prose\s*{[^}]*max-inline-size:\s*var\(--measure-body\)/s);
  });
});
