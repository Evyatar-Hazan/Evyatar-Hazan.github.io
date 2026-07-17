# Design QA — Signal Forge Hero → NIS Technical Spike

Date: 2026-07-14

## Evidence

- Desktop source target: `design-qa-reference-desktop.png`
- Desktop implementation: `design-qa-implementation-desktop.png`
- Desktop side-by-side: `design-qa-comparison-desktop.png`
- Mobile source target: `design-qa-reference-mobile.png`
- Mobile implementation: `design-qa-implementation-mobile.png`
- Mobile side-by-side: `design-qa-comparison-mobile.png`
- Compared viewports: desktop `1440×900`; mobile `390×844`.

## Iteration record

### Pass 1 — blocked

- P1: mobile CTA stack was positioned against the content container and covered the headline.
- P1: mobile artwork started too early and reduced supporting-copy contrast.
- P2: desktop signal map was a tall list and did not preserve the compact handoff visible in the approved target.
- P2: the legacy Tailwind build scanned the isolated experiment and increased the generated legacy CSS artifact.

### Fixes

- Reflowed the mobile Hero into headline → short supporting copy → portrait artwork → CTA stack → signal map.
- Matched the mobile target density with smaller responsive type and a dedicated short supporting line.
- Rebuilt desktop signals as a compact horizontal conductor rail while preserving mobile rows.
- Added `@source not "../experiments"` to the legacy Tailwind entry so V2 class names cannot enter the existing production CSS.
- Recompressed the generated Hero artwork from `2.1 MB` PNG to `149 KB` WebP.

### Pass 2 — passed

- No P0, P1 or P2 visual differences remain.
- Desktop hierarchy, split composition, palette, sculpture focus, CTA treatment and compact signal handoff match the approved direction.
- Mobile hierarchy, artwork crop, stacked CTAs and signal entry match the selected portrait target without horizontal overflow.
- Remaining P3 differences are intentional: the implementation uses the real Evyatar mark instead of the concept cube, the generated production asset has a distinct ribbon arrangement, and the conductor is a maintainable navigation rail rather than a copied curve.

## Interaction and rendering checks

- English/Hebrew switch updates `lang`, `dir`, copy and RTL layout.
- Mobile menu opens and closes with correct accessible state.
- Primary CTA reaches `#signals`; Conversion reaches `#work`.
- Desktop and mobile report zero horizontal overflow.
- Browser console reported no errors in the checked desktop and mobile states.
- Real NIS imagery replaces abstraction at the project handoff.
- Reduced-motion CSS removes smooth scrolling, pointer movement and reveal transforms.

## Build evidence

- V2 JavaScript: `212.95 KB` minified / `66.19 KB` gzip.
- V2 CSS: `15.29 KB` minified / `4.06 KB` gzip.
- Signal Forge Hero asset: `149 KB` WebP.
- `npm run build` passes in the isolated V2 directory.
- Legacy `npm run validate` passes with `18/18` tests and the original `63.96 KB` CSS / `807.79 KB` JavaScript artifacts restored.

final result: passed
