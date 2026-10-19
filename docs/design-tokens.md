# Design tokens

The canonical token source is `src/index.css`. Components consume tokens; they do not introduce palette literals or repeat common shape values.

## Layers

- `--color-*` contains the shared palette. Component-specific accents must alias this layer.
- `--space-*` contains the responsive section-spacing scale. Existing `--home-section-space*` names are compatibility aliases for that scale.
- `--measure-*` limits readable text line lengths. `--measure-body` is the maximum measure for long-form body copy in either writing direction.
- `--radius-*` contains the shared shape scale, from `--radius-xs` through `--radius-3xl`, plus `--radius-circle` and `--radius-pill`.
- `--shadow-*` contains reusable interaction and elevation treatments. Theme-specific values are overridden in `.dark`.
- `--effect-*` and `--home-*` remain semantic compatibility aliases. New aliases should resolve to a foundation token when the value is shared.

## Usage

Use the smallest existing token that expresses the intended role. Add a new foundation token only when the value is reused or represents a deliberate system primitive. One-off geometry such as illustration dimensions may remain local.

The `canonical design tokens` test verifies the color, spacing, radius, and shadow foundations; keeps compatibility aliases on those foundations; and prevents new component color literals or repeated raw radius values from bypassing the shared system.
