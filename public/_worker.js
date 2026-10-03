const canonicalLegacyPath = (pathname) => {
  if (pathname === '/') return '/';

  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (/^\/(?:blog(?:\/[^/]+)?|projects\/[^/]+|contact|privacy|lab)\/$/u.test(normalized)) {
    return normalized;
  }

  return null;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const legacyPath = canonicalLegacyPath(url.pathname);

    if (legacyPath) {
      const requestedLanguage = url.searchParams.get('lang');
      const language = requestedLanguage === 'he' || requestedLanguage === 'en'
        ? requestedLanguage
        : 'en';

      url.pathname = `/${language}${legacyPath}`;
      url.searchParams.delete('lang');
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
