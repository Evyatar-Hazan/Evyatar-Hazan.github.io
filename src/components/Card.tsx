import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXPct = useMotionValue(0.5);
  const mouseYPct = useMotionValue(0.5);

  const rotateX = useTransform(mouseYPct, [0, 1], [2, -2]);
  const rotateY = useTransform(mouseXPct, [0, 1], [-2, 2]);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);
    mouseXPct.set(x / width);
    mouseYPct.set(y / height);
  }

  function handleMouseLeave() {
    mouseXPct.set(0.5);
    mouseYPct.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`group relative p-6 bg-white dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-500 transform-gpu ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.12),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
