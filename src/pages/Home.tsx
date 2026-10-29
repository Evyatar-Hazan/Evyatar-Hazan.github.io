import { ArrowUpRight, MessageCircle } from 'lucide-react';
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

  usePageSeo({
    title: isHebrew ? 'אביתר חזן | Full Stack Developer' : 'Evyatar Hazan | Full Stack Developer',
    description: isHebrew
      ? 'פורטפוליו של אביתר חזן עם אתרים עסקיים, מערכות Full Stack, כלי מוצר, כתיבה מקצועית ודרכי יצירת קשר ישירות.'
      : 'Portfolio of Evyatar Hazan with business websites, full-stack systems, product tools, technical writing, and direct contact paths.',
    path: '/'
  });

  return (
    <section
      id="home"
      data-reader-journey-stage="value"
      className="home-section home-section--hero product-compiler-hero relative overflow-clip"
    >
      <div className="content-container product-compiler-sticky relative flex min-h-svh items-start overflow-hidden pb-10 pt-[7.25rem] sm:items-center sm:py-28">
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
            target: { route: 'homeProjects' },
            icon: <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />,
          }}
          visual={<ProductCompilerVisual
            isHebrew={isHebrew}
            labels={{
              business: t('home.compiler.layers.business'),
              experience: t('home.compiler.layers.experience'),
              engineering: t('home.compiler.layers.engineering'),
              ready: t('home.compiler.ready'),
            }}
          />}
        />

      </div>
    </section>
  );
};

export default Home;
