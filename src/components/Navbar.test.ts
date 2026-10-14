import { describe, expect, it } from 'vitest';
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
});
