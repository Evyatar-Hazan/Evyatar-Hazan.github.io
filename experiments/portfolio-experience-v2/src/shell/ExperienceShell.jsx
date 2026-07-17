import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { JourneyField } from '../journey/JourneyField.jsx';
import {
  CINEMA_GEOMETRY_READY_EVENT,
  useMotionDirector,
} from '../journey/useMotionDirector.js';
import { SignalForgeStage } from '../forge/SignalForgeStage.jsx';
import { localizedInternalPath, localizedStoryPath } from '../navigation.js';
import { SiteHeader } from './SiteHeader.jsx';

const KEYBOARD_SCROLL_KEYS = new Set([
  ' ',
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  'Spacebar',
  'Tab',
]);

function hasModifiedActivation(event) {
  return event.button > 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function getHashTarget(hash) {
  if (!hash?.startsWith('#')) return null;
  const id = decodeURIComponent(hash.slice(1));
  return id ? document.getElementById(id) : null;
}

function isEditableTarget(target) {
  return target instanceof HTMLElement
    && (target.isContentEditable || target.matches('input, textarea, select'));
}

export function ExperienceShell({ language, copy, onLanguageChange }) {
  const shellRef = useRef(null);
  const journeyProgressRef = useRef(null);
  const scrollPositionsRef = useRef(new Map());
  const previousLocationRef = useRef(null);
  const pendingRouteModeRef = useRef(null);
  const pendingHashAnchorRef = useRef(null);
  const pendingHashFrameRef = useRef(0);
  const hashSettleFrameRef = useRef(0);
  const hashSettleTimerRef = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const motionRouteKey = `${location.pathname}:${language}`;
  const routePlayback = pendingRouteModeRef.current === 'direct' ? 'play' : 'skip';
  const journey = useMotionDirector({
    progressRef: journeyProgressRef,
    routeKey: motionRouteKey,
    shellRef,
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedReduced = new URLSearchParams(window.location.search).get('motion') === 'reduce';
    const sync = () => {
      if (forcedReduced || motionPreference.matches) root.dataset.motionOverride = 'reduce';
      else root.removeAttribute('data-motion-override');
    };

    sync();
    motionPreference.addEventListener?.('change', sync);
    return () => {
      motionPreference.removeEventListener?.('change', sync);
      root.removeAttribute('data-motion-override');
    };
  }, []);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  const setInputMode = useCallback((mode) => {
    document.documentElement.dataset.inputMode = mode;
    if (shellRef.current) {
      shellRef.current.dataset.inputMode = mode;
      shellRef.current.dataset.journeyTransition = mode === 'direct' ? 'play' : 'instant';
    }
  }, []);

  const moveToTarget = useCallback((target) => {
    const isCompact = window.matchMedia('(max-width: 960px)').matches;
    const isReduced = document.documentElement.dataset.motionOverride === 'reduce';
    const narrativeAnchor = Number.parseFloat(target.dataset.cinemaAnchor || '0');
    const scrollableDistance = Math.max(0, target.offsetHeight - window.innerHeight);
    const top = target.getBoundingClientRect().top
      + window.scrollY
      + (isCompact || isReduced ? 0 : scrollableDistance * narrativeAnchor);

    window.scrollTo({ top, left: 0, behavior: 'auto' });
    target.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const restoreDirectInput = () => setInputMode('direct');
    const handleKeyboardScrollIntent = (event) => {
      if (
        event.defaultPrevented
        || event.altKey
        || event.ctrlKey
        || event.metaKey
      ) return;
      if (event.key === 'Tab') {
        setInputMode('keyboard');
        return;
      }
      if (isEditableTarget(event.target)) return;
      if (!KEYBOARD_SCROLL_KEYS.has(event.key) && event.code !== 'Space') return;
      setInputMode('keyboard');
    };

    window.addEventListener('keydown', handleKeyboardScrollIntent);
    window.addEventListener('pointerdown', restoreDirectInput, { passive: true });
    window.addEventListener('touchstart', restoreDirectInput, { passive: true });
    window.addEventListener('wheel', restoreDirectInput, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyboardScrollIntent);
      window.removeEventListener('pointerdown', restoreDirectInput);
      window.removeEventListener('touchstart', restoreDirectInput);
      window.removeEventListener('wheel', restoreDirectInput);
    };
  }, [setInputMode]);

  useLayoutEffect(() => {
    const handleGeometryReady = (event) => {
      const pendingAnchor = pendingHashAnchorRef.current;
      if (!pendingAnchor || event.detail?.routeKey !== pendingAnchor.routeKey) return;

      window.cancelAnimationFrame(pendingHashFrameRef.current);
      pendingHashFrameRef.current = window.requestAnimationFrame(() => {
        pendingHashFrameRef.current = 0;
        pendingHashAnchorRef.current = null;
        const target = getHashTarget(pendingAnchor.hash);
        if (target) moveToTarget(target);
      });
    };

    window.addEventListener(CINEMA_GEOMETRY_READY_EVENT, handleGeometryReady);
    return () => {
      window.removeEventListener(CINEMA_GEOMETRY_READY_EVENT, handleGeometryReady);
      window.cancelAnimationFrame(pendingHashFrameRef.current);
      pendingHashFrameRef.current = 0;
    };
  }, [moveToTarget]);

  useEffect(() => {
    const savedPosition = navigationType === 'POP'
      && scrollPositionsRef.current.has(location.key);
    if (location.pathname !== '/' || !location.hash || savedPosition) return undefined;

    const settleHashAnchor = () => {
      const target = getHashTarget(location.hash);
      if (target) moveToTarget(target);
    };

    window.cancelAnimationFrame(hashSettleFrameRef.current);
    window.clearTimeout(hashSettleTimerRef.current);
    hashSettleFrameRef.current = window.requestAnimationFrame(() => {
      hashSettleFrameRef.current = window.requestAnimationFrame(() => {
        hashSettleFrameRef.current = 0;
        settleHashAnchor();
      });
    });
    if (navigationType === 'POP') {
      hashSettleTimerRef.current = window.setTimeout(settleHashAnchor, 320);
    }

    return () => {
      window.cancelAnimationFrame(hashSettleFrameRef.current);
      window.clearTimeout(hashSettleTimerRef.current);
      hashSettleFrameRef.current = 0;
      hashSettleTimerRef.current = 0;
    };
  }, [location.hash, location.key, location.pathname, moveToTarget, navigationType]);

  const onStoryNavigate = useCallback((event, hash) => {
    if (hasModifiedActivation(event)) return;
    event.preventDefault();
    const mode = event.detail === 0 ? 'keyboard' : 'direct';
    setInputMode(mode);

    if (location.pathname === '/') {
      const target = getHashTarget(hash);
      if (!target) return;
      navigate(
        localizedStoryPath(hash, language, location.search),
        { replace: location.hash === hash, state: { inputMode: mode } },
      );
      moveToTarget(target, mode);
      return;
    }

    pendingRouteModeRef.current = mode;
    navigate(
      localizedStoryPath(hash, language, location.search),
      { state: { focusId: hash.slice(1), inputMode: mode } },
    );
  }, [language, location.hash, location.pathname, location.search, moveToTarget, navigate, setInputMode]);

  const onProjectNavigate = useCallback((event, destination) => {
    if (hasModifiedActivation(event)) return;

    event.preventDefault();
    const mode = event.detail === 0 ? 'keyboard' : 'direct';
    setInputMode(mode);
    pendingRouteModeRef.current = mode;
    scrollPositionsRef.current.set(location.key, {
      focusId: event.currentTarget.id || 'work',
      top: window.scrollY,
    });
    navigate(localizedInternalPath(destination, language, location.search), {
      state: {
        inputMode: mode,
        returnKey: location.key,
      },
    });
  }, [language, location.key, location.search, navigate, setInputMode]);

  const onRouteBack = useCallback((event, fallbackDestination = '/') => {
    if (hasModifiedActivation(event)) return;

    event.preventDefault();
    const mode = event.detail === 0 ? 'keyboard' : 'direct';
    const returnKey = location.state?.returnKey;
    setInputMode(mode);
    pendingRouteModeRef.current = mode;

    if (returnKey && scrollPositionsRef.current.has(returnKey)) {
      navigate(-1);
      return;
    }

    navigate(fallbackDestination, { state: { inputMode: mode } });
  }, [location.state, navigate, setInputMode]);

  const onProjectBack = useCallback((event, fallbackHash = '#work') => {
    const hash = fallbackHash.startsWith('#') ? fallbackHash : `#${fallbackHash}`;
    onRouteBack(event, localizedStoryPath(hash, language, location.search));
  }, [language, location.search, onRouteBack]);

  const handleSkip = useCallback((event) => {
    const target = document.getElementById('main-content');
    if (!target) return;

    event.preventDefault();
    setInputMode('keyboard');
    moveToTarget(target, 'keyboard');
  }, [moveToTarget, setInputMode]);

  useLayoutEffect(() => {
    const previousLocation = previousLocationRef.current;
    const routeChanged = previousLocation && previousLocation.pathname !== location.pathname;
    const savedPosition = navigationType === 'POP'
      ? scrollPositionsRef.current.get(location.key)
      : null;

    pendingHashAnchorRef.current = null;

    if (savedPosition) {
      setInputMode('programmatic');
      window.scrollTo({ top: savedPosition.top, left: 0, behavior: 'auto' });
      document.getElementById(savedPosition.focusId)?.focus({ preventScroll: true });
    } else if (location.pathname === '/' && location.hash) {
      const target = getHashTarget(location.hash);
      if (target) {
        const mode = routeChanged ? 'programmatic' : (location.state?.inputMode || 'programmatic');
        const waitForRouteGeometry = routeChanged
          || shellRef.current?.dataset.motionDirector !== 'ready';
        if (waitForRouteGeometry) {
          pendingHashAnchorRef.current = {
            hash: location.hash,
            routeKey: motionRouteKey,
          };
        }
        setInputMode(mode);
        if (!waitForRouteGeometry) moveToTarget(target, mode);
      }
    } else if (routeChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }

    previousLocationRef.current = location;
    pendingRouteModeRef.current = null;
    return undefined;
  }, [location, motionRouteKey, moveToTarget, navigationType, setInputMode]);

  return (
    <div
      ref={shellRef}
      className="experience-shell"
      data-route-path={location.pathname}
    >
      <a className="skip-link" href="#main-content" onClick={handleSkip}>
        {copy.skip}
      </a>
      <SiteHeader
        activeSection={journey.activeId}
        language={language}
        copy={copy}
        onLanguageChange={onLanguageChange}
        onStoryNavigate={onStoryNavigate}
      />
      <SignalForgeStage
        cameraState="CAM-00"
        continuous
        direction={language === 'he' ? 'rtl' : 'ltr'}
        immediate
        language={language}
      />
      <JourneyField journey={journey} progressRef={journeyProgressRef} />
      <div
        className="route-viewport"
        data-route-playback={routePlayback}
        data-route-status="ready"
      >
        <Outlet context={{ onProjectBack, onProjectNavigate, onRouteBack, onStoryNavigate }} />
      </div>
    </div>
  );
}
