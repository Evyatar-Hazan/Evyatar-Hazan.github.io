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
const localizedPath = (language, routePath) => `/${language}${normalizePath(routePath)}`;
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

const blogSource = await readFile(path.join(srcDir, 'content', 'blog', 'metadata.ts'), 'utf8');
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

const localizedBlogEntries = [...blogSource.matchAll(/slug:\s*'([^']+)'[\s\S]*?language:\s*'(en|he)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?excerpt:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'[\s\S]*?tags:\s*\[([^\]]*)\]/g)]
  .map((match) => ({
    slug: match[1],
    language: match[2],
    title: match[3],
    excerpt: match[4],
    date: match[5],
    tags: match[6].replace(/'/g, '').split(',').map((value) => value.trim()).filter(Boolean)
  }));

const profileSource = await readFile(path.join(srcDir, 'data', 'profile.ts'), 'utf8');
const projectBlocks = [
  { id: 'nis_boutique', caseKey: 'nis_boutique', name: 'Nis Boutique Catering' },
  { id: 'online_converter', caseKey: 'online_converter', name: 'Online Converter' },
  { id: 'emergency_protocol', caseKey: 'emergency_protocol', name: 'Emergency Protocol Diagram' },
  { id: 'united_hatzalah', caseKey: 'united_hatzalah', name: 'United Hatzalah Shoham Branch' }
];

const extractCaseStudyValue = (caseKey, field, language = 'en') => {
  const regex = new RegExp(`${caseKey}:\\s*\\{[\\s\\S]*?${field}:\\s*\\{[\\s\\S]*?${language}:\\s*'([^']+)'`, 'm');
  const match = profileSource.match(regex);
  return match?.[1] ?? '';
};

const extractOverviewParagraph = (caseKey, language = 'en') => {
  const regex = new RegExp(`${caseKey}:\\s*\\{[\\s\\S]*?overview:\\s*\\{[\\s\\S]*?${language}:\\s*\\[\\s*'([^']+)'`, 'm');
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
        'The contact form is processed by FormSubmit. The portfolio does not load ads; Google AdSense is used on the Online Converter product. The full notice explains cookies, browser preferences, technical request data, and visitor choices.'
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
  },
  {
    path: '/lab/',
    excludeAds: true,
    title: 'Interface Craft Lab | Evyatar Hazan',
    description: 'Synthetic interface experiments and a reusable date presenter, clearly separated from client delivery and product metrics.',
    preview: {
      heading: 'Interface Craft Lab',
      body: [
        'Synthetic interaction experiments for useful errors, upload states, and explainable workflows.',
        'Includes a reusable date presenter that demonstrates honest fallback behavior without claiming client delivery or product outcomes.'
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/contact/', label: 'Contact' }
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

const localizedSeoForRoute = (route, language) => {
  if (language === 'en') return { ...route };

  if (route.path === '/') {
    return {
      ...route,
      title: 'אביתר חזן | Full Stack Developer',
      description: 'פורטפוליו של אביתר חזן עם אתרים עסקיים, מערכות Full Stack, כלי מוצר, כתיבה מקצועית ודרכי יצירת קשר ישירות.',
      preview: {
        ...route.preview,
        heading: 'אביתר חזן | Full Stack Developer',
        body: ['אתרים עסקיים, כלים מובנים, תהליכי אוטומציה ומערכות מוצר ניתנות לתחזוקה.']
      }
    };
  }

  if (route.path === '/blog/') {
    return {
      ...route,
      title: 'בלוג | אביתר חזן',
      description: 'מאמרים קצרים על פיתוח מוצר, Frontend, אתרים חיים, בדיקות ופריסה.',
      preview: {
        ...route.preview,
        heading: 'כתיבה מקצועית',
        body: ['מאמרים קצרים על פיתוח מוצר, מערכות Frontend, קידום אורגני, בדיקות ופריסה.']
      }
    };
  }

  if (route.path === '/privacy/') {
    return {
      ...route,
      title: 'פרטיות | אביתר חזן',
      description: 'מידע בסיסי על פרטיות באתר הפורטפוליו של אביתר חזן, כולל יצירת קשר, שימוש מינימלי במדידה וציפיות טיפול בנתונים.',
      preview: {
        ...route.preview,
        heading: 'פרטיות ושקיפות בסיסית',
        body: ['הפורטפוליו אינו מבקש ממבקרים ליצור חשבון או להעלות מסמכים אישיים.']
      }
    };
  }

  if (route.path === '/contact/') {
    return {
      ...route,
      title: 'יצירת קשר | אביתר חזן',
      description: 'דרכי יצירת קשר ישירות עם אביתר חזן דרך WhatsApp, אימייל ו-LinkedIn עבור פרויקטים, ייעוץ ושיתופי פעולה.',
      preview: {
        ...route.preview,
        heading: 'בוא נתחיל משיחה ברורה',
        body: ['אפשר להתחיל מהמטרה, מהמצב הנוכחי ומהעזרה שנדרשת.']
      }
    };
  }

  if (route.path === '/lab/') {
    return {
      ...route,
      title: 'מעבדת ממשק | אביתר חזן',
      description: 'ניסויי ממשק סינתטיים ורכיב תאריך רב־שימושי, עם הבחנה מפורשת מעבודת לקוח וממדדי מוצר.',
      preview: {
        ...route.preview,
        heading: 'מעבדת ממשק',
        body: [
          'ניסויים סינתטיים בהודעות שגיאה שימושיות, מצבי העלאה ותהליכים מוסברים.',
          'כולל רכיב תאריך רב־שימושי שמדגים fallback אמין בלי לטעון לעבודת לקוח או לתוצאות מוצר.'
        ]
      }
    };
  }

  const blogMatch = route.path.match(/^\/blog\/([^/]+)\/$/);
  if (blogMatch) {
    const entry = localizedBlogEntries.find((candidate) => (
      candidate.slug === blogMatch[1] && candidate.language === language
    ));
    if (!entry) throw new Error(`Missing ${language} blog metadata for ${blogMatch[1]}.`);
    return {
      ...route,
      title: `${entry.title} | כתיבה | אביתר חזן`,
      description: entry.excerpt,
      preview: {
        ...route.preview,
        heading: entry.title,
        body: [entry.excerpt, `פורסם ${entry.date}. תגיות: ${entry.tags.join(', ')}.`]
      }
    };
  }

  const projectMatch = route.path.match(/^\/projects\/([^/]+)\/$/);
  if (projectMatch) {
    const project = projectBlocks.find((candidate) => candidate.id === projectMatch[1]);
    if (!project) throw new Error(`Missing project route metadata for ${projectMatch[1]}.`);
    const title = extractCaseStudyValue(project.caseKey, 'seoTitle', language);
    const description = extractCaseStudyValue(project.caseKey, 'seoDescription', language);
    return {
      ...route,
      title,
      description,
      preview: {
        ...route.preview,
        heading: title,
        body: [description, extractOverviewParagraph(project.caseKey, language)]
      }
    };
  }

  throw new Error(`Missing localized SEO route metadata for ${route.path}.`);
};

const languages = ['en', 'he'];
const addLanguageMetadata = (html, route, language) => {
  const alternates = languages.map((alternateLanguage) => (
    `<link rel="alternate" hreflang="${alternateLanguage}" href="${absoluteUrl(localizedPath(alternateLanguage, route.path))}" />`
  ));
  alternates.push(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl(localizedPath('en', route.path))}" />`);

  return html
    .replace(/<html lang="[^"]+"(?: dir="[^"]+")?>/, `<html lang="${language}" dir="${language === 'he' ? 'rtl' : 'ltr'}">`)
    .replace(
      /(<link rel="canonical" href="[^"]*" \/>)/,
      `$1\n  ${alternates.join('\n  ')}`
    )
    .replace(
      /<meta property="og:locale" content="[^"]*" \/>/,
      `<meta property="og:locale" content="${language === 'he' ? 'he_IL' : 'en_US'}" />`
    );
};

for (const route of staticRoutes) {
  for (const language of languages) {
    const localizedRoute = localizedSeoForRoute(route, language);
    localizedRoute.path = localizedPath(language, route.path);
    localizedRoute.preview = {
      ...localizedRoute.preview,
      links: localizedRoute.preview.links?.map((link) => ({
        ...link,
        href: localizedPath(language, link.href)
      }))
    };
    const html = addLanguageMetadata(buildHtmlForRoute(localizedRoute), route, language);
    const targetDir = path.join(distDir, toRelativeDir(localizedRoute.path));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'index.html'), html);
  }
}

const buildLegacyRedirect = (routePath) => {
  const target = localizedPath('en', routePath);
  const normalizedRoutePath = normalizePath(routePath);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="${absoluteUrl(target)}" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <title>Redirecting | Evyatar Hazan</title>
</head>
<body>
  <p>This page moved to <a href="${target}">${target}</a>.</p>
  <script>
    const params = new URLSearchParams(location.search);
    const requestedLanguage = params.get('lang');
    const language = requestedLanguage === 'he' || requestedLanguage === 'en' ? requestedLanguage : 'en';
    params.delete('lang');
    const query = params.toString();
    location.replace('/' + language + ${JSON.stringify(normalizedRoutePath)} + (query ? '?' + query : '') + location.hash);
  </script>
</body>
</html>
`;
};

for (const route of staticRoutes) {
  const targetFile = route.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, toRelativeDir(route.path), 'index.html');
  await writeFile(targetFile, buildLegacyRedirect(route.path));
}

const localizedSitemapEntries = staticRoutes.flatMap((route) => languages.map((language) => {
  const links = [
    ...languages.map((alternateLanguage) => (
      `    <xhtml:link rel="alternate" hreflang="${alternateLanguage}" href="${absoluteUrl(localizedPath(alternateLanguage, route.path))}" />`
    )),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(localizedPath('en', route.path))}" />`
  ];
  return [
    '  <url>',
    `    <loc>${absoluteUrl(localizedPath(language, route.path))}</loc>`,
    ...links,
    '  </url>'
  ].join('\n');
})).join('\n');

await writeFile(path.join(distDir, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  localizedSitemapEntries,
  '</urlset>',
  ''
].join('\n'));

for (const route of staticRoutes) {
  for (const language of languages) {
    const routePath = localizedPath(language, route.path);
    const html = await readFile(path.join(distDir, toRelativeDir(routePath), 'index.html'), 'utf8');
    const expectedCanonical = `<link rel="canonical" href="${absoluteUrl(routePath)}" />`;
    const expectedLanguage = `<html lang="${language}" dir="${language === 'he' ? 'rtl' : 'ltr'}">`;

    if (!html.includes(expectedCanonical) || !html.includes(expectedLanguage)) {
      throw new Error(`Invalid localized metadata for ${routePath}.`);
    }

    for (const alternateLanguage of [...languages, 'x-default']) {
      const alternatePath = localizedPath(alternateLanguage === 'x-default' ? 'en' : alternateLanguage, route.path);
      const expectedAlternate = `hreflang="${alternateLanguage}" href="${absoluteUrl(alternatePath)}"`;
      if (!html.includes(expectedAlternate)) {
        throw new Error(`Missing ${alternateLanguage} alternate for ${routePath}.`);
      }
    }
  }
}

const generatedSitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const sitemapUrlCount = [...generatedSitemap.matchAll(/<loc>/g)].length;
if (sitemapUrlCount !== staticRoutes.length * languages.length) {
  throw new Error(`Expected ${staticRoutes.length * languages.length} localized sitemap URLs, received ${sitemapUrlCount}.`);
}
if (new RegExp(`<loc>${siteUrl}/(?!en/|he/)`).test(generatedSitemap)) {
  throw new Error('Legacy URLs must not appear as sitemap locations.');
}

console.log(`Created ${staticRoutes.length * languages.length} localized routes, ${staticRoutes.length} legacy redirect documents, and a reciprocal hreflang sitemap.`);
