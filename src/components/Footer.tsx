import { ArrowUpLeft, ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { profileLinks } from '../data/profile';
import BrandMark from './BrandMark';
import {
  activeNavigationId,
  navigationHref,
  primaryNavigation,
  secondaryNavigation,
} from '../navigation/portfolioNavigation';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';
  const ArrowIcon = isHebrew ? ArrowUpLeft : ArrowUpRight;
  const activeId = activeNavigationId(location.pathname, location.hash);
  
  const socialLinks = [
    { name: 'Github', icon: Github, href: profileLinks.github },
    { name: 'LinkedIn', icon: Linkedin, href: profileLinks.linkedin },
    { name: 'WhatsApp', icon: MessageCircle, href: profileLinks.whatsapp },
    { name: 'Email', icon: Mail, href: profileLinks.email },
  ];

  return (
    <footer className="closing-dock">
      <div className="closing-dock-grid" aria-hidden="true" />
      <div className="closing-dock-shell">
        <div className="closing-dock-lead">
          <div className="closing-dock-signature">
            <BrandMark className="closing-dock-brand-mark" />
          </div>
          <div>
            <p className="closing-dock-kicker"><span />{t('footer.status')}</p>
            <h2>{t('footer.title')}</h2>
          </div>
          <a
            href={`${profileLinks.whatsapp}?text=${encodeURIComponent(t('contact.whatsappText'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="closing-dock-cta"
          >
            <span>{t('footer.cta')}</span>
            <ArrowIcon aria-hidden="true" />
          </a>
        </div>

        <div className="closing-dock-map">
          <div className="closing-dock-links">
            <span>{t('footer.siteMap')}</span>
            <nav className="closing-dock-navigation" aria-label={t('footer.navigation')}>
              <div className="closing-dock-primary-links">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.id}
                    to={navigationHref(item, language)}
                    data-navigation-id={item.id}
                    aria-current={activeId === item.id ? 'page' : undefined}
                    className={activeId === item.id ? 'is-active' : undefined}
                  >
                    {t(item.translationKey)}
                  </Link>
                ))}
              </div>
              <div className="closing-dock-secondary-links">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.id}
                    to={navigationHref(item, language)}
                    data-navigation-id={item.id}
                    aria-current={activeId === item.id ? 'page' : undefined}
                    className={activeId === item.id ? 'is-active' : undefined}
                  >
                    {t(item.translationKey)}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="closing-dock-socials">
            <span>DIRECT CHANNELS / 02</span>
            <div>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={link.name}
                >
                  <link.icon aria-hidden="true" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="closing-dock-system">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <div><span>PORTFOLIO SYSTEM</span><i /> <span>VERSION {appVersion}</span></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
