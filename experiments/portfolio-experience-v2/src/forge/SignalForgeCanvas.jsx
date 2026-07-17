import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { createSignalForgeScene } from './createSignalForgeScene.js';

gsap.registerPlugin(useGSAP);

export function SignalForgeCanvas({
  cameraState,
  continuous = false,
  direction,
  immediate,
  onFailure,
  onReady,
  onStatus,
  qualityTier,
}) {
  const hostRef = useRef(null);
  const controllerRef = useRef(null);
  const callbacksRef = useRef({ onFailure, onReady, onStatus });
  callbacksRef.current = { onFailure, onReady, onStatus };

  useGSAP(() => {
    if (!hostRef.current) return undefined;

    try {
      controllerRef.current = createSignalForgeScene({
        host: hostRef.current,
        qualityTier,
        direction,
        initialState: cameraState,
        onFirstFrame: () => callbacksRef.current.onReady?.(),
        onContextLost: () => callbacksRef.current.onStatus?.('context-lost'),
        onParked: () => callbacksRef.current.onStatus?.('parked'),
      });
      if (continuous && window.__portfolioCinemaSnapshot) {
        controllerRef.current.setProgress(window.__portfolioCinemaSnapshot);
      }
    } catch (error) {
      callbacksRef.current.onFailure?.(error);
    }

    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, { scope: hostRef, dependencies: [continuous, qualityTier], revertOnUpdate: true });

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    if (continuous) return;
    if (cameraState !== 'CAM-03') onStatus?.('ready');
    controller.setState(cameraState, { immediate });
  }, [cameraState, continuous, immediate, onStatus]);

  useEffect(() => {
    if (!continuous) return undefined;
    const handleProgress = (event) => {
      controllerRef.current?.setProgress(event.detail);
    };
    window.addEventListener('cinema:progress', handleProgress);
    return () => window.removeEventListener('cinema:progress', handleProgress);
  }, [continuous]);

  useEffect(() => {
    controllerRef.current?.setDirection(direction);
  }, [direction]);

  return (
    <div
      className="forge-canvas-host"
      data-active-raf-count="0"
      data-renderer-status="mounted"
      ref={hostRef}
    />
  );
}
