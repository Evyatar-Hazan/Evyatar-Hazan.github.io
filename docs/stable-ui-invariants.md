# FIX-006 stable UI invariants

These invariants protect the portfolio shell during every UI change. They are deliberately narrow: they preserve stable controls without preventing intentional redesign elsewhere.

## Navbar controls

1. The language and theme controls stay in the fixed navbar utility area. They are never moved into, or duplicated inside, the mobile navigation dialog.
2. Mobile keeps exactly one language control and one theme control inside `.system-rail-mobile-actions`, in that order before the menu trigger.
3. Opening and closing the mobile menu must not change either control's `getBoundingClientRect()`. Theme changes must not change those rectangles either.
4. Switching language may mirror the navbar's physical alignment because the document changes between LTR and RTL, but the controls must remain in the same logical navbar utility area and keep their order and behavior.
5. Both controls remain keyboard reachable, keep their accessible names and state, and continue to work in Hebrew, English, light mode, and dark mode.

## Required check for UI work

`npm run validate` is the canonical gate for every UI fix. It includes `npm run test:ui-invariants`, which runs the invariant checks in installed Chrome at mobile widths `320`, `390`, and `430`, for English/LTR and Hebrew/RTL, in light and dark modes.

The gate verifies control ownership, uniqueness, visibility, order, functionality, and stable geometry before, during, and after the mobile menu. An intentional change to one of these invariants requires explicit owner approval and a matching update to this document and its browser test.
