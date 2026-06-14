import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import Button from '../Button';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (response.ok) {
        alert(t('contact.form.successMsg'));
        form.reset();
      } else {
        alert(t('contact.form.errorMsg'));
      }
    } catch {
      alert(t('contact.form.errorMsg'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-6 min-h-[80vh] flex items-center justify-center relative bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200/50 dark:border-neutral-900/50 transition-colors duration-500">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white transition-colors duration-500">
            {t('contact.title1')} <span className="text-primary-500">{t('contact.title2')}</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto transition-colors duration-500">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 bg-white/70 dark:bg-neutral-900/40 p-5 sm:p-8 md:p-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 backdrop-blur-xl shadow-2xl dark:shadow-none transition-colors duration-500">
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 transition-colors duration-500">{t('contact.getInTouch')}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 transition-colors duration-500">{t('contact.getInTouchDesc')}</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-neutral-700 dark:text-neutral-300 transition-colors duration-500">
                <div className="p-3 sm:p-4 bg-primary-50 dark:bg-neutral-800/50 rounded-full text-primary-600 dark:text-primary-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium transition-colors duration-500">{t('contact.emailLbl')}</p>
                  <a href="mailto:evyatarhazan3.14@gmail.com" className="text-base sm:text-lg hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                    evyatarhazan3.14@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 transition-colors duration-500">{t('contact.form.nameLbl')}</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                placeholder={t('contact.form.namePh')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 transition-colors duration-500">{t('contact.form.emailLbl')}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                placeholder={t('contact.form.emailPh')}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 transition-colors duration-500">{t('contact.form.msgLbl')}</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-none"
                placeholder={t('contact.form.msgPh')}
              />
            </div>
            <Button type="submit" className="w-full group" disabled={isSubmitting}>
              {isSubmitting ? '...' : t('contact.form.sendBtn')}
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
