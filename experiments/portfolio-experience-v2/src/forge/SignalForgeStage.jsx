import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resolveSceneCapability, sceneQualityForViewport } from './forgeStates.js';

let cachedWebGLSupport;

function supportsWebGL() {
  if (typeof cachedWebGLSupport === 'boolean') return cachedWebGLSupport;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
      || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!context) {
      cachedWebGLSupport = false;
      return cachedWebGLSupport;
    }
    context.getExtension('WEBGL_lose_context')?.loseContext();
    cachedWebGLSupport = true;
    return cachedWebGLSupport;
  } catch {
    cachedWebGLSupport = false;
    return cachedWebGLSupport;
  }
}

function getCapability() {
  const params = new URLSearchParams(window.location.search);
  const preflight = resolveSceneCapability({
    forcedOff: params.get('scene') === 'off',
    mobileLandscape: window.matchMedia('(max-width: 932px) and (orientation: landscape)').matches,
    reducedMotion: params.get('motion') === 'reduce'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(navigator.connection?.saveData),
    webgl: true,
  });

  if (!preflight.eligible) return preflight;
  return resolveSceneCapability({ webgl: supportsWebGL() });
}

const cameraLabels = {
  en: {
    'CAM-00': ['01', 'WHOLE SYSTEM'],
    'CAM-01': ['02', 'DECISION CORE'],
    'CAM-02': ['03', 'SIGNAL TOPOLOGY'],
    'CAM-03': ['04', 'PRODUCT HANDOFF'],
  },
  he: {
    'CAM-00': ['01', 'המערכת השלמה'],
    'CAM-01': ['02', 'ליבת ההחלטה'],
    'CAM-02': ['03', 'מפת האותות'],
    'CAM-03': ['04', 'העברה למוצר'],
  },
};

export function SignalForgeStage({ cameraState, continuous = false, direction, immediate, language }) {
  const [capability, setCapability] = useState(getCapability);
  const [qualityTier, setQualityTier] = useState(() => sceneQualityForViewport(window.innerWidth));
  const [requested, setRequested] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [SceneComponent, setSceneComponent] = useState(null);
  const [sceneState, setSceneState] = useState('not-requested');
  const importEpochRef = useRef(0);
  const qualityTierRef = useRef(qualityTier);
  const readyTimerRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const forcedReduced = new URLSearchParams(window.location.search).get('motion') === 'reduce';
    if (forcedReduced) root.dataset.motionOverride = 'reduce';
    else root.removeAttribute('data-motion-override');
    return () => root.removeAttribute('data-motion-override');
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const landscape = window.matchMedia('(max-width: 932px) and (orientation: landscape)');
    const sync = () => {
      const next = getCapability();
      const nextQualityTier = sceneQualityForViewport(window.innerWidth);
      setCapability(next);
      if (nextQualityTier !== qualityTierRef.current) {
        qualityTierRef.current = nextQualityTier;
        setSceneState((current) => (
          current === 'ready' || current === 'parked' ? 'loading' : current
        ));
        setQualityTier(nextQualityTier);
      }
      if (!next.eligible) {
        importEpochRef.current += 1;
        setRequested(false);
        setSceneComponent(null);
        setSceneState('not-requested');
      }
    };
    reduced.addEventListener?.('change', sync);
    landscape.addEventListener?.('change', sync);
    navigator.connection?.addEventListener?.('change', sync);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      reduced.removeEventListener?.('change', sync);
      landscape.removeEventListener?.('change', sync);
      navigator.connection?.removeEventListener?.('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  useEffect(() => {
    if (!capability.eligible || requested || (!continuous && cameraState === 'CAM-03')) return undefined;
    const request = () => setRequested(true);
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(request, { timeout: 650 })
      : window.setTimeout(request, 180);
    window.addEventListener('wheel', request, { passive: true, once: true });
    window.addEventListener('touchstart', request, { passive: true, once: true });
    window.addEventListener('pointerdown', request, { passive: true, once: true });
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      window.removeEventListener('wheel', request);
      window.removeEventListener('touchstart', request);
      window.removeEventListener('pointerdown', request);
    };
  }, [cameraState, capability.eligible, continuous, requested]);

  useEffect(() => {
    if (!requested || !capability.eligible) return undefined;
    const epoch = ++importEpochRef.current;
    let timedOut = false;
    setSceneState('loading');
    readyTimerRef.current = window.setTimeout(() => {
      timedOut = true;
      if (epoch !== importEpochRef.current) return;
      setSceneComponent(null);
      setSceneState('failed');
    }, 1500);

    import('./SignalForgeCanvas.jsx')
      .then((module) => {
        if (timedOut || epoch !== importEpochRef.current) return;
        setSceneComponent(() => module.SignalForgeCanvas);
      })
      .catch(() => {
        if (epoch !== importEpochRef.current) return;
        window.clearTimeout(readyTimerRef.current);
        setSceneState('failed');
      });

    return () => {
      window.clearTimeout(readyTimerRef.current);
    };
  }, [capability.eligible, requested]);

  const handleReady = useCallback(() => {
    window.clearTimeout(readyTimerRef.current);
    setSceneState('ready');
  }, []);

  const handleFailure = useCallback(() => {
    window.clearTimeout(readyTimerRef.current);
    setSceneComponent(null);
    setSceneState('failed');
  }, []);

  const handleStatus = useCallback((status) => {
    setSceneState(status);
  }, []);

  const labels = useMemo(() => cameraLabels[language][cameraState], [cameraState, language]);

  return (
    <div
      aria-hidden="true"
      className="forge-stage"
      data-camera-state={cameraState}
      data-continuous={continuous ? 'true' : 'false'}
      data-quality-tier={qualityTier}
      data-poster-state={posterFailed ? 'failed' : 'ready'}
      data-scene-reason={capability.reason}
      data-scene-state={sceneState}
    >
      <div className="forge-poster">
        {!posterFailed && (
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/signal-forge-hero-mobile.webp" />
            <img
              alt=""
              decoding="async"
              fetchPriority="high"
              height="992"
              onError={() => setPosterFailed(true)}
              src="/assets/signal-forge-hero.webp"
              width="1586"
            />
          </picture>
        )}
      </div>
      {SceneComponent && (
        <SceneComponent
          cameraState={cameraState}
          continuous={continuous}
          direction={direction}
          immediate={immediate}
          onFailure={handleFailure}
          onReady={handleReady}
          onStatus={handleStatus}
          qualityTier={qualityTier}
        />
      )}
      <div className="forge-vignette" />
      <div className="forge-camera-hud">
        <span>{labels[0]}</span>
        <strong>{labels[1]}</strong>
        <i><b /></i>
      </div>
    </div>
  );
}
