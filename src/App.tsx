import { useTranslation } from 'react-i18next';
import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import ProjectCaseStudy from './pages/ProjectCaseStudy';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import CustomCursor from './components/animations/CustomCursor';
import ScrollProgress from './components/animations/ScrollProgress';
import ContactNode from './components/ContactNode';
import ContactBriefFeature from './features/contact/ContactBriefFeature';
import {
  defaultPortfolioLanguage,
  getLanguageFromPath,
  isPortfolioLanguage,
  localizedPath,
  localizePath,
} from './routing/portfolioRoutes';

const About = lazy(() => import('./components/sections/About'));
const Projects = lazy(() => import('./components/sections/Projects'));
const BlogPreview = lazy(() => import('./components/sections/BlogPreview'));
const AudienceEntryPaths = lazy(() => import('./components/sections/AudienceEntryPaths'));
const ServiceEngagements = lazy(() => import('./components/sections/ServiceEngagements'));
const FlagshipProjectComparison = lazy(() => import('./components/sections/FlagshipProjectComparison'));
const HumanAboutSection = lazy(() => import('./features/humanAbout/HumanAboutSection'));
const WorkingPrinciples = lazy(() => import('./components/sections/WorkingPrinciples'));
const SignatureInteraction = lazy(() => import('./components/sections/SignatureInteraction'));
const CapabilityProof = lazy(() => import('./features/capability-proof/CapabilityProof'));
const LabPage = lazy(() => import('./pages/LabPage'));
const ProjectArchiveSlot = lazy(async () => {
  const { createProjectArchiveSlot } = await import('./components/projectArchiveSlot');
  return { default: createProjectArchiveSlot(localizedPath, 'short').Component };
});

type SectionFallbackProps = {
  id: string;
  minHeightClassName: string;
};

const SectionFallback = ({ id, minHeightClassName }: SectionFallbackProps) => (
  <section
    id={id}
    aria-busy="true"
    className={`${minHeightClassName} px-6 py-24 bg-transparent`}
  />
);

const PortfolioHome = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  return (
    <main>
      <Home />
      <Suspense fallback={<SectionFallback id="audience-paths" minHeightClassName="min-h-[55vh]" />}>
        <AudienceEntryPaths language={language} buildPath={localizedPath} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="service-engagements" minHeightClassName="min-h-[70vh]" />}>
        <ServiceEngagements language={language} buildPath={localizedPath} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="human-about" minHeightClassName="min-h-[55vh]" />}>
        <HumanAboutSection language={language} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="about" minHeightClassName="min-h-[70vh]" />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionFallback id="system-trace" minHeightClassName="min-h-[70vh]" />}>
        <SignatureInteraction
          language={language}
          localizedPath={localizedPath}
          stableIds={{
            section: 'system-trace',
            heading: 'system-trace-heading',
            detail: 'system-trace-detail',
            status: 'system-trace-status',
          }}
        />
      </Suspense>
      <Suspense fallback={<SectionFallback id="working-principles" minHeightClassName="min-h-[70vh]" />}>
        <WorkingPrinciples language={language} localizedPath={localizedPath} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="flagship-comparison" minHeightClassName="min-h-[60vh]" />}>
        <FlagshipProjectComparison language={language} buildPath={localizedPath} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="projects" minHeightClassName="min-h-screen" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback id="project-archive" minHeightClassName="min-h-[70vh]" />}>
        <div className="bg-white px-5 py-20 dark:bg-black sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[92.5rem]">
            <ProjectArchiveSlot language={language} />
          </div>
        </div>
      </Suspense>
      <Suspense fallback={<SectionFallback id="capability-proof" minHeightClassName="min-h-[70vh]" />}>
        <CapabilityProof language={language} buildPath={localizedPath} />
      </Suspense>
      <Suspense fallback={<SectionFallback id="writing" minHeightClassName="min-h-[60vh]" />}>
        <BlogPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback id="contact" minHeightClassName="min-h-[80vh]" />}>
        <ContactBriefFeature language={language} buildLocalizedPath={localizedPath} />
      </Suspense>
    </main>
  );
};

const LocalizedRoute = ({ children }: { children: ReactNode }) => {
  const { language } = useParams();
  return isPortfolioLanguage(language) ? children : <NotFoundPage />;
};

const LegacyRedirect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const requestedLanguage = query.get('lang');
  const language = requestedLanguage !== null && isPortfolioLanguage(requestedLanguage)
    ? requestedLanguage
    : isPortfolioLanguage(i18n.language)
      ? i18n.language
      : defaultPortfolioLanguage;
  query.delete('lang');
  const search = query.size > 0 ? `?${query.toString()}` : '';

  return (
    <Navigate
      replace
      to={`${localizePath(language, location.pathname)}${search}${location.hash}`}
    />
  );
};

const AppShell = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const routeLanguage = getLanguageFromPath(location.pathname);
  const activeLanguage = routeLanguage ?? (isPortfolioLanguage(i18n.language)
    ? i18n.language
    : defaultPortfolioLanguage);
  const dir = activeLanguage === 'he' ? 'rtl' : 'ltr';
  
  // Use custom theme hook to initialize global dark class mapping correctly
  useTheme();
  
  useEffect(() => {
    if (routeLanguage && i18n.language !== routeLanguage) {
      void i18n.changeLanguage(routeLanguage);
    }
  }, [i18n, i18n.language, routeLanguage]);

  // Keep the document language tied to the canonical URL.
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = activeLanguage;
  }, [activeLanguage, dir]);

  useEffect(() => {
    if (!location.hash) return;

    const timeoutId = window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const focusId = window.setTimeout(() => {
      document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(focusId);
  }, [location.pathname, location.hash]);
  
  return (
    <div className={`min-h-screen font-sans ${dir === 'rtl' ? '[&_*]:font-sans-hebrew' : ''}`}>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <ContactNode />
      <Routes>
        <Route path="/:language" element={<LocalizedRoute><PortfolioHome /></LocalizedRoute>} />
        <Route path="/:language/projects/:projectId" element={<LocalizedRoute><ProjectCaseStudy /></LocalizedRoute>} />
        <Route path="/:language/blog" element={<LocalizedRoute><BlogIndex /></LocalizedRoute>} />
        <Route path="/:language/blog/:slug" element={<LocalizedRoute><BlogPost /></LocalizedRoute>} />
        <Route path="/:language/contact" element={<LocalizedRoute><ContactPage /></LocalizedRoute>} />
        <Route path="/:language/privacy" element={<LocalizedRoute><PrivacyPage /></LocalizedRoute>} />
        <Route
          path="/:language/lab"
          element={(
            <LocalizedRoute>
              <Suspense fallback={<SectionFallback id="lab" minHeightClassName="min-h-screen" />}>
                <LabPage />
              </Suspense>
            </LocalizedRoute>
          )}
        />
        <Route path="/" element={<LegacyRedirect />} />
        <Route path="/projects/:projectId" element={<LegacyRedirect />} />
        <Route path="/blog" element={<LegacyRedirect />} />
        <Route path="/blog/:slug" element={<LegacyRedirect />} />
        <Route path="/contact" element={<LegacyRedirect />} />
        <Route path="/privacy" element={<LegacyRedirect />} />
        <Route path="/lab" element={<LegacyRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
