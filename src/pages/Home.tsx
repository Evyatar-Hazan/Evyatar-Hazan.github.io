import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useRef, type PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import LocalizedHeroLayout from '../components/sections/LocalizedHeroLayout';
import { profileLinks } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  usePageSeo({
    title: isHebrew ? 'אביתר חזן | Full Stack Developer' : 'Evyatar Hazan | Full Stack Developer',
    description: isHebrew
      ? 'פורטפוליו של אביתר חזן עם אתרים עסקיים, מערכות Full Stack, כלי מוצר, כתיבה מקצועית ודרכי יצירת קשר ישירות.'
      : 'Portfolio of Evyatar Hazan with business websites, full-stack systems, product tools, technical writing, and direct contact paths.',
    path: '/'
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const direction = isHebrew ? 1 : -1;
  const businessX = useTransform(scrollYProgress, [0, 0.62], [direction * 92, direction * 14]);
  const businessY = useTransform(scrollYProgress, [0, 0.62], [-82, -18]);
  const businessRotate = useTransform(scrollYProgress, [0, 0.62], [direction * 7, 0]);
  const experienceX = useTransform(scrollYProgress, [0, 0.62], [direction * -104, 0]);
  const experienceY = useTransform(scrollYProgress, [0, 0.62], [8, 0]);
  const experienceRotate = useTransform(scrollYProgress, [0, 0.62], [direction * -6, 0]);
  const engineeringX = useTransform(scrollYProgress, [0, 0.62], [direction * 58, direction * -14]);
  const engineeringY = useTransform(scrollYProgress, [0, 0.62], [102, 18]);
  const engineeringRotate = useTransform(scrollYProgress, [0, 0.62], [direction * 5, 0]);
  const compiledOpacity = useTransform(scrollYProgress, [0.28, 0.56], [0, 1]);
  const compiledScale = useTransform(scrollYProgress, [0.28, 0.62], [0.88, 1]);
  const connectorProgress = useTransform(scrollYProgress, [0.08, 0.56], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.6, 1], [0, -24]);
  const sceneScale = useTransform(scrollYProgress, [0.72, 1], [1, 0.92]);
  const sceneOpacity = useTransform(scrollYProgress, [0.82, 1], [1, 0.72]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerSpringX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.5 });
  const pointerSpringY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.5 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section ref={sectionRef} id="home" className="product-compiler-hero relative h-[118svh] overflow-clip md:h-[150svh]">
      <div className="product-compiler-sticky sticky top-0 flex min-h-svh items-start overflow-hidden px-5 pb-6 pt-[7.25rem] sm:items-center sm:px-8 sm:pb-10 sm:pt-28 lg:px-12">
        <div className="product-compiler-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="product-compiler-aura pointer-events-none absolute inset-0" aria-hidden="true" />

        <LocalizedHeroLayout
          language={language}
          buildPath={localizedPath}
          copy={{
            availability: t('home.available'),
            prelude: t('home.compiler.prelude'),
            headline: t('home.compiler.headline'),
            description: t('home.compiler.description'),
            signature: 'EVYATAR HAZAN / PRODUCT ENGINEER',
          }}
          primaryAction={{
            label: t('home.compiler.buildCta'),
            href: `${profileLinks.whatsapp}?text=${encodeURIComponent(t('home.whatsappText'))}`,
            external: true,
            icon: <MessageCircle className="h-5 w-5" />,
          }}
          secondaryAction={{
            label: t('home.compiler.workCta'),
            target: { route: 'projects' },
            icon: <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />,
          }}
          copyStyle={{ y: shouldReduceMotion ? 0 : copyY }}
          visual={<motion.div
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            style={{
              x: shouldReduceMotion ? 0 : pointerSpringX,
              y: shouldReduceMotion ? 0 : pointerSpringY,
              scale: shouldReduceMotion ? 1 : sceneScale,
              opacity: shouldReduceMotion ? 1 : sceneOpacity,
            }}
            className="product-compiler-scene relative z-10 mx-auto grid aspect-[1.08] w-full max-w-[620px] place-items-center lg:mx-0 lg:ms-auto"
            aria-hidden="true"
          >
            <div className="product-compiler-orbit absolute inset-[7%] rounded-full" />
            <div className="product-compiler-orbit product-compiler-orbit-inner absolute inset-[18%] rounded-full" />
            <span className="absolute start-[4%] top-[12%] font-mono text-[0.62rem] font-bold tracking-[0.18em] text-neutral-500 dark:text-neutral-600">INPUT / 01</span>
            <span className="absolute end-[3%] bottom-[10%] font-mono text-[0.62rem] font-bold tracking-[0.18em] text-primary-600 dark:text-primary-400">OUTPUT / READY</span>

            <svg className={`absolute inset-[8%] h-[84%] w-[84%] text-primary-500 ${isHebrew ? '-scale-x-100' : ''}`} viewBox="0 0 500 440" fill="none">
              <motion.path
                d="M62 78 C140 42 160 184 248 218 C330 250 344 92 438 128"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                style={{ pathLength: shouldReduceMotion ? 1 : connectorProgress }}
              />
              <motion.path
                d="M84 356 C170 392 188 272 248 218 C302 168 368 326 426 344"
                stroke="currentColor"
                strokeWidth="1"
                style={{ pathLength: shouldReduceMotion ? 1 : connectorProgress }}
              />
            </svg>

            <div className="grid w-[72%] place-items-center [grid-template-areas:'stack']">
              <motion.div
                style={shouldReduceMotion ? { x: direction * 14, y: -18, rotate: 0 } : { x: businessX, y: businessY, rotate: businessRotate }}
                className="product-compiler-layer product-compiler-layer-business [grid-area:stack]"
              >
                <span>01</span>
                <strong>{t('home.compiler.layers.business')}</strong>
              </motion.div>

              <motion.div
                style={shouldReduceMotion ? { x: 0, y: 0, rotate: 0 } : { x: experienceX, y: experienceY, rotate: experienceRotate }}
                className="product-compiler-layer product-compiler-layer-experience [grid-area:stack]"
              >
                <span>02</span>
                <strong>{t('home.compiler.layers.experience')}</strong>
              </motion.div>

              <motion.div
                style={shouldReduceMotion ? { x: direction * -14, y: 18, rotate: 0 } : { x: engineeringX, y: engineeringY, rotate: engineeringRotate }}
                className="product-compiler-layer product-compiler-layer-engineering [grid-area:stack]"
              >
                <span>03</span>
                <strong>{t('home.compiler.layers.engineering')}</strong>
              </motion.div>

              <motion.div
                style={{
                  opacity: shouldReduceMotion ? 1 : compiledOpacity,
                  scale: shouldReduceMotion ? 1 : compiledScale,
                }}
                className="product-compiler-output [grid-area:stack]"
              >
                <div className="flex items-center justify-between border-b border-neutral-300/70 px-4 py-3 dark:border-neutral-700/70">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                  <span className="font-mono text-[0.55rem] font-bold tracking-[0.16em] text-success-700 dark:text-success-400">
                    {t('home.compiler.ready')}
                  </span>
                </div>
                <div className="grid flex-1 grid-cols-[0.38fr_1fr] gap-3 p-4">
                  <div className="rounded-lg border border-neutral-300/70 bg-white/35 dark:border-neutral-700/70 dark:bg-black/20" />
                  <div className="space-y-2.5 pt-1">
                    <div className="h-2 w-3/4 rounded-full bg-neutral-800/80 dark:bg-white/80" />
                    <div className="h-1.5 w-full rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="h-1.5 w-4/5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="mt-4 h-7 w-2/5 rounded-full bg-primary-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>}
        />

        <div className="absolute bottom-5 start-5 hidden items-center gap-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-neutral-500 md:flex lg:start-12" aria-hidden="true">
          <ArrowDown className="h-4 w-4 text-primary-500" />
          <span>{t('home.compiler.scroll')}</span>
        </div>

        <div className="absolute bottom-0 end-5 top-28 hidden w-px bg-neutral-300/70 dark:bg-neutral-800 md:block lg:end-12" aria-hidden="true">
          <motion.div
            style={{ scaleY: shouldReduceMotion ? 1 : scrollYProgress }}
            className="h-full origin-top bg-primary-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
