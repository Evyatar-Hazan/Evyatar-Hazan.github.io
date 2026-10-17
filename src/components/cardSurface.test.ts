import { describe, expect, it } from 'vitest';
import { CARD_SURFACE_VARIANTS, cardSurfaceClassName } from './cardSurface';

describe('card surface system', () => {
  it('keeps the documented system to exactly three variants', () => {
    expect(CARD_SURFACE_VARIANTS).toEqual(['raised', 'muted', 'interactive']);
  });

  it('composes a variant with a feature-specific layout class', () => {
    expect(cardSurfaceClassName('interactive', 'featured-case-card')).toBe(
      'ui-card ui-card--interactive featured-case-card',
    );
  });
});
