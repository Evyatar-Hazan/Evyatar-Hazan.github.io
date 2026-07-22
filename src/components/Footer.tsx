import { ArrowUpLeft, ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { profileLinks } from '../data/profile';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const isHebrew = i18n.language === 'he';
  const ArrowIcon = isHebrew ? ArrowUpLeft : ArrowUpRight;
  
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
          <div className="closing-dock-signature" translate="no">
            <span>EH</span><i>.</i>
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
            <span>SITE MAP / 01</span>
            <Link to="/">{t('nav.Home')}</Link>
            <Link to="/blog">{t('nav.Blog')}</Link>
            <Link to="/contact">{t('nav.Contact')}</Link>
            <Link to="/privacy">{t('footer.privacy')}</Link>
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
