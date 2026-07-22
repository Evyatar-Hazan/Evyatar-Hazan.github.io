import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight, CheckCircle2, Linkedin, Mail, MessageCircle, Send, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { profileLinks } from '../../data/profile';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isHebrew = i18n.language === 'he';
  const ArrowIcon = isHebrew ? ArrowUpLeft : ArrowUpRight;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 86%', 'end 18%'] });
  const targetScale = useTransform(scrollYProgress, [0, 0.58, 1], [0.72, 1, 1.08]);
  const targetRotate = useTransform(scrollYProgress, [0, 1], [-22, 18]);
  const targetOpacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 0.62, 0.62, 0.18]);
  const channelX = useTransform(scrollYProgress, [0, 0.42, 1], [isHebrew ? 90 : -90, 0, 0]);
  const formX = useTransform(scrollYProgress, [0, 0.42, 1], [isHebrew ? -90 : 90, 0, 0]);
  const bridgeScale = useTransform(scrollYProgress, [0.08, 0.62], [0, 1]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setFormStatus('idle');
    try {
      const response = await fetch('https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="contact-handoff">
      <div className="contact-handoff-grid" aria-hidden="true" />
      <motion.div
        className="contact-handoff-target"
        aria-hidden="true"
        style={{
          scale: reduceMotion ? 1 : targetScale,
          rotate: reduceMotion ? 0 : targetRotate,
          opacity: reduceMotion ? 0.26 : targetOpacity,
        }}
      >
        <i />
        <i />
        <i />
      </motion.div>

      <div className="contact-handoff-shell">
        <header className="contact-handoff-header">
          <p className="contact-handoff-kicker"><span />{t('contact.eyebrow')}</p>
          <div>
            <h2>{t('contact.title1')} <em>{t('contact.title2')}</em></h2>
            <p>{t('contact.subtitle')}</p>
          </div>
        </header>

        <div className="contact-handoff-stage">
          <motion.i className="contact-handoff-bridge" aria-hidden="true" style={{ scaleX: reduceMotion ? 1 : bridgeScale }} />

          <motion.aside
            className="contact-channel-panel"
            style={{ x: reduceMotion ? 0 : channelX }}
            aria-labelledby="contact-channel-title"
          >
            <div className="contact-status">
              <span aria-hidden="true" />
              <div><strong>{t('contact.status')}</strong><p>{t('contact.statusDesc')}</p></div>
            </div>

            <div className="contact-channel-copy">
              <span>DIRECT CHANNEL / 01</span>
              <h3 id="contact-channel-title">{t('contact.getInTouch')}</h3>
              <p>{t('contact.getInTouchDesc')}</p>
            </div>

            <a
              href={`${profileLinks.whatsapp}?text=${encodeURIComponent(t('contact.whatsappText'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-primary-channel"
            >
              <MessageCircle aria-hidden="true" className="h-6 w-6" />
              <span><small>{t('contact.whatsappLbl')}</small><strong>{t('contact.whatsappDesc')}</strong></span>
              <ArrowIcon aria-hidden="true" className="h-5 w-5" />
            </a>

            <div className="contact-channel-list">
              <a href="mailto:evyatarhazan3.14@gmail.com">
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span><small>{t('contact.emailLbl')}</small><strong>evyatarhazan3.14@gmail.com</strong></span>
                <ArrowIcon aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                <span><small>{t('contact.linkedinLbl')}</small><strong>Evyatar Hazan</strong></span>
                <ArrowIcon aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </motion.aside>

          <motion.div className="contact-brief-panel" style={{ x: reduceMotion ? 0 : formX }}>
            <div className="contact-brief-heading">
              <div><span>PROJECT BRIEF / 02</span><h3>{t('contact.formTitle')}</h3></div>
              <b aria-hidden="true">02</b>
            </div>

            <form onSubmit={handleSubmit} className="contact-brief-form">
              <div className="contact-field" data-field-index="01">
                <label htmlFor="name">{t('contact.form.nameLbl')}</label>
                <input type="text" id="name" name="name" required placeholder={t('contact.form.namePh')} />
              </div>
              <div className="contact-field" data-field-index="02">
                <label htmlFor="email">{t('contact.form.emailLbl')}</label>
                <input type="email" id="email" name="email" required placeholder={t('contact.form.emailPh')} />
              </div>
              <div className="contact-field contact-field-message" data-field-index="03">
                <label htmlFor="message">{t('contact.form.msgLbl')}</label>
                <textarea id="message" name="message" required rows={3} placeholder={t('contact.form.msgPh')} />
              </div>

              <button type="submit" className="contact-submit" disabled={isSubmitting}>
                <span>{isSubmitting ? t('contact.form.sending') : t('contact.form.sendBtn')}</span>
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>

              <div className="contact-form-meta">
                <p>{t('contact.form.privacyNotice')} <Link to="/privacy">{t('contact.form.privacyLink')}</Link></p>
                <div aria-live="polite" className="contact-form-status">
                  {formStatus === 'success' && <p data-status="success"><CheckCircle2 aria-hidden="true" className="h-4 w-4" />{t('contact.form.successMsg')}</p>}
                  {formStatus === 'error' && <p data-status="error"><XCircle aria-hidden="true" className="h-4 w-4" />{t('contact.form.errorMsg')}</p>}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
