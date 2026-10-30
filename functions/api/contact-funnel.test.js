import { describe, expect, it, vi } from 'vitest';
import { onRequestOptions, onRequestPost } from './contact-funnel';

const origin = 'https://evyatar-hazan.github.io';
const requestFor = (body, requestOrigin = origin) => new Request(
  'https://evyatarhazan.com/api/contact-funnel',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: requestOrigin },
    body: JSON.stringify(body),
  },
);

describe('contact funnel Pages Function', () => {
  it('writes only the approved event to Analytics Engine', async () => {
    const writeDataPoint = vi.fn();
    const result = await onRequestPost({
      request: requestFor({ event: 'contact_submit_success' }),
      env: { CONTACT_FUNNEL: { writeDataPoint } },
    });

    expect(result.status).toBe(204);
    expect(result.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(writeDataPoint).toHaveBeenCalledWith({
      indexes: ['contact_submit_success'],
      blobs: ['contact_submit_success'],
    });
  });

  it.each([
    { event: 'visitor@example.test' },
    { event: 'contact_view', name: 'Test Visitor' },
    { event: 'contact_view', message: 'private project details' },
  ])('rejects non-allowlisted or additional data: %j', async (body) => {
    const writeDataPoint = vi.fn();
    const result = await onRequestPost({
      request: requestFor(body),
      env: { CONTACT_FUNNEL: { writeDataPoint } },
    });

    expect(result.status).toBe(400);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });

  it('rejects unapproved origins', async () => {
    const result = await onRequestPost({
      request: requestFor({ event: 'contact_view' }, 'https://example.test'),
      env: { CONTACT_FUNNEL: { writeDataPoint: vi.fn() } },
    });
    expect(result.status).toBe(403);
  });

  it('answers approved preflight requests without recording an event', async () => {
    const request = new Request('https://evyatarhazan.com/api/contact-funnel', {
      method: 'OPTIONS',
      headers: { Origin: 'https://evyatarhazan.com' },
    });
    const result = await onRequestOptions({ request });
    expect(result.status).toBe(204);
    expect(result.headers.get('Access-Control-Allow-Origin')).toBe('https://evyatarhazan.com');
  });
});
