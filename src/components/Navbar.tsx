import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import BrandMark from './BrandMark';
import {
  localizedPath,
  stripLanguagePrefix,
  switchPathLanguage,
} from '../routing/portfolioRoutes';

const navItems = [
  { name: 'Home', href: '#home', route: 'home' },
  { name: 'Projects', href: '/projects', route: 'projects' },
  { name: 'About', href: '#about', route: 'home' },
  { name: 'Blog', href: '/blog', route: 'blog' },
  { name: 'Contact', href: '#contact', route: 'home' },
] as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const language = i18n.language === 'he' ? 'he' : 'en';
  const contentPath = stripLanguagePrefix(location.pathname);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const activeItem = contentPath.startsWith('/projects')
    ? 'Projects'
    : contentPath.startsWith('/blog')
    ? 'Blog'
    : navItems.find((item) => item.href === location.hash)?.name ?? 'Home';
  const blogContext = contentPath === '/blog' || contentPath === '/blog/'
    ? (i18n.language === 'he' ? 'ארכיון' : 'Archive')
    : contentPath.startsWith('/blog/')
      ? (i18n.language === 'he' ? 'רשומה' : 'Entry')
      : null;

  const localizedHref = (item: (typeof navItems)[number]) => item.href.startsWith('/')
    ? localizedPath(language, { route: item.route })
    : `${localizedPath(language, { route: 'home' })}${item.href}`;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof navItems)[number]) => {
    e.preventDefault();
    setIsOpen(false);

    if (item.href.startsWith('/')) {
      navigate(localizedPath(language, { route: item.route }));
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (contentPath !== '/') {
      navigate({ pathname: localizedPath(language, { route: 'home' }), hash: item.href });
      window.setTimeout(() => scrollToSection(item.href), 50);
      return;
    }

    navigate({ hash: item.href });
    scrollToSection(item.href);
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    localStorage.setItem('i18nextLng', newLang);
    navigate(switchPathLanguage(location.pathname, newLang, location.search, location.hash));
    await i18n.changeLanguage(newLang);
  };

  return (
    <nav className="system-rail-nav">
      <div className="system-rail">
        <a 
          href={`${localizedPath(language, { route: 'home' })}#home`}
          onClick={(e) => handleClick(e, navItems[0])}
          className="system-rail-brand"
          aria-label="Go to home section"
          translate="no"
        >
          <BrandMark className="system-rail-brand-mark" />
        </a>

        {/* Desktop Nav */}
        <div className="system-rail-desktop">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={localizedHref(item)}
              onClick={(e) => handleClick(e, item)}
              aria-current={activeItem === item.name ? 'page' : undefined}
              className={`system-rail-link ${activeItem === item.name ? 'is-active' : ''}`}
            >
              {t(`nav.${item.name}`)}
            </a>
          ))}
          {blogContext && <span className="system-rail-context">WRITING / {blogContext}</span>}
          <div className="system-rail-divider" />
          
          <button 
            type="button"
            onClick={toggleTheme}
            className="system-rail-icon"
            title="Toggle theme"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            type="button"
            onClick={toggleLanguage}
            className="system-rail-language"
            aria-label="Toggle language"
          >
            {i18n.language === 'en' ? 'עב' : 'EN'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="system-rail-mobile-actions">
          <button 
            type="button"
            onClick={toggleTheme}
            className="system-rail-icon"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="system-rail-menu-toggle"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              data-testid="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="system-rail-backdrop"
            />
            
            <motion.div
              id="mobile-navigation-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="system-rail-mobile-menu"
            >
              <div className="flex flex-col items-center gap-6 w-full">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={localizedHref(item)}
                    onClick={(e) => handleClick(e, item)}
                    aria-current={activeItem === item.name ? 'page' : undefined}
                    className={`text-2xl font-bold transition-colors ${
                      activeItem === item.name ? 'text-primary-500' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {t(`nav.${item.name}`)}
                  </a>
                ))}
              </div>
              
              <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
              
              <button 
                type="button"
                onClick={toggleLanguage}
                className="w-full py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
                aria-label="Toggle language"
              >
                <span>{i18n.language === 'en' ? 'עברית (HE)' : 'English (EN)'}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
