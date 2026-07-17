# Evyatar Hazan Portfolio

Personal portfolio site for [Evyatar Hazan](https://github.com/Evyatar-Hazan), deployed from `main` to GitHub Pages and Cloudflare Pages.

## Experience V2

The existing production site remains canonical while the next portfolio experience is built and reviewed in isolation at [experience.evyatarhazan.com](https://experience.evyatarhazan.com/). Progress, decisions, approval gates, success criteria, and regression tracking live in [the Experience V2 source of truth](docs/portfolio-experience-v2-source-of-truth.md).

## Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- i18next
- GitHub Actions deployment

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run validate
```

This runs linting, tests, and a production build for the canonical site. Experience V2 has its own validation command:

```bash
npm ci --prefix experiments/portfolio-experience-v2
npm run validate --prefix experiments/portfolio-experience-v2
```

## Production

The `Validate and Deploy` GitHub Actions workflow builds the site once from `main` and publishes the same `dist` artifact to:

- GitHub Pages: https://evyatar-hazan.github.io/
- Cloudflare Pages: https://evyatarhazan.com/

The same workflow independently validates Experience V2 and deploys its separate build to:

- Cloudflare Pages preview: https://experience.evyatarhazan.com/

The V2 job uses the dedicated `evyatar-portfolio-v2` Pages project. It does not replace the canonical site, its build artifact, or either legacy deployment target.

Cloudflare deployment requires these GitHub repository settings:

- Secret: `CLOUDFLARE_API_TOKEN`
- Secret: `CLOUDFLARE_ACCOUNT_ID`
- Variable: `CLOUDFLARE_PAGES_PROJECT_NAME`
