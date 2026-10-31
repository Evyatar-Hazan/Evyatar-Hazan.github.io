const cloudflareProductionOrigin = 'https://evyatarhazan.com';
const cloudflareInsightsScript = 'https://static.cloudflareinsights.com/beacon.min.js/';

export const isExpectedPlatformConsoleError = (text) => {
  const baseUrl = process.env.UI_INVARIANTS_BASE_URL?.replace(/\/$/u, '');

  return baseUrl === cloudflareProductionOrigin
    && text.includes(`Loading the script '${cloudflareInsightsScript}`)
    && text.includes('violates the following Content Security Policy directive')
    && text.includes('The action has been blocked.');
};

export const collectUnexpectedConsoleErrors = (page, errors) => {
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && !isExpectedPlatformConsoleError(text)) errors.push(text);
  });
};

export const collectUnexpectedFailedRequests = (page, failures) => {
  page.on('requestfailed', (request) => {
    const url = request.url();
    const baseUrl = process.env.UI_INVARIANTS_BASE_URL?.replace(/\/$/u, '');
    if (!(baseUrl === cloudflareProductionOrigin && url.startsWith(cloudflareInsightsScript))) {
      failures.push(url);
    }
  });
};
