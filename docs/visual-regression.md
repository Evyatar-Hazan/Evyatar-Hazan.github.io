# FIX-002 visual regression gate

The pull-request gate compares the candidate production build with the approved live baseline at `https://evyatarhazan.com` in the same installed Chrome process. It covers Home, Projects, About, Blog, and Contact across English/RTL Hebrew, light/dark themes, and the required `1440×900` desktop and `390×844` mobile viewports.

The comparison disables motion, waits for fonts and network idle, and ignores anti-aliasing-only differences. A case is significant when more than 1% of pixels change or the full-page dimensions drift by more than 8px. Small rendering noise therefore remains green.

Run after `npm run build`:

```bash
npm run test:visual
```

The report is written to `test-results/visual-regression/`. For every significant case it contains `baseline.png`, `candidate.png`, and `diff.png`, plus `index.html` and machine-readable `summary.json`. CI uploads the directory as the `visual-regression-report` artifact even when the gate fails.

An intentional visual change still requires human review of that artifact. After review, adding the `visual-change-approved` label keeps the evidence visible while allowing the PR check to pass. The label is approval for the displayed visual delta only; it does not authorize unrelated code or deployment changes.
