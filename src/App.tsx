import { useTranslation } from 'react-i18next';
import { lazy, Suspense, useEffect } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import CustomCursor from './components/animations/CustomCursor';
import ScrollProgress from './components/animations/ScrollProgress';

const About = lazy(() => import('./components/sections/About'));
const Projects = lazy(() => import('./components/sections/Projects'));
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

function App() {
  const { i18n } = useTranslation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  
  // Use custom theme hook to initialize global dark class mapping correctly
  useTheme();
  
  // Update HTML dir attribute immediately when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [dir, i18n.language]); 
  
  return (
    <div className={`min-h-screen font-sans ${dir === 'rtl' ? '[&_*]:font-sans-hebrew' : ''}`}>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Home />
        <Suspense fallback={<SectionFallback id="about" minHeightClassName="min-h-[70vh]" />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback id="projects" minHeightClassName="min-h-screen" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback id="contact" minHeightClassName="min-h-[80vh]" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
