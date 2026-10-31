import { useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

const Magnetic = ({ children, className = '', intensity = 0.3 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouse = (e: MouseEvent) => {
    if (reduceMotion) return;

    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x: x * intensity, y: y * intensity });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: reduceMotion ? 0 : position.x, y: reduceMotion ? 0 : position.y }}
      transition={reduceMotion
        ? { duration: 0 }
        : { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`magnetic inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
