# Evyatar Hazan Portfolio

Personal portfolio site for [Evyatar Hazan](https://github.com/Evyatar-Hazan), deployed from `main` to GitHub Pages and Cloudflare Pages.

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

This runs linting, tests, and a production build.

## Production

The `Deploy portfolio` GitHub Actions workflow builds the site once from `main` and publishes the same `dist` artifact to:

- GitHub Pages: https://evyatar-hazan.github.io/
- Cloudflare Pages: https://evyatarhazan.com/

Cloudflare deployment requires these GitHub repository settings:

- Secret: `CLOUDFLARE_API_TOKEN`
- Secret: `CLOUDFLARE_ACCOUNT_ID`
- Variable: `CLOUDFLARE_PAGES_PROJECT_NAME`
