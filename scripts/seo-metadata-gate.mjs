import { readFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const siteOrigin = 'https://evyatarhazan.com';

const extractExactlyOne = (html, pattern, label, routePath) => {
  const matches = [...html.matchAll(pattern)];
  if (matches.length !== 1 || !matches[0][1]?.trim()) {
    throw new Error(`${routePath} must contain exactly one non-empty ${label}.`);
  }
  return matches[0][1].trim();
};

const assertUnique = (records, field) => {
  const owners = new Map();
  for (const record of records) {
    const existing = owners.get(record[field]);
    if (existing) {
      throw new Error(`${field} must be unique: ${existing} and ${record.routePath} share ${JSON.stringify(record[field])}.`);
    }
    owners.set(record[field], record.routePath);
  }
};

const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/evyatarhazan\.com\/[^<]*)<\/loc>/gu)]
  .map((match) => match[1]);

if (urls.length === 0) throw new Error('The generated sitemap contains no canonical routes.');

const records = [];
for (const canonical of urls) {
  const routePath = new URL(canonical).pathname;
  const htmlPath = path.join(distDir, routePath.replace(/^\/+|\/+$/gu, ''), 'index.html');
  const html = await readFile(htmlPath, 'utf8');
  const record = {
    routePath,
    title: extractExactlyOne(html, /<title>([^<]+)<\/title>/gu, 'title', routePath),
    description: extractExactlyOne(html, /<meta name="description" content="([^"]+)" \/>/gu, 'description', routePath),
    canonical: extractExactlyOne(html, /<link rel="canonical" href="([^"]+)" \/>/gu, 'canonical', routePath),
    ogTitle: extractExactlyOne(html, /<meta property="og:title" content="([^"]+)" \/>/gu, 'og:title', routePath),
    ogDescription: extractExactlyOne(html, /<meta property="og:description" content="([^"]+)" \/>/gu, 'og:description', routePath),
    ogUrl: extractExactlyOne(html, /<meta property="og:url" content="([^"]+)" \/>/gu, 'og:url', routePath),
    ogLocale: extractExactlyOne(html, /<meta property="og:locale" content="([^"]+)" \/>/gu, 'og:locale', routePath),
  };

  if (record.canonical !== canonical || record.ogUrl !== canonical) {
    throw new Error(`${routePath} canonical and og:url must equal ${canonical}.`);
  }
  if (record.title !== record.ogTitle || record.description !== record.ogDescription) {
    throw new Error(`${routePath} Open Graph title and description must match the page metadata.`);
  }
  const expectedLocale = routePath.startsWith('/he/') ? 'he_IL' : 'en_US';
  if (record.ogLocale !== expectedLocale) {
    throw new Error(`${routePath} must publish og:locale ${expectedLocale}.`);
  }

  records.push(record);
}

for (const field of ['title', 'description', 'canonical', 'ogTitle', 'ogDescription', 'ogUrl']) {
  assertUnique(records, field);
}

console.log(`SEO metadata gate passed: ${records.length}/${records.length} routes have unique, aligned title, description, canonical, and Open Graph metadata.`);
