import { useTranslation } from 'react-i18next';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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

const About = lazy(() => import('./components/sections/About'));
const Projects = lazy(() => import('./components/sections/Projects'));
const BlogPreview = lazy(() => import('./components/sections/BlogPreview'));
const Contact = lazy(() => import('./components/sections/Contact'));

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

const PortfolioHome = () => (
  <main>
    <Home />
    <Suspense fallback={<SectionFallback id="about" minHeightClassName="min-h-[70vh]" />}>
      <About />
    </Suspense>
    <Suspense fallback={<SectionFallback id="projects" minHeightClassName="min-h-screen" />}>
      <Projects />
    </Suspense>
    <Suspense fallback={<SectionFallback id="writing" minHeightClassName="min-h-[60vh]" />}>
      <BlogPreview />
    </Suspense>
    <Suspense fallback={<SectionFallback id="contact" minHeightClassName="min-h-[80vh]" />}>
      <Contact />
    </Suspense>
  </main>
);

const AppShell = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  
  // Use custom theme hook to initialize global dark class mapping correctly
  useTheme();
  
  // Update HTML dir attribute immediately when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [dir, i18n.language]); 

  useEffect(() => {
    if (!location.hash) return;

    const timeoutId = window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash, location.pathname]);
  
  return (
    <div className={`min-h-screen font-sans ${dir === 'rtl' ? '[&_*]:font-sans-hebrew' : ''}`}>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/projects/:projectId" element={<ProjectCaseStudy />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
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
