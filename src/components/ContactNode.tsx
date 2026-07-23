import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { profileLinks } from '../data/profile';

const ContactNode = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [visiblePath, setVisiblePath] = useState<string | null>(null);

  const isEligibleRoute =
    location.pathname === '/' ||
    location.pathname === '/blog' ||
    location.pathname.startsWith('/blog/') ||
    location.pathname.startsWith('/projects/');

  useEffect(() => {
    if (!isEligibleRoute) return;

    let frameId: number | null = null;

    const updateVisibility = () => {
      frameId = null;

      const viewportHeight = window.innerHeight;
      const homeSection = location.pathname === '/' ? document.querySelector('#home') : null;
      const homeRect = homeSection?.getBoundingClientRect();
      const hasMeasuredHome = Boolean(homeRect && homeRect.height > 0);
      const hasEnteredContent = hasMeasuredHome
        ? homeRect!.bottom <= viewportHeight * 0.72
        : window.scrollY > Math.min(360, viewportHeight * 0.45);

      const isBlocked = Array.from(
        document.querySelectorAll<HTMLElement>('#contact, .closing-dock')
      ).some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < viewportHeight - 24 && rect.bottom > 24;
      });

      const nextVisibility = hasEnteredContent && !isBlocked;
      setVisiblePath(nextVisibility ? location.pathname : null);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateVisibility);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [isEligibleRoute, location.pathname]);

  const shouldShow = isEligibleRoute && visiblePath === location.pathname;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.aside
          className="contact-node-layer"
          aria-label={t('contactNode.regionLabel')}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="contact-node">
            <span className="contact-node-tooltip" aria-hidden="true">
              <small translate="no">DIRECT CHANNEL / WA</small>
              <strong>{t('contactNode.label')}</strong>
            </span>

            <a
              href={`${profileLinks.whatsapp}?text=${encodeURIComponent(t('contact.whatsappText'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-node-link"
              aria-label={t('contactNode.ariaLabel')}
            >
              <span className="contact-node-status" aria-hidden="true" />
              <MessageCircle aria-hidden="true" />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ContactNode;
