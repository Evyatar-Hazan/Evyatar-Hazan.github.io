import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PortfolioScrollRestoration from './PortfolioScrollRestoration';

const originalScrollX = Object.getOwnPropertyDescriptor(window, 'scrollX');
const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
const originalScrollTo = Object.getOwnPropertyDescriptor(window, 'scrollTo');
const originalRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame');
const originalCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame');
const originalScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight');
const originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');

const NavigationHarness = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main id="main-content" tabIndex={-1}>
      <span>{location.pathname}</span>
      <button type="button" onClick={() => navigate('/detail')}>Open detail</button>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    </main>
  );
};

describe('PortfolioScrollRestoration', () => {
  let scrollX = 0;
  let scrollY = 0;
  const scrollTo = vi.fn(({ left = 0, top = 0 }: ScrollToOptions) => {
    scrollX = Number(left);
    scrollY = Number(top);
  });

  beforeEach(() => {
    scrollX = 0;
    scrollY = 0;
    scrollTo.mockClear();
    Object.defineProperties(window, {
      scrollX: { configurable: true, get: () => scrollX },
      scrollY: { configurable: true, get: () => scrollY },
      scrollTo: { configurable: true, value: scrollTo },
    });
  });

  afterEach(() => {
    if (originalScrollX) Object.defineProperty(window, 'scrollX', originalScrollX);
    if (originalScrollY) Object.defineProperty(window, 'scrollY', originalScrollY);
    if (originalScrollTo) Object.defineProperty(window, 'scrollTo', originalScrollTo);
    if (originalRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', originalRequestAnimationFrame);
    if (originalCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', originalCancelAnimationFrame);
    if (originalScrollHeight) Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeight);
    if (originalInnerHeight) Object.defineProperty(window, 'innerHeight', originalInnerHeight);
  });

  it('restores the saved list position after browser-style back navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <PortfolioScrollRestoration />
        <NavigationHarness />
      </MemoryRouter>,
    );

    scrollY = 1280;
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole('button', { name: 'Open detail' }));
    await waitFor(() => expect(screen.getByText('/detail')).toBeInTheDocument());
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, top: 0, behavior: 'auto' });

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => expect(screen.getByText('/projects')).toBeInTheDocument());
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, top: 1280, behavior: 'auto' });
  });

  it('keeps retrying while lazy content is still expanding the page', async () => {
    const frames: FrameRequestCallback[] = [];
    let scrollHeight = 900;
    Object.defineProperties(window, {
      innerHeight: { configurable: true, value: 800 },
      requestAnimationFrame: {
        configurable: true,
        value: (callback: FrameRequestCallback) => {
          frames.push(callback);
          return frames.length;
        },
      },
      cancelAnimationFrame: { configurable: true, value: vi.fn() },
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => scrollHeight,
    });

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <PortfolioScrollRestoration />
        <NavigationHarness />
      </MemoryRouter>,
    );

    scrollY = 4154.5;
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole('button', { name: 'Open detail' }));
    await waitFor(() => expect(screen.getByText('/detail')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => expect(screen.getByText('/projects')).toBeInTheDocument());

    act(() => {
      for (let index = 0; index < 13; index += 1) frames.shift()?.(index * 16);
      scrollHeight = 6000;
      frames.shift()?.(13 * 16);
      scrollY = 800;
      frames.shift()?.(14 * 16);
    });

    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, top: 4154.5, behavior: 'auto' });
    expect(scrollY).toBe(4154.5);
  });
});
