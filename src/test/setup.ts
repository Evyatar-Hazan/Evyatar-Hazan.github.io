import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

const storage = new Map<string, string>();
const localStorageMock: Storage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
  key: (index: number) => Array.from(storage.keys())[index] ?? null,
  get length() {
    return storage.size;
  },
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    configurable: true,
  });
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    value: IntersectionObserverMock,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    value: IntersectionObserverMock,
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
});
