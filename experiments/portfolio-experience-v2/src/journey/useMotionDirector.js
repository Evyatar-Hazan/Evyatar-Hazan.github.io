import { useEffect, useMemo, useRef, useState } from 'react';

export const CINEMA_PROGRESS_EVENT = 'cinema:progress';
export const CINEMA_GEOMETRY_READY_EVENT = 'cinema:geometry-ready';

const DEFAULT_DAMPING_MS = 100;
const MIN_DAMPING_MS = 80;
const MAX_DAMPING_MS = 120;
const SETTLE_EPSILON = 0.075;
const DEFAULT_SNAP_INPUT_MODES = Object.freeze(['keyboard', 'programmatic']);
const SCENE_ENTER_END = 0.18;
const SCENE_EXIT_START = 0.82;

const DEFAULT_JOURNEY = {
  activeId: 'forge',
  activeTheme: 'forge',
  beat: 'intro',
  index: 0,
  label: 'SIGNAL FORGE',
  phase: 'forge',
  theme: 'forge',
  total: 1,
};

const EMPTY_SNAPSHOT = {
  activeId: 'forge',
  activeIndex: 0,
  activeTheme: 'forge',
  beat: 'intro',
  direction: 'idle',
  progress: 0,
  routeKey: 'default',
  routeProgress: 0,
  sceneProgress: 0,
  velocity: 0,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function rangeProgress(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

function smoothstep(value, start, end) {
  const progress = rangeProgress(value, start, end);
  return progress * progress * (3 - (2 * progress));
}

function formatProgress(value) {
  return clamp01(value).toFixed(5);
}

function writeProgressVariable(target, cache, property, value) {
  const formatted = formatProgress(value);
  if (cache[property] === formatted) return;
  cache[property] = formatted;
  target.style.setProperty(property, formatted);
}

function writeDatasetValue(target, cache, property, value) {
  const formatted = String(value);
  if (cache[property] === formatted) return;
  cache[property] = formatted;
  target.dataset[property] = formatted;
}

function removeCinemaVariables(element) {
  element.style.removeProperty('--scene-progress');
  element.style.removeProperty('--scene-enter');
  element.style.removeProperty('--scene-focus');
  element.style.removeProperty('--scene-exit');
  element.style.removeProperty('--beat-progress');
  element.style.removeProperty('--beat-exit');
  element.removeAttribute('data-cinema-active');
  element.removeAttribute('data-cinema-readable');
  element.removeAttribute('data-compact-visible');
}

function getLayoutTop(element) {
  let current = element;
  let top = 0;

  while (current instanceof HTMLElement) {
    top += current.offsetTop;
    current = current.offsetParent;
  }

  if (Number.isFinite(top)) return top;
  return element.getBoundingClientRect().top + window.scrollY;
}

function getTrackRange({
  activationOffset,
  index,
  nextTop,
  routeScrollable,
  top,
  total,
}) {
  const start = index === 0
    ? 0
    : clamp(top - activationOffset, 0, routeScrollable);
  const end = index === total - 1
    ? routeScrollable
    : clamp(nextTop - activationOffset, start, routeScrollable);

  return { end, start };
}

function parseCinemaWindow(value) {
  const values = String(value || '')
    .split(',')
    .slice(0, 2)
    .map((part) => Number.parseFloat(part.trim()));

  if (values.length !== 2 || values.some((part) => !Number.isFinite(part))) {
    return { end: 1, start: 0 };
  }

  let [start, end] = values;
  if (Math.abs(start) > 1 || Math.abs(end) > 1) {
    start /= 100;
    end /= 100;
  }

  return {
    end: clamp01(Math.max(start, end)),
    start: clamp01(Math.min(start, end)),
  };
}

function describeWindow(element) {
  const { end, start } = parseCinemaWindow(element.dataset.cinemaWindow);
  return {
    cache: Object.create(null),
    element,
    end,
    id: element.dataset.cinemaBeat || element.dataset.journeyBeat || element.id || null,
    ownsVisibility: true,
    start,
  };
}

function describeSemanticWindows(element, start, end) {
  const semanticElements = [...element.querySelectorAll('[data-cinema-beat], [data-journey-beat]')]
    .filter((candidate) => candidate.closest('[data-cinema-window]') === element);
  const uniqueElements = semanticElements.filter((candidate, index) => {
    const id = candidate.dataset.cinemaBeat || candidate.dataset.journeyBeat;
    return id && semanticElements.findIndex((other) => (
      (other.dataset.cinemaBeat || other.dataset.journeyBeat) === id
    )) === index;
  });

  if (!uniqueElements.length) return [];
  const span = Math.max(0.0001, end - start);

  return uniqueElements.map((candidate, index) => ({
    cache: Object.create(null),
    element: candidate,
    end: start + span * ((index + 1) / uniqueElements.length),
    id: candidate.dataset.cinemaBeat || candidate.dataset.journeyBeat,
    ownsVisibility: false,
    start: start + span * (index / uniqueElements.length),
  }));
}

function describeWindowDescriptors(element) {
  const windowDescriptor = describeWindow(element);
  if (windowDescriptor.id) return [windowDescriptor];
  return [
    windowDescriptor,
    ...describeSemanticWindows(element, windowDescriptor.start, windowDescriptor.end),
  ];
}

function describeTrack(element, index) {
  const top = getLayoutTop(element);
  const id = element.dataset.cinemaId
    || element.dataset.journeyPhase
    || element.id
    || `scene-${index + 1}`;
  const phase = element.dataset.cinemaPhase || element.dataset.journeyPhase || id;

  return {
    cache: Object.create(null),
    element,
    end: top,
    id,
    index,
    label: element.dataset.cinemaLabel
      || element.dataset.cinemaTitle
      || element.dataset.journeyLabel
      || id,
    phase,
    route: element.dataset.cinemaRoute || element.dataset.journeyRoute || 'home',
    start: top,
    theme: element.dataset.cinemaTheme || element.dataset.journeyTheme || phase,
    top,
    windows: [...element.querySelectorAll('[data-cinema-window]')]
      .flatMap(describeWindowDescriptors)
      .sort((first, second) => first.start - second.start),
  };
}

function resolveActiveIndex(tracks, visualScrollY, activationLine) {
  let activeIndex = 0;

  tracks.forEach((track, index) => {
    if (track.top <= visualScrollY + activationLine) activeIndex = index;
  });

  return activeIndex;
}

function resolveActiveBeat(track, sceneProgress) {
  const semanticWindows = track?.windows.filter((cinemaWindow) => cinemaWindow.id) || [];
  const trackFallback = track?.element.dataset.cinemaBeat
    || track?.element.dataset.journeyState
    || track?.id
    || track?.phase
    || 'scene';
  if (!semanticWindows.length) return trackFallback;

  let activeWindow = null;
  semanticWindows.forEach((candidate) => {
    if (sceneProgress >= candidate.start) activeWindow = candidate;
  });
  return activeWindow?.id || trackFallback;
}

function resolveInputMode(shell) {
  return shell.dataset.inputMode || document.documentElement.dataset.inputMode || 'direct';
}

function isReducedMotion(mediaQuery) {
  return mediaQuery.matches
    || document.documentElement.dataset.motionOverride === 'reduce'
    || new URLSearchParams(window.location.search).get('motion') === 'reduce';
}

/**
 * Native-scroll motion director for the V2 cinematic journey.
 *
 * Drop-in JourneyField usage can keep an external ref:
 *   const journey = useMotionDirector({ shellRef, routeKey, progressRef });
 *   <JourneyField journey={journey} progressRef={progressRef} />
 *
 * Without an external ref, use the stable ref exposed on the returned journey:
 *   <JourneyField journey={journey} progressRef={journey.progressRef} />
 *
 * `journey.snapshotRef.current` carries frame-level progress/velocity/beat data.
 * React state is changed only when the active scene identity changes; consumers
 * that need continuous data should subscribe to `cinema:progress` instead.
 */
export function useMotionDirector({
  activationRatio = 0.5,
  dampingMs = DEFAULT_DAMPING_MS,
  progressRef: suppliedProgressRef,
  routeKey = 'default',
  shellRef,
  snapInputModes = DEFAULT_SNAP_INPUT_MODES,
}) {
  const internalProgressRef = useRef(null);
  const snapshotRef = useRef({ ...EMPTY_SNAPSHOT });
  const [journey, setJourney] = useState(DEFAULT_JOURNEY);
  const progressRef = suppliedProgressRef || internalProgressRef;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    const normalizedActivationRatio = clamp(activationRatio, 0, 1);
    const normalizedDampingMs = clamp(dampingMs, MIN_DAMPING_MS, MAX_DAMPING_MS);
    const snapModes = new Set(snapInputModes);
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedReduced = new URLSearchParams(window.location.search).get('motion') === 'reduce';
    let active = true;
    let activeBeat = '';
    let activeIdentity = '';
    let activeTrackIndex = -1;
    let direction = 'idle';
    let frameId = 0;
    let scrollSettledTimer = 0;
    let geometryDirty = true;
    let geometryRevision = 0;
    let hasRendered = false;
    let lastFrameTime = 0;
    let lastRenderedY = window.scrollY;
    let progressElement = progressRef.current;
    let targetScrollY = window.scrollY;
    let visualScrollY = window.scrollY;
    let tracks = [];
    let ownedElements = new Set();
    let observedTrackElements = new Set();
    let proofTrackIndex = -1;
    const shellDatasetCache = Object.create(null);
    const shellProgressCache = Object.create(null);
    const liveSnapshot = { ...EMPTY_SNAPSHOT };
    const cinemaProgressEvent = new CustomEvent(CINEMA_PROGRESS_EVENT, {
      detail: liveSnapshot,
    });
    let geometry = {
      routeScrollable: 1,
      viewportHeight: Math.max(1, window.innerHeight),
    };

    const schedule = () => {
      if (!active || frameId) return;
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
        geometryDirty = true;
        schedule();
      });

    const syncObservedTracks = () => {
      if (!resizeObserver) return;
      const nextObservedTrackElements = new Set(tracks.map((track) => track.element));
      observedTrackElements.forEach((element) => {
        if (!nextObservedTrackElements.has(element)) resizeObserver.unobserve(element);
      });
      nextObservedTrackElements.forEach((element) => {
        if (!observedTrackElements.has(element)) resizeObserver.observe(element);
      });
      observedTrackElements = nextObservedTrackElements;
    };

    const collectGeometry = () => {
      // Enable the cinematic layout before reading any dimensions. The ready
      // attribute expands desktop tracks, so measuring first would expose the
      // short fallback geometry to direct-hash navigation for one frame.
      writeDatasetValue(shell, shellDatasetCache, 'motionDirector', 'ready');
      const viewportHeight = Math.max(1, window.innerHeight);
      const activationOffset = viewportHeight * normalizedActivationRatio;
      const routeScrollable = Math.max(
        0,
        document.documentElement.scrollHeight - viewportHeight,
      );
      const describedTracks = [...shell.querySelectorAll('[data-cinema-track]')]
        .map(describeTrack);
      const nextTracks = describedTracks.map((track, index) => ({
        ...track,
        ...getTrackRange({
          activationOffset,
          index,
          nextTop: describedTracks[index + 1]?.top ?? routeScrollable + activationOffset,
          routeScrollable,
          top: track.top,
          total: describedTracks.length,
        }),
      }));
      const nextOwnedElements = new Set();

      nextTracks.forEach((track) => {
        nextOwnedElements.add(track.element);
        track.windows.forEach((cinemaWindow) => nextOwnedElements.add(cinemaWindow.element));
      });
      ownedElements.forEach((element) => {
        if (!nextOwnedElements.has(element)) removeCinemaVariables(element);
      });

      tracks = nextTracks;
      proofTrackIndex = tracks.findIndex((track) => track.id === 'proof-tradeoffs');
      ownedElements = nextOwnedElements;
      geometry = {
        routeScrollable: Math.max(1, routeScrollable),
        viewportHeight,
      };
      geometryDirty = false;
      syncObservedTracks();
      geometryRevision += 1;
      window.dispatchEvent(new CustomEvent(CINEMA_GEOMETRY_READY_EVENT, {
        detail: { revision: geometryRevision, routeKey },
      }));
    };

    const shouldSnap = () => motionPreference.matches
      || forcedReduced
      || shell.dataset.cinemaSnap === 'true'
      || document.documentElement.dataset.cinemaSnap === 'true'
      || snapModes.has(resolveInputMode(shell));

    const renderTrack = (track) => {
      const sceneProgress = rangeProgress(visualScrollY, track.start, track.end);
      const sceneEnter = smoothstep(sceneProgress, 0, SCENE_ENTER_END);
      const sceneExit = smoothstep(sceneProgress, SCENE_EXIT_START, 1);
      const sceneFocus = sceneEnter * (1 - sceneExit);

      writeProgressVariable(track.element, track.cache, '--scene-progress', sceneProgress);
      writeProgressVariable(track.element, track.cache, '--scene-enter', sceneEnter);
      writeProgressVariable(track.element, track.cache, '--scene-focus', sceneFocus);
      writeProgressVariable(track.element, track.cache, '--scene-exit', sceneExit);

      track.windows.forEach((cinemaWindow) => {
        const span = Math.max(0.0001, cinemaWindow.end - cinemaWindow.start);
        const enterEnd = Math.min(
          cinemaWindow.end,
          cinemaWindow.start + Math.max(0.055, span * 0.22),
        );
        const exitEnd = cinemaWindow.end >= 0.999
          ? 1.0001
          : Math.min(
            1,
            cinemaWindow.end + Math.max(0.06, Math.min(0.18, span * 0.32)),
          );
        const beatProgress = cinemaWindow.start <= 0
          ? 1
          : rangeProgress(sceneProgress, cinemaWindow.start, enterEnd);
        const beatExit = rangeProgress(
          sceneProgress,
          cinemaWindow.end,
          exitEnd,
        );
        writeProgressVariable(
          cinemaWindow.element,
          cinemaWindow.cache,
          '--beat-progress',
          beatProgress,
        );
        writeProgressVariable(
          cinemaWindow.element,
          cinemaWindow.cache,
          '--beat-exit',
          beatExit,
        );
        if (cinemaWindow.ownsVisibility) {
          const readable = sceneProgress >= cinemaWindow.start - 0.02
            && sceneProgress <= cinemaWindow.end + 0.12
            && beatProgress - beatExit > 0.12;
          writeDatasetValue(
            cinemaWindow.element,
            cinemaWindow.cache,
            'cinemaReadable',
            readable ? 'true' : 'false',
          );
        }
      });

      return sceneProgress;
    };

    const renderSemanticState = (activeTrack, activeIndex, sceneProgress) => {
      const beat = resolveActiveBeat(activeTrack, sceneProgress);
      const identity = `${routeKey}:${activeTrack.id}`;

      writeDatasetValue(shell, shellDatasetCache, 'cinemaActive', activeTrack.id);
      writeDatasetValue(shell, shellDatasetCache, 'cinemaTheme', activeTrack.theme);
      writeDatasetValue(shell, shellDatasetCache, 'journeyBeat', beat);
      writeDatasetValue(shell, shellDatasetCache, 'journeyDirection', direction);
      writeDatasetValue(shell, shellDatasetCache, 'journeyPhase', activeTrack.phase);
      writeDatasetValue(shell, shellDatasetCache, 'journeyRoute', activeTrack.route);
      writeDatasetValue(shell, shellDatasetCache, 'journeyTheme', activeTrack.theme);
      writeProgressVariable(
        shell,
        shellProgressCache,
        '--case-proof-progress',
        activeTrack.id === 'proof-tradeoffs'
          ? sceneProgress
          : proofTrackIndex >= 0 && activeIndex > proofTrackIndex
            ? 1
            : 0,
      );

      if (
        identity === activeIdentity
        && activeIndex === activeTrackIndex
        && beat === activeBeat
      ) return beat;
      activeIdentity = identity;
      activeTrackIndex = activeIndex;
      activeBeat = beat;
      tracks.forEach((track, index) => {
        if (index === activeIndex) track.element.dataset.cinemaActive = 'true';
        else track.element.removeAttribute('data-cinema-active');
      });
      setJourney({
        activeId: activeTrack.id,
        activeTheme: activeTrack.theme,
        beat,
        index: activeIndex,
        label: activeTrack.label,
        phase: activeTrack.phase,
        theme: activeTrack.theme,
        total: tracks.length,
      });
      return beat;
    };

    function renderFrame(time) {
      frameId = 0;
      if (!active) return;
      if (geometryDirty) collectGeometry();

      targetScrollY = window.scrollY;
      const frameTime = lastFrameTime ? Math.max(1, time - lastFrameTime) : (1000 / 60);
      const snap = shouldSnap();

      if (!hasRendered || snap) {
        visualScrollY = targetScrollY;
      } else {
        const damping = 1 - Math.exp(-frameTime / normalizedDampingMs);
        visualScrollY += (targetScrollY - visualScrollY) * damping;
        if (Math.abs(targetScrollY - visualScrollY) <= SETTLE_EPSILON) {
          visualScrollY = targetScrollY;
        }
      }

      const velocity = hasRendered
        ? ((visualScrollY - lastRenderedY) / frameTime) * 1000
        : 0;
      const routeProgress = clamp01(visualScrollY / geometry.routeScrollable);
      let activeIndex = -1;
      let activeId = '';
      let activeTheme = '';
      let activePhase = '';
      let beat = 'intro';
      let sceneProgress = 0;

      if (progressRef.current) {
        progressElement = progressRef.current;
        progressElement.style.transform = `scaleX(${routeProgress.toFixed(6)})`;
      }

      writeProgressVariable(
        shell,
        shellProgressCache,
        '--cinema-route-progress',
        routeProgress,
      );

      if (tracks.length) {
        activeIndex = resolveActiveIndex(
          tracks,
          visualScrollY,
          geometry.viewportHeight * normalizedActivationRatio,
        );
        const activeTrack = tracks[activeIndex];
        const firstRenderedIndex = Math.max(0, activeIndex - 1);
        const lastRenderedIndex = Math.min(tracks.length - 1, activeIndex + 1);
        for (let index = firstRenderedIndex; index <= lastRenderedIndex; index += 1) {
          const progress = renderTrack(tracks[index]);
          if (index === activeIndex) sceneProgress = progress;
        }
        activeId = activeTrack.id;
        activeTheme = activeTrack.theme;
        activePhase = activeTrack.phase;
        beat = renderSemanticState(activeTrack, activeIndex, sceneProgress);
      }

      writeProgressVariable(
        shell,
        shellProgressCache,
        '--cinema-active-progress',
        sceneProgress,
      );

      liveSnapshot.activeId = activeId;
      liveSnapshot.activeIndex = activeIndex;
      liveSnapshot.activeTheme = activeTheme;
      liveSnapshot.activePhase = activePhase;
      liveSnapshot.beat = beat;
      liveSnapshot.direction = direction;
      liveSnapshot.progress = routeProgress;
      liveSnapshot.routeKey = routeKey;
      liveSnapshot.routeProgress = routeProgress;
      liveSnapshot.sceneProgress = sceneProgress;
      liveSnapshot.velocity = velocity;
      snapshotRef.current = liveSnapshot;
      window.__portfolioCinemaSnapshot = liveSnapshot;
      window.dispatchEvent(cinemaProgressEvent);

      hasRendered = true;
      lastFrameTime = time;
      lastRenderedY = visualScrollY;

      if (!snap && Math.abs(targetScrollY - visualScrollY) > SETTLE_EPSILON) {
        schedule();
      }
    }

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      if (nextScrollY > targetScrollY) {
        direction = 'forward';
        writeDatasetValue(shell, shellDatasetCache, 'scrollDirection', 'down');
      } else if (nextScrollY < targetScrollY) {
        direction = 'reverse';
        writeDatasetValue(shell, shellDatasetCache, 'scrollDirection', 'up');
      }
      writeDatasetValue(shell, shellDatasetCache, 'scrollActive', 'true');
      window.clearTimeout(scrollSettledTimer);
      scrollSettledTimer = window.setTimeout(() => {
        writeDatasetValue(shell, shellDatasetCache, 'scrollActive', 'false');
      }, 180);
      targetScrollY = nextScrollY;
      schedule();
    };

    const invalidateGeometry = () => {
      geometryDirty = true;
      schedule();
    };

    const handleImageLoad = (event) => {
      if (event.target instanceof HTMLImageElement) invalidateGeometry();
    };

    const mutationObserver = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(invalidateGeometry);

    resizeObserver?.observe(shell);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', invalidateGeometry, { passive: true });
    shell.addEventListener('load', handleImageLoad, true);
    motionPreference.addEventListener?.('change', schedule);
    document.fonts?.addEventListener?.('loadingdone', invalidateGeometry);
    mutationObserver?.observe(shell, { childList: true, subtree: true });

    document.fonts?.ready.then(() => {
      if (active) invalidateGeometry();
    });

    schedule();

    return () => {
      active = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      window.clearTimeout(scrollSettledTimer);
      frameId = 0;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', invalidateGeometry);
      shell.removeEventListener('load', handleImageLoad, true);
      motionPreference.removeEventListener?.('change', schedule);
      document.fonts?.removeEventListener?.('loadingdone', invalidateGeometry);
      ownedElements.forEach(removeCinemaVariables);
      progressElement?.style.removeProperty('transform');
      shell.style.removeProperty('--case-proof-progress');
      shell.style.removeProperty('--cinema-active-progress');
      shell.style.removeProperty('--cinema-route-progress');
      delete window.__portfolioCinemaSnapshot;
      [
        'cinemaActive',
        'cinemaTheme',
        'journeyBeat',
        'journeyDirection',
        'journeyPhase',
        'journeyRoute',
        'journeyTheme',
        'motionDirector',
        'scrollActive',
        'scrollDirection',
      ].forEach((key) => delete shell.dataset[key]);
    };
  }, [
    activationRatio,
    dampingMs,
    progressRef,
    routeKey,
    shellRef,
    snapInputModes,
  ]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === 'undefined') return undefined;
    const supportsViewTimeline = CSS.supports?.('animation-timeline: view()')
      || CSS.supports?.('animation-timeline', 'view()');
    if (supportsViewTimeline) return undefined;

    const compactQuery = window.matchMedia('(max-width: 960px)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...shell.querySelectorAll([
      '[data-cinema-track] [data-cinema-window]',
      '.cinema-pin-more-work .archive-grid article',
      '.cinema-pin-capabilities .capabilities-grid article',
      '.cinema-pin-lab .lab-grid a',
    ].join(', '))];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.dataset.compactVisible = entry.isIntersecting ? 'true' : 'false';
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    const resetTargets = () => {
      observer.disconnect();
      targets.forEach((target) => target.removeAttribute('data-compact-visible'));
      shell.removeAttribute('data-compact-fallback');
    };
    const sync = () => {
      resetTargets();
      if (!compactQuery.matches || isReducedMotion(motionPreference)) return;
      shell.dataset.compactFallback = 'true';
      targets.forEach((target) => observer.observe(target));
    };

    sync();
    compactQuery.addEventListener?.('change', sync);
    motionPreference.addEventListener?.('change', sync);
    return () => {
      compactQuery.removeEventListener?.('change', sync);
      motionPreference.removeEventListener?.('change', sync);
      resetTargets();
    };
  }, [routeKey, shellRef]);

  return useMemo(() => ({
    ...journey,
    progressRef,
    snapshotRef,
  }), [journey, progressRef]);
}
