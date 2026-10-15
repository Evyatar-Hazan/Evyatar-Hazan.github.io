import { describe, expect, it } from 'vitest';
import packageSource from '../../package.json?raw';
import stylesheet from '../index.css?raw';
import navbarSource from './Navbar.tsx?raw';

describe('mobile navigation sheet contract', () => {
  it('anchors an opaque, near-full-height sheet with logical properties', () => {
    const sheetRule = stylesheet.match(/\.system-rail-mobile-menu\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(sheetRule).toContain('inset-block-start: 5rem');
    expect(sheetRule).toContain('inset-block-end: 0');
    expect(sheetRule).toContain('inset-inline-end: 0');
    expect(sheetRule).toContain('width: min(92vw, 28rem)');
    expect(sheetRule).toContain('height: auto');
    expect(sheetRule).toContain('border-inline-start');
    expect(sheetRule).toContain('border-start-start-radius');
    expect(sheetRule).not.toContain('backdrop-filter');
    expect(sheetRule).not.toContain('inset-inline:');
  });

  it('keeps controlled internal scrolling, low-height compaction, and reduced motion', () => {
    expect(stylesheet).toContain('.system-rail-mobile-scroll');
    expect(stylesheet).toContain('overscroll-behavior: contain');
    expect(stylesheet).toContain('@media (max-width: 767px) and (max-height: 620px)');
    expect(stylesheet).toContain('height: calc(100dvh - 5rem)');
    expect(stylesheet).toContain('min-height: clamp(2.15rem, 9dvh, 2.85rem)');
    expect(stylesheet).toContain('padding-block: 0.2rem');
    expect(stylesheet).toMatch(/\.system-rail-mobile-context\s*{[^}]*display: none/);
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(navbarSource).toContain('initial={reduceMotion ? false');
    expect(navbarSource).toContain('duration: reduceMotion ? 0 : 0.28');
  });

  it('keeps the canonical registries and native anchor behavior', () => {
    expect(navbarSource).toContain('primaryNavigation.map');
    expect(navbarSource).toContain('secondaryNavigation.map');
    expect(navbarSource).not.toContain('onClick={(event');
    expect(navbarSource).toContain("item.id === 'contact' ? 'is-contact'");
    expect(navbarSource).toContain('className="system-rail-language system-rail-mobile-language"');
    expect(navbarSource.match(/className="system-rail-mobile-theme"/g)).toBeNull();
  });

  it('documents and runs the stable-control gate in every canonical validation', () => {
    const packageJson = JSON.parse(packageSource);

    expect(packageJson.scripts['test:ui-invariants']).toContain('stable-ui-invariants.pw.mjs');
    expect(packageJson.scripts.validate).toContain('npm run test:ui-invariants');
  });
});
