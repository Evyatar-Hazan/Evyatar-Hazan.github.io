export const CARD_SURFACE_VARIANTS = ['raised', 'muted', 'interactive'] as const;

export type CardSurfaceVariant = (typeof CARD_SURFACE_VARIANTS)[number];

export const cardSurfaceClassName = (
  variant: CardSurfaceVariant,
  className = '',
) => `ui-card ui-card--${variant} ${className}`.trim();
