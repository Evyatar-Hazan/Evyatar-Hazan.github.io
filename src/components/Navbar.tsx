import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  activeNavigationId,
  getPortfolioRouteContext,
  navigationHref,
  primaryNavigation,
  secondaryNavigation,
} from '../navigation/portfolioNavigation';
import { switchPathLanguage } from '../routing/portfolioRoutes';
import BrandMark from './BrandMark';
import { formatLocaleIndex } from '../features/locale-presentation/formatLocale';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const Navbar = () => {
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const language = i18n.language === 'he' ? 'he' : 'en';
  const menuContextKey = `${language}:${location.pathname}${location.search}${location.hash}`;
  const isOpen = menuOpenedAt === menuContextKey;
  const activeId = activeNavigationId(location.pathname, location.hash);
  const routeContext = useMemo(
    () => getPortfolioRouteContext(location.pathname, language, t),
    [language, location.pathname, t],
  );

  const closeMenu = useCallback(() => setMenuOpenedAt(null), []);

  useLayoutEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const bodyStyle = document.body.getAttribute('style');
    const content = document.querySelector<HTMLElement>('#site-shell-content');
    const hadInert = content?.hasAttribute('inert') ?? false;
    const previousAriaHidden = content?.getAttribute('aria-hidden');
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${bodyPaddingRight + scrollbarGap}px`;
    }
    document.body.style.overflow = 'hidden';
    if (content) {
      content.inert = true;
      content.setAttribute('inert', '');
      content.setAttribute('aria-hidden', 'true');
    }

    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute('disabled'));
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      if (bodyStyle === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', bodyStyle);
      if (content) {
        content.inert = hadInert;
        if (hadInert) content.setAttribute('inert', '');
        else content.removeAttribute('inert');
        if (previousAriaHidden == null) content.removeAttribute('aria-hidden');
        else content.setAttribute('aria-hidden', previousAriaHidden);
      }
    };
  }, [closeMenu, isOpen]);

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'he' : 'en';
    closeMenu();
    localStorage.setItem('i18nextLng', newLanguage);
    navigate(switchPathLanguage(location.pathname, newLanguage, location.search, location.hash));
    await i18n.changeLanguage(newLanguage);
  };

  const focusMainContent = () => {
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true });
    });
  };

  const themeLabel = theme === 'dark' ? t('shell.theme.useLight') : t('shell.theme.useDark');

  const renderLinks = (mobile = false) => primaryNavigation.map((item, index) => (
    <a
      key={item.id}
      href={navigationHref(item, language)}
      onClick={mobile ? closeMenu : undefined}
      aria-current={activeId === item.id ? 'page' : undefined}
      aria-label={t(item.translationKey)}
      className={mobile
        ? `system-rail-mobile-link ${item.id === 'contact' ? 'is-contact' : ''} ${activeId === item.id ? 'is-active' : ''}`
        : `system-rail-link ${activeId === item.id ? 'is-active' : ''}`}
    >
      {mobile && (
        <span className="system-rail-mobile-index" aria-hidden="true">
          {formatLocaleIndex(index + 1, language)}
        </span>
      )}
      {mobile
        ? <span className="system-rail-mobile-label">{t(item.translationKey)}</span>
        : t(item.translationKey)}
      {mobile && (
        <span className="system-rail-mobile-marker" aria-hidden="true">
          {activeId === item.id
            ? t('shell.menu.current')
            : <ArrowRight className="system-rail-mobile-arrow" />}
        </span>
      )}
    </a>
  ));

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        {t('shell.skipToContent')}
      </a>
      <header className="system-rail-header">
        <nav className="system-rail-nav" aria-label={t('shell.primaryNavigation')}>
          <div className="system-rail">
            <a
              href={navigationHref(primaryNavigation[0], language)}
              className="system-rail-brand"
              aria-label={t('shell.homeLabel')}
              translate="no"
            >
              <BrandMark className="system-rail-brand-mark" />
            </a>

            {routeContext && (
              <div className="system-rail-context" aria-label={t('shell.routeContext')}>
                <span>{routeContext.category}</span>
                <i aria-hidden="true" />
                <strong title={routeContext.detail}>{routeContext.detail}</strong>
              </div>
            )}

            <div className="system-rail-desktop">
              <div className="system-rail-links">{renderLinks()}</div>
              <div className="system-rail-divider" aria-hidden="true" />
              <button
                type="button"
                onClick={toggleTheme}
                className="system-rail-icon"
                aria-label={themeLabel}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4" aria-hidden="true" />
                  : <Moon className="w-4 h-4" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={toggleLanguage}
                className="system-rail-language"
                aria-label={t('shell.languageSwitch', { language: language === 'en' ? 'עברית' : 'English' })}
              >
                {language === 'en' ? 'עב' : 'EN'}
              </button>
            </div>

            <div className="system-rail-mobile-actions">
              <button
                type="button"
                onClick={toggleTheme}
                className="system-rail-icon"
                aria-label={themeLabel}
                aria-pressed={theme === 'dark'}
                disabled={isOpen}
              >
                {theme === 'dark'
                  ? <Sun className="w-5 h-5" aria-hidden="true" />
                  : <Moon className="w-5 h-5" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={toggleLanguage}
                className="system-rail-language system-rail-mobile-language"
                aria-label={t('shell.languageSwitch', { language: language === 'en' ? 'עברית' : 'English' })}
                disabled={isOpen}
              >
                {language === 'en' ? 'עב' : 'EN'}
              </button>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpenedAt((current) => current === menuContextKey ? null : menuContextKey)}
                className="system-rail-menu-toggle"
                aria-label={isOpen ? t('shell.menu.close') : t('shell.menu.open')}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-menu"
              >
                {isOpen
                  ? <X className="w-6 h-6" aria-hidden="true" />
                  : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.button
                  type="button"
                  data-testid="mobile-menu-backdrop"
                  aria-label={t('shell.menu.closeBackdrop')}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  onClick={closeMenu}
                  className="system-rail-backdrop"
                />
                <motion.div
                  ref={menuRef}
                  id="mobile-navigation-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t('shell.menu.label')}
                  initial={reduceMotion ? false : { x: language === 'he' ? '-100%' : '100%' }}
                  animate={{ x: 0 }}
                  exit={reduceMotion ? undefined : { x: language === 'he' ? '-100%' : '100%' }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="system-rail-mobile-menu"
                >
                  <div className="system-rail-mobile-masthead">
                    <div className="system-rail-mobile-identity">
                      <BrandMark className="system-rail-mobile-brand-mark" />
                      <div>
                        <span>{t('shell.menu.contextLabel')}</span>
                        <strong>{t('shell.menu.label')}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeMenu}
                      className="system-rail-mobile-close"
                      aria-label={t('shell.menu.close')}
                    >
                      <X aria-hidden="true" />
                      <span>{t('shell.menu.closeLabel')}</span>
                    </button>
                  </div>
                  <div className="system-rail-mobile-scroll">
                    {routeContext && (
                      <p className="system-rail-mobile-context">
                        <span>{routeContext.category}</span>
                        <strong>{routeContext.detail}</strong>
                      </p>
                    )}
                    <div className="system-rail-mobile-links">{renderLinks(true)}</div>
                  </div>
                  <div className="system-rail-mobile-footer">
                    <div className="system-rail-mobile-secondary">
                      {secondaryNavigation.map((item) => (
                        <a key={item.id} href={navigationHref(item, language)} onClick={closeMenu}>
                          {t(item.translationKey)}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
