import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { profileLinks } from '../data/profile';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const isHebrew = i18n.language === 'he';
  
  const socialLinks = [
    { name: 'Github', icon: Github, href: profileLinks.github },
    { name: 'LinkedIn', icon: Linkedin, href: profileLinks.linkedin },
    { name: 'WhatsApp', icon: MessageCircle, href: profileLinks.whatsapp },
    { name: 'Email', icon: Mail, href: profileLinks.email },
  ];

  return (
    <footer className="w-full py-12 px-6 border-t border-neutral-200 dark:border-neutral-900 bg-neutral-100 dark:bg-black mt-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="text-neutral-500 dark:text-neutral-400 text-sm transition-colors duration-500">
            {t('footer.copyright', { year: currentYear })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 md:justify-start">
            <Link to="/privacy" className="transition hover:text-neutral-900 dark:hover:text-white">{isHebrew ? 'פרטיות' : 'Privacy'}</Link>
            <Link to="/contact" className="transition hover:text-neutral-900 dark:hover:text-white">{isHebrew ? 'יצירת קשר' : 'Contact'}</Link>
            <Link to="/blog" className="transition hover:text-neutral-900 dark:hover:text-white">{isHebrew ? 'כתיבה' : 'Writing'}</Link>
          </div>
          <div className="mt-2 inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-3 py-1 text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-300 transition-colors duration-500">
            Version {appVersion}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="p-3 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center group"
              aria-label={link.name}
            >
              <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
