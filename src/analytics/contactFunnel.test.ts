import { describe, expect, it } from 'vitest';
import {
  buildContactFunnelPayload,
  contactFunnelEvents,
  getContactFunnelEndpoint,
} from './contactFunnel';

describe('private contact funnel analytics', () => {
  it('allows only the five approved funnel events', () => {
    expect(contactFunnelEvents).toEqual([
      'contact_view',
      'contact_start',
      'contact_submit_attempt',
      'contact_submit_success',
      'contact_submit_error',
    ]);
  });

  it('serializes only the event name without form or visitor data', () => {
    expect(JSON.parse(buildContactFunnelPayload('contact_submit_attempt'))).toEqual({
      event: 'contact_submit_attempt',
    });
  });

  it('tracks only on the two production deployments', () => {
    expect(getContactFunnelEndpoint('evyatarhazan.com')).toBe('/api/contact-funnel');
    expect(getContactFunnelEndpoint('www.evyatarhazan.com')).toBe('/api/contact-funnel');
    expect(getContactFunnelEndpoint('evyatar-hazan.github.io')).toBe(
      'https://evyatarhazan.com/api/contact-funnel',
    );
    expect(getContactFunnelEndpoint('localhost')).toBeNull();
    expect(getContactFunnelEndpoint('example.test')).toBeNull();
  });
});
