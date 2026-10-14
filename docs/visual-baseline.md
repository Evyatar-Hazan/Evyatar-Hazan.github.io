# FIX-001 visual baseline

The visual baseline is generated from the localized routes in the built `dist/sitemap.xml`. This keeps the route inventory aligned with the same build contract that produces the production sitemap.

The complete matrix contains:

- every canonical route in English and Hebrew;
- light and dark themes;
- desktop at `1440×900` and mobile at `390×844`;
- full-page WebP screenshots captured with the installed Google Chrome channel;
- a manifest with the source SHA, route matrix, file sizes, and SHA-256 hashes.

Run a complete capture after `npm run build`:

```bash
npm run capture:baseline -- \
  --base-url https://evyatarhazan.com \
  --source-sha <deployed-merge-sha> \
  --headed
```

The default output is `output/playwright/fix-001-baseline/`. The directory is intentionally ignored by Git because screenshots and browser artifacts are release evidence, not source files. Preserve the completed directory or an archive of it with the release evidence.

For a bounded local smoke capture, add `--limit 4`. For matrix inspection without opening Chrome, add `--plan-only`.

The capture fails when a route is missing its paired language, the loaded `lang`, `dir`, or theme does not match the matrix entry, horizontal overflow is present, or the expected screenshot count is not produced.
