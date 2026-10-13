import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { BadgeCheck, BriefcaseBusiness, Code2, PanelsTopLeft } from 'lucide-react';
import { type PointerEvent } from 'react';

type ProductCompilerVisualProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  isHebrew: boolean;
  labels: {
    business: string;
    experience: string;
    engineering: string;
    ready: string;
  };
};

const ProductCompilerVisual = ({
  progress,
  reduceMotion,
  isHebrew,
  labels,
}: ProductCompilerVisualProps) => {
  const direction = isHebrew ? 1 : -1;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerSpringX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.5 });
  const pointerSpringY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.5 });
  const inputOffset = useTransform(progress, [0, 0.62], [direction * 10, 0]);
  const connectorProgress = useTransform(progress, [0, 0.54], [0.72, 1]);
  const outputScale = useTransform(progress, [0, 0.62], [0.96, 1]);
  const outputOpacity = useTransform(progress, [0, 0.42], [0.86, 1]);
  const sceneScale = useTransform(progress, [0.72, 1], [1, 0.97]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const layers = [
    { id: 'business', number: '01', label: labels.business, Icon: BriefcaseBusiness },
    { id: 'experience', number: '02', label: labels.experience, Icon: PanelsTopLeft },
    { id: 'engineering', number: '03', label: labels.engineering, Icon: Code2 },
  ] as const;

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={{
        x: reduceMotion ? 0 : pointerSpringX,
        y: reduceMotion ? 0 : pointerSpringY,
        scale: reduceMotion ? 1 : sceneScale,
      }}
      className={`product-compiler-scene ${isHebrew ? 'product-compiler-scene-rtl' : ''}`}
      aria-hidden="true"
      data-testid="product-compiler-visual"
    >
      <div className="product-compiler-flow">
        <motion.div
          className="product-compiler-inputs"
          style={{ x: reduceMotion ? 0 : inputOffset }}
        >
          {layers.map(({ id, number, label, Icon }) => (
            <div
              key={id}
              className={`product-compiler-input product-compiler-input-${id}`}
              data-compiler-layer={id}
            >
              <div className="product-compiler-input-heading">
                <span className="product-compiler-input-number">{number}</span>
                <span className="product-compiler-input-icon"><Icon /></span>
              </div>
              <strong>{label}</strong>
              <span className="product-compiler-signal" aria-hidden="true">
                <i /><i /><i />
              </span>
            </div>
          ))}
        </motion.div>

        <svg className="product-compiler-connectors product-compiler-connectors-desktop" viewBox="0 0 96 360" fill="none">
          <motion.path d="M0 58 H24 C42 58 42 180 72 180 H96" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <motion.path d="M0 180 H96" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <motion.path d="M0 302 H24 C42 302 42 180 72 180 H96" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <circle cx="72" cy="180" r="4" />
        </svg>

        <svg className="product-compiler-connectors product-compiler-connectors-mobile" viewBox="0 0 360 52" fill="none">
          <motion.path d="M60 0 V14 C60 30 180 24 180 48" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <motion.path d="M180 0 V48" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <motion.path d="M300 0 V14 C300 30 180 24 180 48" style={{ pathLength: reduceMotion ? 1 : connectorProgress }} />
          <circle cx="180" cy="48" r="4" />
        </svg>

        <motion.div
          className="product-compiler-output"
          data-compiler-output="true"
          style={{
            opacity: reduceMotion ? 1 : outputOpacity,
            scale: reduceMotion ? 1 : outputScale,
          }}
        >
          <div className="product-compiler-output-header">
            <div className="product-compiler-output-status">
              <BadgeCheck />
              <strong>{labels.ready}</strong>
            </div>
            <span className="product-compiler-output-code">BUILD / 01</span>
          </div>

          <div className="product-compiler-output-body">
            <div className="product-compiler-output-sidebar">
              <span className="is-active" />
              <span />
              <span />
              <span />
            </div>
            <div className="product-compiler-output-interface">
              <div className="product-compiler-output-toolbar">
                <span />
                <i /><i />
              </div>
              <div className="product-compiler-output-content">
                <div className="product-compiler-output-copy">
                  <strong />
                  <span />
                  <span />
                  <i />
                </div>
                <div className="product-compiler-output-panel">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>

          <div className="product-compiler-output-footer">
            {layers.map(({ id, number }) => (
              <span key={id} className={`product-compiler-output-indicator is-${id}`}>
                <i /> {number}
              </span>
            ))}
            <span className="product-compiler-output-verified"><BadgeCheck /> VERIFIED</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCompilerVisual;
