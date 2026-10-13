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
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 z-[10000]"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  );
};

export default ScrollProgress;
