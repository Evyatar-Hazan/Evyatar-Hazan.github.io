import { useEffect, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import { localizedStoryPath } from '../navigation.js';

export function SiteHeader({
  activeSection,
  language,
  copy,
  onLanguageChange,
  onStoryNavigate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const mainContent = document.getElementById('main-content');
    const mainWasInert = mainContent?.inert ?? false;
    const focusFrame = window.requestAnimationFrame(() => {
      navigationRef.current?.querySelector('a')?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        headerRef.current?.querySelectorAll('a[href], button:not([disabled])') || [],
      ).filter((element) => (
        element.tabIndex !== -1
        && window.getComputedStyle(element).visibility !== 'hidden'
      ));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.inert = true;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (mainContent) mainContent.inert = mainWasInert;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 961px)');
    const closeAtDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener?.('change', closeAtDesktop);
    return () => desktopQuery.removeEventListener?.('change', closeAtDesktop);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.hash, location.pathname, location.search]);

  const closeMenu = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.inert = false;
    setMenuOpen(false);
  };
  const handleStoryLink = (event, hash) => {
    closeMenu();
    onStoryNavigate(event, hash);
  };

  const activeNav = (() => {
    if (location.pathname.startsWith('/projects/')) return 'work';
    if (location.pathname.startsWith('/blog')) return 'lab';
    if (location.pathname !== '/') return '';
    if (['work', 'online_converter', 'emergency_protocol', 'more_work'].includes(activeSection)) return 'work';
    if (['about', 'capabilities'].includes(activeSection)) return 'capabilities';
    if (activeSection === 'lab') return 'lab';
    if (activeSection === 'contact') return 'contact';
    return location.hash.slice(1);
  })();

  return (
    <header
      ref={headerRef}
      className="site-header"
      role={menuOpen ? 'dialog' : undefined}
      aria-modal={menuOpen ? 'true' : undefined}
      aria-labelledby={menuOpen ? 'mobile-navigation-heading' : undefined}
    >
      <a
        className="brand"
        href={localizedStoryPath('#top', language, location.search)}
        aria-label={`${copy.name} — ${copy.home}`}
        onClick={(event) => handleStoryLink(event, '#top')}
      >
        <img src="/assets/evyatar-mark.png" alt="" />
        <span>{copy.name}</span>
        <span className="brand-divider" aria-hidden="true">/</span>
        <span className="brand-secondary">{language === 'en' ? 'אביתר חזן' : 'Evyatar Hazan'}</span>
      </a>

      <nav
        ref={navigationRef}
        id="mobile-navigation"
        className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}
        aria-label={copy.primaryNavigation}
      >
        <h2 className="visually-hidden" id="mobile-navigation-heading">{copy.menuHeading}</h2>
        <a
          href={localizedStoryPath('#work', language, location.search)}
          aria-current={activeNav === 'work' ? 'location' : undefined}
          onClick={(event) => handleStoryLink(event, '#work')}
        >
          {copy.nav[0]}
        </a>
        <a
          href={localizedStoryPath('#capabilities', language, location.search)}
          aria-current={activeNav === 'capabilities' ? 'location' : undefined}
          onClick={(event) => handleStoryLink(event, '#capabilities')}
        >
          {copy.nav[1]}
        </a>
        <a
          href={localizedStoryPath('#lab', language, location.search)}
          aria-current={activeNav === 'lab' ? 'location' : undefined}
          onClick={(event) => handleStoryLink(event, '#lab')}
        >
          {copy.nav[2]}
        </a>
        <a
          href={localizedStoryPath('#contact', language, location.search)}
          aria-current={activeNav === 'contact' ? 'location' : undefined}
          onClick={(event) => handleStoryLink(event, '#contact')}
        >
          {copy.nav[3]}
        </a>
      </nav>

      <div className="header-actions">
        <button
          className="language-switch"
          type="button"
          onClick={onLanguageChange}
          aria-describedby="language-switch-description"
        >
          <span className={language === 'en' ? 'is-active' : ''}>EN</span>
          <span aria-hidden="true">/</span>
          <span className={language === 'he' ? 'is-active' : ''}>עב</span>
        </button>
        <span className="visually-hidden" id="language-switch-description">
          {copy.languageSwitch}
        </span>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? copy.close : copy.menu}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={25} weight="light" /> : <List size={27} weight="light" />}
        </button>
      </div>
    </header>
  );
}
