# Design tokens

The canonical token source is `src/index.css`. Components consume tokens; they do not introduce palette literals or repeat common shape values.

## Layers

- `--color-*` contains the shared palette. Component-specific accents must alias this layer.
- `--radius-*` contains the shared shape scale, from `--radius-xs` through `--radius-3xl`, plus `--radius-circle` and `--radius-pill`.
- `--shadow-*` contains reusable interaction and elevation treatments. Theme-specific values are overridden in `.dark`.
- `--effect-*` and `--home-*` remain semantic compatibility aliases. New aliases should resolve to a foundation token when the value is shared.

## Usage

Use the smallest existing token that expresses the intended role. Add a new foundation token only when the value is reused or represents a deliberate system primitive. One-off geometry such as illustration dimensions may remain local.

The `canonical design tokens` test prevents new component color literals and repeated raw radius values from bypassing the shared system.
