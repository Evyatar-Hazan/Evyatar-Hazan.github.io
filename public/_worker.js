const canonicalLegacyPath = (pathname) => {
  if (pathname === '/') return '/';

  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (/^\/(?:blog(?:\/[^/]+)?|projects\/[^/]+|contact|privacy|lab)\/$/u.test(normalized)) {
    return normalized;
  }

  return null;
};

const approvedContactFunnelEvents = new Set([
  'contact_view',
  'contact_start',
  'contact_submit_attempt',
  'contact_submit_success',
  'contact_submit_error',
]);

const approvedContactFunnelOrigins = new Set([
  'https://evyatarhazan.com',
  'https://www.evyatarhazan.com',
  'https://evyatar-hazan.github.io',
]);

export const documentContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "script-src 'self' 'sha256-lfEQ4MY7ECA+kkdDrjBPj69IRZcsK/XKicR4Bu0TeKg='",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://evyatarhazan.com https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "frame-src 'none'",
  "frame-ancestors 'none'",
].join('; ');

export const baselineSecurityHeaders = {
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

export const withSecurityHeaders = (response) => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(baselineSecurityHeaders)) {
    headers.set(name, value);
  }

  if (headers.get('Content-Type')?.toLowerCase().startsWith('text/html')) {
    headers.set('Content-Security-Policy', documentContentSecurityPolicy);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const contactFunnelCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const contactFunnelResponse = (status, origin, body = null) => new Response(body, {
  status,
  headers: {
    ...contactFunnelCorsHeaders(origin),
    'Cache-Control': 'no-store',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  },
});

const approvedContactFunnelOrigin = (request) => {
  const origin = request.headers.get('Origin');
  return origin && approvedContactFunnelOrigins.has(origin) ? origin : null;
};

const handleContactFunnelRequest = async (request, env) => {
  const origin = approvedContactFunnelOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  if (request.method === 'OPTIONS') return contactFunnelResponse(204, origin);
  if (request.method !== 'POST') return new Response(null, { status: 405 });

  const contentLength = Number(request.headers.get('Content-Length') ?? 0);
  if (contentLength > 128) {
    return contactFunnelResponse(413, origin, JSON.stringify({ error: 'payload_too_large' }));
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return contactFunnelResponse(400, origin, JSON.stringify({ error: 'invalid_json' }));
  }

  if (
    !payload
    || typeof payload !== 'object'
    || Array.isArray(payload)
    || Object.keys(payload).length !== 1
    || !approvedContactFunnelEvents.has(payload.event)
  ) {
    return contactFunnelResponse(400, origin, JSON.stringify({ error: 'invalid_event' }));
  }

  env.CONTACT_FUNNEL.writeDataPoint({
    indexes: [payload.event],
    blobs: [payload.event],
  });

  return contactFunnelResponse(204, origin);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact-funnel') {
      return withSecurityHeaders(await handleContactFunnelRequest(request, env));
    }

    const legacyPath = canonicalLegacyPath(url.pathname);

    if (legacyPath) {
      const requestedLanguage = url.searchParams.get('lang');
      const language = requestedLanguage === 'he' || requestedLanguage === 'en'
        ? requestedLanguage
        : 'en';

      url.pathname = `/${language}${legacyPath}`;
      url.searchParams.delete('lang');
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
