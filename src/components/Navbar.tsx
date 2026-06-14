import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    e.preventDefault();
    setActive(name);
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    localStorage.setItem('i18nextLng', newLang);
    await i18n.changeLanguage(newLang);
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden && !isOpen ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 flex justify-center py-4 px-6 pointer-events-none"
    >
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-2xl shadow-2xl pointer-events-auto transition-colors duration-500">
        <a 
          href="#home" 
          onClick={(e) => handleClick(e, '#home', 'Home')}
          className="text-neutral-900 dark:text-white font-bold tracking-tight text-xl transition-colors"
          aria-label="Go to home section"
        >
          EH<span className="text-primary-500">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleClick(e, item.href, item.name)}
              aria-current={active === item.name ? 'page' : undefined}
              className={`text-sm font-medium transition-colors ${
                active === item.name ? 'text-primary-500 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t(`nav.${item.name}`)}
            </a>
          ))}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-2 transition-colors"></div>
          
          <button 
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Toggle theme"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            aria-label="Toggle language"
          >
            {i18n.language === 'en' ? 'עב' : 'EN'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-4">
          <button 
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 transition-colors"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-neutral-900 dark:text-white transition-colors"
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
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[-1] sm:hidden pointer-events-auto"
            />
            
            <motion.div
              id="mobile-navigation-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[88px] mx-6 h-fit bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl pointer-events-auto sm:hidden overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6 w-full">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href, item.name)}
                    aria-current={active === item.name ? 'page' : undefined}
                    className={`text-2xl font-bold transition-colors ${
                      active === item.name ? 'text-primary-500' : 'text-neutral-600 dark:text-neutral-400'
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
    </motion.nav>
  );
};

export default Navbar;
