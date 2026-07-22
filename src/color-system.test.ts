import { describe, expect, it } from 'vitest';
import stylesheet from './index.css?raw';

const componentSources = import.meta.glob('./**/*.{ts,tsx}', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

describe('color system', () => {
  it('defines one centralized palette with light and dark effect tokens', () => {
    expect(stylesheet).toContain('@theme');
    expect(stylesheet).toContain('--color-primary-500');
    expect(stylesheet).toContain('--color-accent-600');
    expect(stylesheet).toContain('--color-success-500');
    expect(stylesheet).toContain('--color-warning-300');
    expect(stylesheet).toContain('--color-danger-600');
    expect(stylesheet).toMatch(/:root\s*{/);
    expect(stylesheet).toMatch(/\.dark\s*{/);
  });

  it('keeps component colors semantic and free of hardcoded color literals', () => {
    const legacyPalettePattern = new RegExp(`(?:${['emerald', 'cyan', 'purple', 'red', 'amber'].join('|')})-\\d{2,3}`);
    const hardcodedColorPattern = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i;

    for (const [path, source] of Object.entries(componentSources)) {
      if (path.includes('.test.')) continue;

      expect(source, path).not.toMatch(legacyPalettePattern);
      expect(source, path).not.toMatch(hardcodedColorPattern);
    }
  });
});
