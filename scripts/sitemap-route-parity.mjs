const normalizeRoutePath = (routePath) => {
  if (!routePath || routePath === '/') return '/';
  const pathname = new URL(routePath, 'https://portfolio.invalid').pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const formatRouteList = (routes) => routes.map((route) => `- ${route}`).join('\n');

export const extractSitemapPaths = (sitemapXml, siteUrl) => {
  const expectedOrigin = new URL(siteUrl).origin;

  return [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(([, location]) => {
    const url = new URL(location);
    if (url.origin !== expectedOrigin) {
      throw new Error(`Sitemap route uses an unexpected origin: ${location}`);
    }
    return normalizeRoutePath(url.pathname);
  });
};

export const buildLocalizedPublicRoutes = (routePaths, languages) => {
  const normalizedRoutes = routePaths.map(normalizeRoutePath);
  const duplicateRegistryRoutes = normalizedRoutes.filter((route, index) => (
    normalizedRoutes.indexOf(route) !== index
  ));

  if (duplicateRegistryRoutes.length > 0) {
    throw new Error(
      `Public route registry contains duplicate path(s):\n${formatRouteList([...new Set(duplicateRegistryRoutes)])}`,
    );
  }

  return normalizedRoutes.flatMap((route) => languages.map((language) => (
    `/${language}${route}`
  )));
};

export const assertSitemapRouteParity = ({
  routePaths,
  languages,
  sitemapXml,
  siteUrl,
}) => {
  const expectedRoutes = buildLocalizedPublicRoutes(routePaths, languages);
  const sitemapRoutes = extractSitemapPaths(sitemapXml, siteUrl);
  const sitemapRouteCounts = new Map();

  for (const route of sitemapRoutes) {
    sitemapRouteCounts.set(route, (sitemapRouteCounts.get(route) ?? 0) + 1);
  }

  const duplicateSitemapRoutes = [...sitemapRouteCounts]
    .filter(([, count]) => count > 1)
    .map(([route]) => route);
  const expectedRouteSet = new Set(expectedRoutes);
  const missingRoutes = expectedRoutes.filter((route) => !sitemapRouteCounts.has(route));
  const staleRoutes = [...sitemapRouteCounts.keys()].filter((route) => !expectedRouteSet.has(route));

  if (duplicateSitemapRoutes.length > 0 || missingRoutes.length > 0 || staleRoutes.length > 0) {
    const issues = [];
    if (duplicateSitemapRoutes.length > 0) {
      issues.push(`Duplicate sitemap route(s):\n${formatRouteList(duplicateSitemapRoutes)}`);
    }
    if (missingRoutes.length > 0) {
      issues.push(`Public route(s) missing from sitemap:\n${formatRouteList(missingRoutes)}`);
    }
    if (staleRoutes.length > 0) {
      issues.push(`Stale sitemap route(s) not present in the public route registry:\n${formatRouteList(staleRoutes)}`);
    }
    throw new Error(`Sitemap route parity failed.\n${issues.join('\n')}`);
  }

  return { routeCount: expectedRoutes.length };
};
