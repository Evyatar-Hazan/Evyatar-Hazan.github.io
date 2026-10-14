# Production rollback runbook

Use this runbook when a merge on `main` causes a confirmed production regression on the canonical portfolio. A rollback restores the last known-good tree with a new commit and the existing deployment workflow. It never rewrites published history.

## Safety rules

- Confirm the failing merge SHA and the last known-good SHA from GitHub before changing code.
- Pause unrelated merges until both canonical production targets are healthy again.
- Do not use `git reset` on `main`, `git push --force`, or `git push --force-with-lease`.
- Do not push directly to `main`; use a dedicated rollback branch and pull request.
- Do not run a second manual deployment. A merge to `main` must use `.github/workflows/ci.yml` (`Validate and Deploy`) for GitHub Pages and Cloudflare Pages.
- Do not change or redeploy Experience V2 as part of a canonical-site rollback unless its own failure is explicitly in scope.

## Before reverting

1. Record the incident symptom, affected route, failing merge SHA, and last known-good SHA.
2. Verify the failing SHA is on `origin/main`:

   ```bash
   git fetch origin
   git merge-base --is-ancestor <failing-merge-sha> origin/main
   ```

3. Read the `Validate and Deploy` run for the failing SHA. If the problem is only a transient provider deployment failure and the built artifact is known-good, retry the failed job instead of reverting product code.
4. Reproduce or confirm the regression on the affected production URL. Preserve only non-secret evidence needed for the rollback PR.

## Create the rollback

Start from the current remote `main`, not from an older local checkout:

```bash
git fetch origin
git switch --create codex/rollback-<short-description> origin/main
git revert -m 1 <failing-merge-sha>
```

`-m 1` applies when the failing SHA is a pull-request merge commit whose first parent is the previous `main`. For a normal single-parent commit, use `git revert <failing-sha>`. If more than one merge contributed to the regression, stop and identify the exact revert order before running a multi-commit rollback.

Review the generated change, then run the repository gate:

```bash
git status --short
git diff origin/main...HEAD
npm ci
npm run validate
```

Push only the rollback branch:

```bash
git push --set-upstream origin codex/rollback-<short-description>
```

Open a pull request that names the failing SHA, the last known-good SHA, the observed regression, validation results, and the production verification plan. Merge only after all required checks are green and `origin/main` has been checked again for new commits.

## Deployment and production readback

1. Record the rollback PR merge SHA.
2. Follow the `Validate and Deploy` run created for that exact SHA.
3. Require successful `Validate`, `Deploy to GitHub Pages`, `Deploy to Cloudflare Pages`, and every other required job. A green PR run is not deployment evidence.
4. After deployment, hard-refresh or add a cache-busting query and verify the affected route on both:
   - <https://evyatarhazan.com/>
   - <https://evyatar-hazan.github.io/>
5. Confirm the regression is gone, inspect Console and Network, and smoke-test Home, Projects, About, Blog, Contact, mobile navigation, language switching, and theme switching.
6. Record the workflow URL, exact merge SHA, both production readbacks, and any remaining risk in the incident or PR.

If either deployment target or the live readback fails, the rollback is not complete. Keep the incident open and escalate the exact failing job or production symptom.

## Rehearse the Git path

Run:

```bash
npm run test:rollback
```

The rehearsal creates a disposable local remote that rejects non-fast-forward updates, publishes a good commit and a simulated bad release, reverts the bad release on a branch, merges it normally, and verifies that the remote `main` tree matches the last known-good tree while retaining the bad release in history. It does not deploy or alter any real repository.
