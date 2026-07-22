import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getPortfolioCapabilityGroups, type PortfolioLanguage } from '../../data/portfolioCapabilities';

const About = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const capabilityStageRef = useRef<HTMLDivElement>(null);
  const capabilityRailRef = useRef<HTMLDivElement>(null);
  const capabilityTrackRef = useRef<HTMLDivElement>(null);
  const capabilityDistance = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const language: PortfolioLanguage = i18n.language === 'he' ? 'he' : 'en';
  const capabilityGroups = getPortfolioCapabilityGroups(language);
  const operatingLoop = ['frame', 'build', 'prove'] as const;
  const direction = language === 'he' ? 1 : -1;

  useLayoutEffect(() => {
    const stage = capabilityStageRef.current;
    const rail = capabilityRailRef.current;
    const track = capabilityTrackRef.current;

    if (!stage || !rail || !track) {
      return;
    }

    if (shouldReduceMotion) {
      capabilityDistance.set(0);
      stage.style.removeProperty('--capability-travel');
      return;
    }

    const measureDistance = () => {
      const cards = track.querySelectorAll<HTMLElement>('.about-capability-module');
      const firstCard = cards.item(0);
      const lastCard = cards.item(cards.length - 1);
      const cardTravel = firstCard && lastCard
        ? Math.abs(lastCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left)
        : 0;
      const distance = window.innerWidth < 768 ? Math.max(0, cardTravel) : 0;

      capabilityDistance.set(distance);
      stage.style.setProperty('--capability-travel', `${distance}px`);
    };

    measureDistance();
    window.addEventListener('resize', measureDistance);

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureDistance);
    resizeObserver?.observe(rail);
    resizeObserver?.observe(track);

    return () => {
      window.removeEventListener('resize', measureDistance);
      resizeObserver?.disconnect();
    };
  }, [capabilityDistance, capabilityGroups.length, shouldReduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'end 35%'],
  });

  const { scrollYProgress: capabilityProgress } = useScroll({
    target: capabilityStageRef,
    offset: ['start start', 'end end'],
  });

  const frameX = useTransform(scrollYProgress, [0.02, 0.2], [direction * 92, 0]);
  const frameRotate = useTransform(scrollYProgress, [0.02, 0.2], [direction * 3, 0]);
  const buildY = useTransform(scrollYProgress, [0.08, 0.28], [58, 0]);
  const buildScale = useTransform(scrollYProgress, [0.08, 0.28], [0.92, 1]);
  const proveX = useTransform(scrollYProgress, [0.14, 0.34], [direction * -92, 0]);
  const proveRotate = useTransform(scrollYProgress, [0.14, 0.34], [direction * -3, 0]);
  const nodeOpacity = useTransform(scrollYProgress, [0.02, 0.24], [0.15, 1]);
  const connectorScale = useTransform(scrollYProgress, [0.16, 0.42], [0, 1]);
  const capabilityX = useTransform(
    [capabilityProgress, capabilityDistance],
    ([progress, distance]) => Number(progress) * direction * Number(distance),
  );

  const stepStyles = shouldReduceMotion
    ? [{}, {}, {}]
    : [
        { x: frameX, rotate: frameRotate, opacity: nodeOpacity },
        { y: buildY, scale: buildScale, opacity: nodeOpacity },
        { x: proveX, rotate: proveRotate, opacity: nodeOpacity },
      ];

  const reveal = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-system relative border-y border-neutral-200/70 px-5 py-16 dark:border-neutral-800/70 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="about-system-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="pointer-events-none absolute end-3 top-10 font-mono text-[7rem] font-black leading-none tracking-[-0.08em] text-neutral-900/[0.035] dark:text-white/[0.035] sm:end-8 sm:text-[11rem]" aria-hidden="true">
        02
      </span>

      <div className="relative mx-auto max-w-[1480px]">
        <motion.header
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={reveal}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-neutral-300/80 pb-8 dark:border-neutral-800 sm:pb-10"
        >
          <div className="mb-5 flex items-center gap-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
            <span className="h-px w-9 bg-primary-500" />
            <span>{t('about.eyebrow')}</span>
          </div>
          <h2 className="max-w-[14ch] text-[clamp(2.65rem,6.4vw,6rem)] font-black leading-[0.9] tracking-[-0.06em] text-neutral-950 dark:text-white">
            {t('about.systemTitle')}
          </h2>
        </motion.header>

        <div className="about-system-flow relative mt-10 grid gap-3 overflow-x-clip md:mt-14 md:grid-cols-3 md:gap-5">
          <motion.div
            style={shouldReduceMotion ? undefined : { scaleX: connectorScale }}
            className="about-system-connector absolute inset-x-[12%] top-[2.45rem] hidden h-px origin-left bg-primary-500/70 md:block rtl:origin-right"
            aria-hidden="true"
          />
          <motion.div
            style={shouldReduceMotion ? undefined : { scaleY: connectorScale }}
            className="absolute bottom-8 start-[1.18rem] top-8 w-px origin-top bg-primary-500/60 md:hidden"
            aria-hidden="true"
          />

          {operatingLoop.map((step, index) => (
            <motion.article
              key={step}
              style={stepStyles[index]}
              className="about-system-step relative z-10 grid grid-cols-[2.35rem_1fr] gap-3 border border-neutral-300/80 p-4 dark:border-neutral-800 sm:p-5 md:block md:min-h-[10.5rem] md:text-center"
            >
              <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-primary-500 bg-neutral-50 font-mono text-[0.62rem] font-black text-primary-700 shadow-[0_0_0_6px_var(--effect-about-module)] dark:bg-neutral-950 dark:text-primary-400 md:mx-auto md:h-10 md:w-10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="pt-0.5 md:pt-5">
                <h3 className="font-black text-neutral-950 dark:text-white sm:text-lg">{t(`about.loop.${step}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`about.loop.${step}.description`)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-3xl border-s-2 border-primary-500 ps-5 text-base font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 sm:mt-10 sm:text-lg"
        >
          {t('about.summary')}
        </motion.p>

        <div
          ref={capabilityStageRef}
          className={`relative mt-0 sm:mt-16 ${shouldReduceMotion ? '' : 'about-capability-stage'}`}
        >
          <div className={shouldReduceMotion ? '' : 'about-capability-pin'}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-neutral-500" translate="no">
                  CAPABILITY MAP / {String(capabilityGroups.length).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
                  {t('about.techStack')}
                </h3>
              </div>
              <span className="hidden font-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-neutral-500 md:inline" translate="no">
                NEED → SYSTEM → PROOF
              </span>
              <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-neutral-500 md:hidden" translate="no">
                SCROLL ↓ / MAP ↔
              </span>
            </div>

            <div
              ref={capabilityRailRef}
              className={`about-capability-rail -mx-5 px-5 pb-4 sm:-mx-8 sm:px-8 md:mx-0 md:overflow-visible md:border-b md:border-neutral-300/80 md:px-0 md:pb-0 dark:md:border-neutral-800 ${shouldReduceMotion ? 'snap-x snap-mandatory overflow-x-auto' : 'overflow-hidden'}`}
            >
              <motion.div
                ref={capabilityTrackRef}
                style={shouldReduceMotion ? undefined : { x: capabilityX }}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
                className="about-capability-track flex w-max gap-3 md:grid md:w-auto md:grid-cols-2 md:gap-0"
              >
                {capabilityGroups.map((group, index) => (
                  <motion.article
                    key={group.id}
                    variants={reveal}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className={`about-capability-module relative flex w-[82vw] max-w-[20rem] shrink-0 snap-start flex-col justify-center border border-neutral-300/80 px-4 py-5 dark:border-neutral-800 sm:grid sm:w-[62vw] sm:grid-cols-[minmax(10rem,0.72fr)_1.28fr] sm:items-start sm:gap-3 sm:px-5 md:w-auto md:max-w-none md:border-x-0 md:border-b-0 md:border-t ${index % 2 === 1 ? 'md:border-s' : ''}`}
                  >
                    <div>
                      <span className="font-mono text-[0.56rem] font-black tracking-[0.15em] text-primary-700 dark:text-primary-400">
                        MODULE / {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="mt-1 text-base font-black tracking-tight text-neutral-950 dark:text-white">
                        {group.label}
                      </h4>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 sm:mt-0 sm:pt-1">
                      {group.skills.map((skill) => (
                        <span key={skill} className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.06em] text-neutral-700 dark:text-neutral-300">
                          <span className="me-1 text-primary-600 dark:text-primary-400">+</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>

            {!shouldReduceMotion && (
              <div className="mt-3 h-px overflow-hidden bg-neutral-300/80 dark:bg-neutral-800 md:hidden" aria-hidden="true">
                <motion.div
                  style={{ scaleX: capabilityProgress }}
                  className="h-full origin-left bg-primary-500 rtl:origin-right"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
