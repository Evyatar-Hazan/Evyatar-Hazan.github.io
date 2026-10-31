import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden="true"
      className="fixed inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 z-[10000]"
      style={{ scaleX, transformOrigin: 'var(--inline-start-origin)' }}
    />
  );
};

export default ScrollProgress;
