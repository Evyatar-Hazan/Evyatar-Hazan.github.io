export const contactFunnelEvents = [
  'contact_view',
  'contact_start',
  'contact_submit_attempt',
  'contact_submit_success',
  'contact_submit_error',
] as const;

export type ContactFunnelEvent = (typeof contactFunnelEvents)[number];

const trackingEndpointByHostname: Readonly<Record<string, string>> = {
  'evyatarhazan.com': '/api/contact-funnel',
  'www.evyatarhazan.com': '/api/contact-funnel',
  'evyatar-hazan.github.io': 'https://evyatarhazan.com/api/contact-funnel',
};

export const getContactFunnelEndpoint = (hostname: string) =>
  trackingEndpointByHostname[hostname] ?? null;

export const buildContactFunnelPayload = (event: ContactFunnelEvent) =>
  JSON.stringify({ event });

export const trackContactFunnelEvent = async (event: ContactFunnelEvent) => {
  const endpoint = getContactFunnelEndpoint(window.location.hostname);
  if (!endpoint) return false;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: buildContactFunnelPayload(event),
      keepalive: true,
      credentials: 'omit',
    });
    return response.ok;
  } catch {
    return false;
  }
};
