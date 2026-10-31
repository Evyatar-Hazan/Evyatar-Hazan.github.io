import { describe, expect, it } from 'vitest';
import mainSource from './main.tsx?raw';
import stylesheet from './index.css?raw';
import buttonSource from './components/Button.tsx?raw';
import cardSource from './components/Card.tsx?raw';
import magneticSource from './components/animations/Magnetic.tsx?raw';
import localizedHeroSource from './components/sections/LocalizedHeroLayout.tsx?raw';

describe('FIX-086 reduced-motion contract', () => {
  it('configures the Framer Motion tree to respect the user preference', () => {
    expect(mainSource).toContain('<MotionConfig reducedMotion="user">');
  });

  it('applies one global CSS fallback to elements and pseudo-elements', () => {
    expect(stylesheet).toContain(':where(*, *::before, *::after)');
    expect(stylesheet).toContain('animation-duration: 0s !important');
    expect(stylesheet).toContain('animation-iteration-count: 1 !important');
    expect(stylesheet).toContain('transition-duration: 0s !important');
    expect(stylesheet).toContain('scroll-behavior: auto !important');
  });

  it('removes direct pointer and motion-value transforms when motion is reduced', () => {
    [buttonSource, cardSource, magneticSource, localizedHeroSource].forEach((source) => {
      expect(source).toContain('useReducedMotion');
    });
    expect(cardSource).toContain('rotateX: reduceMotion ? 0 : rotateX');
    expect(magneticSource).toContain('if (reduceMotion) return');
    expect(localizedHeroSource).toContain('style={reduceMotion ? undefined : copyStyle}');
  });
});
