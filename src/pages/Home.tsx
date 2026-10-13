import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LocalizedHeroLayout from '../components/sections/LocalizedHeroLayout';
import ProductCompilerVisual from '../components/sections/ProductCompilerVisual';
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

  const copyY = useTransform(scrollYProgress, [0.6, 1], [0, -24]);

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
          visual={<ProductCompilerVisual
            progress={scrollYProgress}
            reduceMotion={Boolean(shouldReduceMotion)}
            isHebrew={isHebrew}
            labels={{
              business: t('home.compiler.layers.business'),
              experience: t('home.compiler.layers.experience'),
              engineering: t('home.compiler.layers.engineering'),
              ready: t('home.compiler.ready'),
            }}
          />}
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
