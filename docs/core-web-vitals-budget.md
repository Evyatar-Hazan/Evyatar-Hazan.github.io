# Core Web Vitals budget

`FIX-093` makes LCP, CLS, and INP a blocking CI contract for the five primary portfolio routes in both English and Hebrew. The approved budget is stored in `performance/core-web-vitals-budget.json`. Its default thresholds are the recommended “good” values:

- LCP: 2500 ms or less
- CLS: 0.1 or less
- INP: 200 ms or less

The approved `origin/main` baseline measured before this gate was added exposed existing CLS of about `0.659` on the Projects and About routes in both languages. Those four route-language pairs therefore have a narrow route override of `0.70`; the remaining routes retain the `0.10` threshold. This records the existing debt without making it the default, and blocks further regression until a dedicated layout-stability fix can lower and then remove the overrides.

The gate builds the production site, serves it on an ephemeral local port, and measures it in real Chrome at the mobile viewport defined by the budget. It uses the official `web-vitals` browser library, performs a real theme-control interaction so INP is observable, and evaluates the nearest-rank 75th percentile of five cold runs per route. Using p75 lets one anomalous lab run remain visible in the JSON report without making the gate fail by itself.

Run the same checks locally with:

```sh
npm run build
npm run test:core-web-vitals
```

For a non-authoritative smoke run while developing, set `CWV_SAMPLES=1`. CI always uses the five-sample budget and uploads `output/core-web-vitals/report.json`, even when the budget fails.

Any threshold, route, viewport, throttling, or percentile change is a budget change. Review it explicitly instead of updating the numbers merely to make a failing build pass.
