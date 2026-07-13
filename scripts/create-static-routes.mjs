import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, 'dist');
const srcDir = path.join(repoRoot, 'src');
const siteUrl = 'https://evyatarhazan.com';

const normalizePath = (routePath) => {
  if (!routePath || routePath === '/') return '/';
  return routePath.endsWith('/') ? routePath : `${routePath}/`;
};

const absoluteUrl = (routePath) => `${siteUrl}${normalizePath(routePath) === '/' ? '/' : normalizePath(routePath)}`;
const toRelativeDir = (routePath) => normalizePath(routePath).replace(/^\/+/, '');
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const removeAdSenseScript = (html) => html.replace(
  /\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-6696643120887220"[\s\S]*?<\/script>/,
  ''
);

const rootHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');

const blogSource = await readFile(path.join(srcDir, 'content', 'blog', 'posts.ts'), 'utf8');
const blogFiles = await readdir(path.join(srcDir, 'content', 'blog'));
const blogSlugs = [...new Set(
  blogFiles
    .filter((file) => file.endsWith('.en.mdx'))
    .map((file) => file.replace(/\.en\.mdx$/, ''))
)];

const blogEntries = [...blogSource.matchAll(/slug:\s*'([^']+)'[\s\S]*?language:\s*'en'[\s\S]*?title:\s*'([^']+)'[\s\S]*?excerpt:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'[\s\S]*?tags:\s*\[([^\]]*)\]/g)]
  .map((match) => ({
    slug: match[1],
    title: match[2],
    excerpt: match[3],
    date: match[4],
    tags: match[5].replace(/'/g, '').split(',').map((value) => value.trim()).filter(Boolean)
  }));

const profileSource = await readFile(path.join(srcDir, 'data', 'profile.ts'), 'utf8');
const projectBlocks = [
  { id: 'nis_boutique', caseKey: 'nis_boutique', name: 'Nis Boutique Catering' },
  { id: 'online_converter', caseKey: 'online_converter', name: 'Online Converter' },
  { id: 'emergency_protocol', caseKey: 'emergency_protocol', name: 'Emergency Protocol Diagram' },
  { id: 'united_hatzalah', caseKey: 'united_hatzalah', name: 'United Hatzalah Shoham Branch' }
];

const extractCaseStudyValue = (caseKey, field) => {
  const regex = new RegExp(`${caseKey}:\\s*\\{[\\s\\S]*?${field}:\\s*\\{[\\s\\S]*?en:\\s*'([^']+)'`, 'm');
  const match = profileSource.match(regex);
  return match?.[1] ?? '';
};

const extractOverviewParagraph = (caseKey) => {
  const regex = new RegExp(`${caseKey}:\\s*\\{[\\s\\S]*?overview:\\s*\\{[\\s\\S]*?en:\\s*\\[\\s*'([^']+)'`, 'm');
  const match = profileSource.match(regex);
  return match?.[1] ?? '';
};

const staticRoutes = [
  {
    path: '/',
    title: 'Evyatar Hazan | Full Stack Developer',
    description: 'Portfolio of Evyatar Hazan, a full stack developer building business websites, structured tools, automation workflows, and maintainable product systems.',
    preview: {
      heading: 'Evyatar Hazan | Full Stack Developer',
      body: [
        'Portfolio with case studies, live product work, technical writing, and direct contact options.',
        'Includes business websites, converter products, full-stack systems, and production-minded delivery examples.'
      ],
      links: [
        { href: '/blog/', label: 'Writing' },
        { href: '/contact/', label: 'Contact' },
        { href: '/privacy/', label: 'Privacy' }
      ]
    }
  },
  {
    path: '/blog/',
    title: 'Writing | Evyatar Hazan',
    description: 'Short articles about product engineering, frontend work, live websites, SEO, validation, and deployment.',
    preview: {
      heading: 'Writing by Evyatar Hazan',
      body: [
        'Short notes about product engineering, frontend systems, SEO, validation, and deployment.',
        'These posts are meant to show how real project choices are reasoned about and shipped.'
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/contact/', label: 'Contact' }
      ]
    }
  },
  {
    path: '/privacy/',
    excludeAds: true,
    title: 'Privacy | Evyatar Hazan',
    description: 'Privacy information for Evyatar Hazan portfolio visitors, including contact paths, analytics boundaries, and basic data handling expectations.',
    preview: {
      heading: 'Privacy',
      body: [
        'This site presents portfolio work, technical writing, and direct contact paths without asking visitors to create accounts or upload private files.',
        'The contact form is processed by FormSubmit, while advertising technology is provided by Google AdSense. The full notice explains cookies, browser preferences, technical request data, and visitor choices.'
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/contact/', label: 'Contact' }
      ]
    }
  },
  {
    path: '/contact/',
    excludeAds: true,
    title: 'Contact | Evyatar Hazan',
    description: 'Direct contact options for Evyatar Hazan, including WhatsApp, email, and LinkedIn for project inquiries and collaboration.',
    preview: {
      heading: 'Contact Evyatar Hazan',
      body: [
        'The clearest way to start is a direct message with the project goal, current state, and what kind of help is needed.',
        'WhatsApp, email, and LinkedIn are available so the contact path is simple and visible.'
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/blog/', label: 'Writing' }
      ]
    }
  }
];

for (const entry of blogEntries) {
  staticRoutes.push({
    path: `/blog/${entry.slug}/`,
    title: `${entry.title} | Writing | Evyatar Hazan`,
    description: entry.excerpt,
    preview: {
      heading: entry.title,
      body: [
        entry.excerpt,
        `Published ${entry.date}. Tags: ${entry.tags.join(', ')}.`
      ],
      links: [
        { href: '/blog/', label: 'All writing' },
        { href: '/contact/', label: 'Contact' }
      ]
    }
  });
}

for (const project of projectBlocks) {
  staticRoutes.push({
    path: `/projects/${project.id}/`,
    title: extractCaseStudyValue(project.caseKey, 'seoTitle'),
    description: extractCaseStudyValue(project.caseKey, 'seoDescription'),
    preview: {
      heading: project.name,
      body: [
        extractCaseStudyValue(project.caseKey, 'seoDescription'),
        extractOverviewParagraph(project.caseKey)
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/blog/', label: 'Writing' }
      ]
    }
  });
}

const renderPreview = (route) => {
  const links = route.preview.links?.map((link) => (
    `<a href="${link.href}" style="display:inline-block;margin:0 12px 12px 0;color:#0f766e;text-decoration:none;font-weight:600;">${link.label}</a>`
  )).join('') ?? '';

  return [
    '<div id="route-preview" style="max-width:880px;margin:0 auto;padding:40px 24px 8px;font-family:Inter,Arial,sans-serif;color:#111827;background:#ffffff;">',
    `<h1 style="font-size:40px;line-height:1.1;margin:0 0 20px;">${escapeHtml(route.preview.heading)}</h1>`,
    ...route.preview.body.map((paragraph) => `<p style="font-size:18px;line-height:1.8;margin:0 0 16px;color:#374151;">${escapeHtml(paragraph)}</p>`),
    links ? `<nav style="margin-top:24px;">${links}</nav>` : '',
    '</div>'
  ].join('');
};

const replaceHeadValue = (html, pattern, replacement) => {
  if (!pattern.test(html)) return html;
  return html.replace(pattern, replacement);
};

const buildHtmlForRoute = (route) => {
  const pageUrl = absoluteUrl(route.path);
  let html = rootHtml;

  html = replaceHeadValue(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  html = replaceHeadValue(html, /<meta name="description"[^>]*content="[^"]*"[^>]*>/, `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = replaceHeadValue(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${pageUrl}" />`);
  html = replaceHeadValue(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${pageUrl}" />`);
  html = replaceHeadValue(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = replaceHeadValue(html, /<meta property="og:description"[^>]*content="[^"]*"[^>]*>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
  html = replaceHeadValue(html, /<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${pageUrl}" />`);
  html = replaceHeadValue(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = replaceHeadValue(html, /<meta name="twitter:description"[^>]*content="[^"]*"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);
  if (route.excludeAds) html = removeAdSenseScript(html);
  html = html.replace('<div id="root"></div>', `${renderPreview(route)}<div id="root"></div>`);

  return html;
};

for (const route of staticRoutes) {
  const html = buildHtmlForRoute(route);

  if (route.path === '/') {
    await writeFile(path.join(distDir, 'index.html'), html);
    continue;
  }

  const targetDir = path.join(distDir, toRelativeDir(route.path));
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), html);
}

const sitemapEntries = staticRoutes
  .map((route) => `  <url><loc>${absoluteUrl(route.path)}</loc></url>`)
  .join('\n');

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapEntries,
  '</urlset>',
  ''
].join('\n');

await writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml);

let notFoundHtml = removeAdSenseScript(rootHtml);
notFoundHtml = replaceHeadValue(notFoundHtml, /<title>[^<]*<\/title>/, '<title>Page not found | Evyatar Hazan</title>');
notFoundHtml = replaceHeadValue(notFoundHtml, /<meta name="description"[^>]*content="[^"]*"[^>]*>/, '<meta name="description" content="The requested page does not exist. Return to the home page or browse the technical writing." />');
notFoundHtml = replaceHeadValue(notFoundHtml, /<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />');
notFoundHtml = notFoundHtml.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '');
notFoundHtml = notFoundHtml.replace(
  '<div id="root"></div>',
  '<div id="route-preview" style="max-width:760px;margin:0 auto;padding:80px 24px;font-family:Inter,Arial,sans-serif;color:#111827;background:#ffffff;text-align:center;"><p style="font-weight:700;color:#0284c7;letter-spacing:.2em;">404</p><h1 style="font-size:44px;line-height:1.1;margin:16px 0 20px;">This page could not be found</h1><p style="font-size:18px;line-height:1.8;color:#374151;">The link may have changed or the address may be incorrect. Return to the portfolio or browse the technical writing.</p><nav style="margin-top:28px;"><a href="/" style="margin:0 10px;color:#0369a1;font-weight:700;">Home</a><a href="/blog/" style="margin:0 10px;color:#0369a1;font-weight:700;">Writing</a></nav></div><div id="root"></div>'
);
await writeFile(path.join(distDir, '404.html'), notFoundHtml);

if (!(await readdir(distDir)).includes('robots.txt')) {
  await writeFile(path.join(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://evyatarhazan.com/sitemap.xml\n');
}

if (blogSlugs.length === 0) {
  throw new Error('Expected English blog routes for sitemap generation.');
}

console.log(`Created static route entries and sitemap for ${staticRoutes.length} public routes.`);
