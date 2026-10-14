import { describe, expect, it } from 'vitest';
import {
  isFirstPartyUrl,
  shouldFailConsoleMessage,
  sourceUrlFromError,
} from './console-network-gate.mjs';

describe('console and network gate filtering', () => {
  const origin = 'https://portfolio.example';

  it('treats same-origin URLs and missing runtime locations as first party', () => {
    expect(isFirstPartyUrl('https://portfolio.example/assets/app.js', origin)).toBe(true);
    expect(isFirstPartyUrl('/assets/app.js', origin)).toBe(true);
    expect(isFirstPartyUrl('', origin)).toBe(true);
  });

  it('keeps third-party request noise outside the blocking set', () => {
    expect(isFirstPartyUrl('https://analytics.example/collect', origin)).toBe(false);
  });

  it('blocks only first-party console errors', () => {
    expect(shouldFailConsoleMessage({
      type: 'error',
      sourceUrl: 'https://portfolio.example/assets/app.js',
    }, origin)).toBe(true);
    expect(shouldFailConsoleMessage({
      type: 'warning',
      sourceUrl: 'https://portfolio.example/assets/app.js',
    }, origin)).toBe(false);
    expect(shouldFailConsoleMessage({
      type: 'error',
      sourceUrl: 'https://cdn.example/widget.js',
    }, origin)).toBe(false);
  });

  it('uses an error stack URL to filter third-party runtime noise', () => {
    expect(sourceUrlFromError({ stack: 'Error: widget failed\n    at https://cdn.example/widget.js:1:2' }))
      .toBe('https://cdn.example/widget.js:1:2');
    expect(sourceUrlFromError({ stack: 'Error: local runtime failure' })).toBe('');
  });
});
