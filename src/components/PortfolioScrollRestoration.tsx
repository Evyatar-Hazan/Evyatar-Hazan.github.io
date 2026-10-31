import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type ScrollPosition = {
  left: number;
  top: number;
};

const MAX_RESTORE_FRAMES = 120;

const PortfolioScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, ScrollPosition>());
  const previousContentLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useLayoutEffect(() => {
    const savePosition = () => positions.current.set(location.key, {
      left: window.scrollX,
      top: window.scrollY,
    });
    window.addEventListener('scroll', savePosition, { passive: true });
    window.addEventListener('pagehide', savePosition);

    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
      window.removeEventListener('pagehide', savePosition);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    const contentLocation = `${location.pathname}${location.hash}`;
    const contentLocationChanged = previousContentLocation.current !== contentLocation;
    previousContentLocation.current = contentLocation;

    if (!contentLocationChanged) return;
    if (location.hash) return;

    const savedPosition = navigationType === 'POP'
      ? positions.current.get(location.key) ?? null
      : null;
    const targetPosition = savedPosition ?? { left: 0, top: 0 };
    let attempts = 0;
    let frameId = 0;
    let cancelledByUser = false;
    let managedFocusTarget: HTMLElement | null = null;

    const cancelRestoration = () => {
      cancelledByUser = true;
      window.cancelAnimationFrame(frameId);
    };

    if (savedPosition) {
      window.addEventListener('wheel', cancelRestoration, { passive: true });
      window.addEventListener('touchstart', cancelRestoration, { passive: true });
      window.addEventListener('pointerdown', cancelRestoration, { passive: true });
      window.addEventListener('keydown', cancelRestoration);
    }

    const restorePosition = () => {
      if (cancelledByUser) return;

      window.scrollTo({ ...targetPosition, behavior: 'auto' });
      attempts += 1;

      if (savedPosition && attempts < MAX_RESTORE_FRAMES) {
        frameId = window.requestAnimationFrame(restorePosition);
      }
    };

    restorePosition();

    if (!savedPosition) {
      const focusCurrentMain = () => {
        const activeElement = document.activeElement;
        const focusIsStillManaged = activeElement === document.body
          || activeElement === managedFocusTarget;

        if (!focusIsStillManaged) return;

        const mainContent = document.querySelector<HTMLElement>('#main-content');
        if (mainContent && mainContent !== managedFocusTarget) {
          mainContent.focus({ preventScroll: true });
          managedFocusTarget = mainContent;
        }

        attempts += 1;
        if (attempts < MAX_RESTORE_FRAMES) {
          frameId = window.requestAnimationFrame(focusCurrentMain);
        }
      };

      frameId = window.requestAnimationFrame(focusCurrentMain);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('wheel', cancelRestoration);
      window.removeEventListener('touchstart', cancelRestoration);
      window.removeEventListener('pointerdown', cancelRestoration);
      window.removeEventListener('keydown', cancelRestoration);
    };
  }, [location.hash, location.key, location.pathname, navigationType]);

  return null;
};

export default PortfolioScrollRestoration;
