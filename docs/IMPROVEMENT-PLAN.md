# Project Improvement Plan

## 1. Purpose
This document defines a structured, execution-ready plan to improve code quality, performance, maintainability, UX, accessibility, and release safety for this portfolio project.

Scope includes:
- React + TypeScript SPA built with Vite
- Tailwind v4 styling
- Framer Motion animations
- i18n (EN/HE) and RTL support

Out of scope:
- Backend/API redesign (no backend in current scope)
- Major visual rebrand (unless explicitly approved)

---

## 2. Current Baseline (as observed)
### 2.1 Build and Lint
- `npm run build`: passes
- `npm run lint`: fails

### 2.2 Known Lint Findings
1. `src/components/animations/CustomCursor.tsx`
- Error: `setState` called synchronously inside `useEffect`
- Warning: missing dependencies in effect (`cursorX`, `cursorY`)

2. `src/components/sections/Contact.tsx`
- Error: unused variable (`error`)

### 2.3 Dependency State
Several dependencies are behind latest versions (including React, Vite, Tailwind, TypeScript, Framer Motion, ESLint toolchain).

### 2.4 Bundle Snapshot
- Main JS bundle around 417 KB (about 133 KB gzip)
- Improvement opportunity via code splitting and lazy loading

---

## 3. Success Criteria (Definition of Done)
The improvement initiative is complete when all criteria below are met:

1. Quality Gates
- `npm run lint` passes with zero errors
- `npm run build` passes in CI and locally

2. Performance
- Initial JS payload reduced by at least 15-25% (target after split)
- No visible animation jank on mid-range mobile devices

3. Accessibility and UX
- No critical issues in Lighthouse accessibility checks
- Keyboard navigation works for all interactive controls
- Proper ARIA labels for icon-only controls

4. Reliability
- CI pipeline enforces lint + build on every PR
- Basic test suite exists for critical interactions

5. Internationalization and RTL
- EN and HE translations complete for all UI strings
- RTL layout verified for spacing, alignment, and interaction patterns

---

## 4. Prioritized Roadmap
## Phase 1: Stabilize Quality (High impact, low effort)
Goal: remove immediate defects and make quality checks green.

Tasks:
1. Fix lint violations in:
- `src/components/animations/CustomCursor.tsx`
- `src/components/sections/Contact.tsx`

2. Add a local pre-check script:
- `npm run validate` -> runs lint + build

3. Update README developer section with quality workflow.

Acceptance Criteria:
- Lint/build pass consistently
- No new TypeScript warnings introduced

Estimated effort: 0.5-1 day

---

## Phase 2: Performance and Loading Strategy (High impact, medium effort)
Goal: improve first load and perceived performance.

Tasks:
1. Apply route/section-level lazy loading:
- Lazy-load heavy sections where appropriate (for example Projects/Contact)
- Use graceful loading fallbacks that match design language

2. Audit animation costs:
- Avoid layout thrashing
- Keep animations on transform/opacity when possible
- Respect reduced-motion preference

3. Image optimization:
- Verify image dimensions and compression
- Convert oversized assets to optimized formats

Acceptance Criteria:
- Reduced initial JS bundle size
- Good Lighthouse performance trend
- No visual regressions on desktop/mobile

Estimated effort: 1-2 days

---

## Phase 3: Dependency and Tooling Modernization (Medium impact, medium risk)
Goal: reduce technical debt and security/compatibility risk.

Tasks:
1. Patch/minor update wave:
- Update non-breaking versions first
- Re-run lint/build and smoke test after each wave

2. Major update wave (one by one):
- Vite major update
- TypeScript major update
- lucide-react major update
- Any ESLint major updates

3. Lockfile refresh and reproducibility check.

Acceptance Criteria:
- App behavior unchanged after updates
- No broken build/tooling configs
- Changelog of upgraded packages documented

Estimated effort: 1-2 days

---

## Phase 4: Testing Foundation (High impact, medium effort)
Goal: establish regression protection for key user flows.

Tasks:
1. Add test stack:
- Vitest
- React Testing Library
- Optional: jsdom setup utilities

2. Add baseline tests for critical areas:
- Theme toggle behavior
- Language switch EN/HE
- Navbar mobile menu open/close and body overflow cleanup
- Core section rendering smoke tests

3. Add test command scripts:
- `npm run test`
- `npm run test:watch`

Acceptance Criteria:
- Tests run locally and in CI
- Critical interaction regressions are caught automatically

Estimated effort: 1-2 days

---

## Phase 5: Accessibility, SEO, and Content Quality (Medium impact, low-medium effort)
Goal: improve discoverability and inclusive UX.

Tasks:
1. Accessibility audit:
- Heading hierarchy
- ARIA labels and roles
- Focus visibility and tab order
- Color contrast in light/dark themes

2. SEO/meta:
- Title/description quality
- Open Graph + Twitter metadata
- Image alt text completeness

3. i18n content completeness:
- Verify EN/HE parity
- Remove hardcoded strings from components

Acceptance Criteria:
- No major accessibility blockers
- SEO metadata present and valid
- Full translation coverage

Estimated effort: 1 day

---

## Phase 6: CI/CD Guardrails (High impact, low effort)
Goal: prevent regressions and standardize merge quality.

Tasks:
1. Add GitHub Actions workflow:
- Install dependencies
- Run lint
- Run build
- Run tests

2. Enforce required checks on PR before merge.

3. Optional: dependency update automation (Dependabot/Renovate).

Acceptance Criteria:
- PRs blocked when quality gates fail
- Main branch remains release-ready

Estimated effort: 0.5-1 day

---

## 5. Execution Order (Recommended)
1. Phase 1 -> unblock quality gates
2. Phase 2 -> gain real performance wins
3. Phase 4 -> add test safety net before riskier updates
4. Phase 3 -> dependency modernization with tests active
5. Phase 5 -> accessibility/SEO polish
6. Phase 6 -> enforce standards in CI

Note: Phase 6 can start earlier in parallel if preferred.

---

## 6. Risk Register and Mitigation
1. Risk: Animation regressions after performance tuning
- Mitigation: compare before/after recordings; review reduced-motion path

2. Risk: RTL spacing breaks during refactors
- Mitigation: mandatory EN + HE visual QA checklist on each phase

3. Risk: Major dependency updates break configs
- Mitigation: update one major at a time with checkpoint tags/commits

4. Risk: Mobile menu leaves body scroll locked
- Mitigation: explicit tests for overflow cleanup on close/unmount

---

## 7. Quality Checklist Per PR
1. `npm run lint` passes
2. `npm run build` passes
3. Tests pass (once Phase 4 is in)
4. Manual verification:
- Desktop + mobile
- Light + dark mode
- EN (LTR) + HE (RTL)

---

## 8. Suggested Milestone Plan
- Milestone A (Day 1): Phase 1 complete
- Milestone B (Day 2-3): Phase 2 complete
- Milestone C (Day 4-5): Phase 4 complete
- Milestone D (Day 6-7): Phase 3 + Phase 5 complete
- Milestone E (Day 8): Phase 6 complete and final hardening

Total estimated duration: 5-8 working days depending on review and QA depth.

---

## 9. Tracking Template
Use this simple tracker in your issue board:

| Item | Owner | Status | Priority | ETA | Notes |
|---|---|---|---|---|---|
| Phase 1 - Lint fixes | TBD | Todo | P0 | 1 day | |
| Phase 2 - Lazy loading | TBD | Todo | P1 | 2 days | |
| Phase 4 - Testing setup | TBD | Todo | P1 | 2 days | |
| Phase 3 - Dependencies | TBD | Todo | P1 | 2 days | |
| Phase 5 - A11y/SEO/i18n | TBD | Todo | P2 | 1 day | |
| Phase 6 - CI checks | TBD | Todo | P0 | 1 day | |

---

## 10. Immediate Next Action
Start with Phase 1 and open one focused PR:
- PR title: `chore: fix lint blockers and stabilize quality gate`
- Include only lint fixes and validation script updates
- Verify lint/build before merge
