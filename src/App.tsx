import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import ContactNode from './components/ContactNode';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PortfolioScrollRestoration from './components/PortfolioScrollRestoration';
import ScrollProgress from './components/animations/ScrollProgress';
import ContactBriefFeature from './features/contact/ContactBriefFeature';
import AudienceEntryPaths from './components/sections/AudienceEntryPaths';
import { useTheme } from './hooks/useTheme';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import ContactPage from './pages/ContactPage';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import ProjectCaseStudy from './pages/ProjectCaseStudy';
import {
  defaultPortfolioLanguage,
  getLanguageFromPath,
  isPortfolioLanguage,
  localizedPath,
  localizePath,
} from './routing/portfolioRoutes';

const Projects = lazy(() => import('./components/sections/Projects'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProfessionalOverview = lazy(() => import('./components/sections/ProfessionalOverview'));
const BlogPreview = lazy(() => import('./components/sections/BlogPreview'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LabPage = lazy(() => import('./pages/LabPage'));

type SectionFallbackProps = {
  id: string;
  minHeightClassName: string;
};

const SectionFallback = ({ id, minHeightClassName }: SectionFallbackProps) => (
  <section
    id={id}
    aria-busy="true"
    data-home-section-fallback={id}
    className={`home-section-fallback ${minHeightClassName}`}
  >
    <div aria-hidden="true" className="home-section-fallback__rail">
      <span />
      <span />
    </div>
  </section>
);

const PageFallback = ({ id, minHeightClassName }: SectionFallbackProps) => (
  <main id="main-content" tabIndex={-1}>
    <SectionFallback id={id} minHeightClassName={minHeightClassName} />
  </main>
);

const PortfolioHome = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  return (
    <main id="main-content" tabIndex={-1} className="home-page">
      <Home />
      <div className="home-audience-entry">
        <div className="home-section__inner">
          <AudienceEntryPaths language={language} buildPath={localizedPath} />
        </div>
      </div>
      <Suspense fallback={<SectionFallback id="projects" minHeightClassName="min-h-screen" />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback id="about" minHeightClassName="min-h-[70vh]" />}>
        <ProfessionalOverview language={language} buildPath={localizedPath} />
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
  const isPortfolioHome = /^\/(?:en|he)\/?$/.test(location.pathname);

  useTheme();

  useEffect(() => {
    if (routeLanguage && i18n.language !== routeLanguage) {
      void i18n.changeLanguage(routeLanguage);
    }
  }, [i18n, i18n.language, routeLanguage]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = activeLanguage;
  }, [activeLanguage, dir]);

  return (
    <div
      className={`min-h-screen font-sans ${dir === 'rtl' ? '[&_*]:font-sans-hebrew' : ''}`}
      data-motion-focus={isPortfolioHome ? 'single' : 'scroll-progress'}
    >
      <PortfolioScrollRestoration />
      {!isPortfolioHome && <ScrollProgress />}
      <Navbar />
      <div id="site-shell-content">
        <ContactNode />
        <Routes>
          <Route path="/:language" element={<LocalizedRoute><PortfolioHome /></LocalizedRoute>} />
          <Route path="/:language/projects" element={(
            <LocalizedRoute>
              <Suspense fallback={<PageFallback id="projects-hub" minHeightClassName="min-h-screen" />}>
                <ProjectsPage />
              </Suspense>
            </LocalizedRoute>
          )} />
          <Route path="/:language/projects/:projectId" element={<LocalizedRoute><ProjectCaseStudy /></LocalizedRoute>} />
          <Route path="/:language/blog" element={<LocalizedRoute><BlogIndex /></LocalizedRoute>} />
          <Route path="/:language/blog/:slug" element={<LocalizedRoute><BlogPost /></LocalizedRoute>} />
          <Route path="/:language/contact" element={<LocalizedRoute><ContactPage /></LocalizedRoute>} />
          <Route path="/:language/about" element={(
            <LocalizedRoute>
              <Suspense fallback={<PageFallback id="about-page" minHeightClassName="min-h-screen" />}>
                <AboutPage />
              </Suspense>
            </LocalizedRoute>
          )} />
          <Route path="/:language/privacy" element={<LocalizedRoute><PrivacyPage /></LocalizedRoute>} />
          <Route path="/:language/lab" element={(
            <LocalizedRoute>
              <Suspense fallback={<PageFallback id="lab" minHeightClassName="min-h-screen" />}>
                <LabPage />
              </Suspense>
            </LocalizedRoute>
          )} />
          <Route path="/" element={<LegacyRedirect />} />
          <Route path="/projects" element={<LegacyRedirect />} />
          <Route path="/projects/:projectId" element={<LegacyRedirect />} />
          <Route path="/blog" element={<LegacyRedirect />} />
          <Route path="/blog/:slug" element={<LegacyRedirect />} />
          <Route path="/contact" element={<LegacyRedirect />} />
          <Route path="/about" element={<LegacyRedirect />} />
          <Route path="/privacy" element={<LegacyRedirect />} />
          <Route path="/lab" element={<LegacyRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
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
