const approvedEvents = new Set([
  'contact_view',
  'contact_start',
  'contact_submit_attempt',
  'contact_submit_success',
  'contact_submit_error',
]);

const approvedOrigins = new Set([
  'https://evyatarhazan.com',
  'https://www.evyatarhazan.com',
  'https://evyatar-hazan.github.io',
]);

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const response = (status, origin, body = null) => new Response(body, {
  status,
  headers: {
    ...corsHeaders(origin),
    'Cache-Control': 'no-store',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
  },
});

const allowedOrigin = (request) => {
  const origin = request.headers.get('Origin');
  return origin && approvedOrigins.has(origin) ? origin : null;
};

export const onRequestOptions = async ({ request }) => {
  const origin = allowedOrigin(request);
  return origin ? response(204, origin) : new Response(null, { status: 403 });
};

export const onRequestPost = async ({ request, env }) => {
  const origin = allowedOrigin(request);
  if (!origin) return new Response(null, { status: 403 });

  const contentLength = Number(request.headers.get('Content-Length') ?? 0);
  if (contentLength > 128) return response(413, origin, JSON.stringify({ error: 'payload_too_large' }));

  let payload;
  try {
    payload = await request.json();
  } catch {
    return response(400, origin, JSON.stringify({ error: 'invalid_json' }));
  }

  if (
    !payload
    || typeof payload !== 'object'
    || Array.isArray(payload)
    || Object.keys(payload).length !== 1
    || !approvedEvents.has(payload.event)
  ) {
    return response(400, origin, JSON.stringify({ error: 'invalid_event' }));
  }

  env.CONTACT_FUNNEL.writeDataPoint({
    indexes: [payload.event],
    blobs: [payload.event],
  });

  return response(204, origin);
};
