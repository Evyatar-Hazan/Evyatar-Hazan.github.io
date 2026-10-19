# Surface opacity contract

`FIX-026` replaces glass-like reading surfaces with solid, theme-aware materials. The goal is sharper hierarchy, more predictable contrast, and less compositing work without flattening the portfolio's accent system.

## Principal surfaces

The compiler, About, Projects, Writing, Contact, system shell, and Blog panel tokens are opaque in both light and dark themes. Case-study fact panels, localized hero secondary actions, blog demo outcomes, project media labels, the fixed contact control, and Blog archive cards follow the same contract.

Principal surfaces must:

- resolve to an alpha value of `1` in Chrome;
- avoid `backdrop-filter` and `-webkit-backdrop-filter`;
- keep borders, restrained shadows, grid lines, and accent rules available for hierarchy;
- preserve the existing language and theme controls in their current order and position.

Decorative overlays may still use transparency when they do not carry primary text or define a reading surface. Examples include focus rings, dimmed menu backdrops, image gradients, grid lines, and accent glows.

## Verification

`src/surface-opacity.test.ts` protects the source-level token and blur contract. `tests/browser/surface-opacity.pw.mjs` verifies computed opacity and blur behavior in light and dark themes across desktop and mobile routes.
