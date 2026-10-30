import { describe, expect, it, vi } from 'vitest';
import worker from '../public/_worker.js';

const approvedOrigin = 'https://evyatar-hazan.github.io';

const requestFor = (body, origin = approvedOrigin, method = 'POST') => new Request(
  'https://evyatarhazan.com/api/contact-funnel',
  {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: method === 'OPTIONS' ? undefined : JSON.stringify(body),
  },
);

const environment = () => ({
  CONTACT_FUNNEL: { writeDataPoint: vi.fn() },
  ASSETS: { fetch: vi.fn() },
});

describe('contact funnel advanced-mode Worker route', () => {
  it('writes only the approved event to Analytics Engine', async () => {
    const env = environment();
    const result = await worker.fetch(
      requestFor({ event: 'contact_submit_success' }),
      env,
    );

    expect(result.status).toBe(204);
    expect(result.headers.get('Access-Control-Allow-Origin')).toBe(approvedOrigin);
    expect(env.CONTACT_FUNNEL.writeDataPoint).toHaveBeenCalledWith({
      indexes: ['contact_submit_success'],
      blobs: ['contact_submit_success'],
    });
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it.each([
    { event: 'visitor@example.test' },
    { event: 'contact_view', name: 'Test Visitor' },
    { event: 'contact_view', message: 'private project details' },
  ])('rejects non-allowlisted or additional data: %j', async (body) => {
    const env = environment();
    const result = await worker.fetch(requestFor(body), env);

    expect(result.status).toBe(400);
    expect(env.CONTACT_FUNNEL.writeDataPoint).not.toHaveBeenCalled();
  });

  it('rejects unapproved origins', async () => {
    const env = environment();
    const result = await worker.fetch(
      requestFor({ event: 'contact_view' }, 'https://example.test'),
      env,
    );
    expect(result.status).toBe(403);
  });

  it('answers approved preflight requests without recording an event', async () => {
    const env = environment();
    const result = await worker.fetch(
      requestFor({}, 'https://evyatarhazan.com', 'OPTIONS'),
      env,
    );
    expect(result.status).toBe(204);
    expect(result.headers.get('Access-Control-Allow-Origin')).toBe('https://evyatarhazan.com');
    expect(env.CONTACT_FUNNEL.writeDataPoint).not.toHaveBeenCalled();
  });

  it('preserves the existing asset fallback for other routes', async () => {
    const env = environment();
    const assetResponse = new Response('asset');
    env.ASSETS.fetch.mockResolvedValue(assetResponse);

    const request = new Request('https://evyatarhazan.com/en/privacy/');
    expect(await worker.fetch(request, env)).toBe(assetResponse);
    expect(env.ASSETS.fetch).toHaveBeenCalledWith(request);
  });
});
