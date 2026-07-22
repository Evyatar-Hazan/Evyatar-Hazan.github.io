import { motion } from 'framer-motion';
import { ArrowRight, Code2, Github, Linkedin, Mail, MessageCircle, ShieldCheck, Workflow } from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import Magnetic from '../components/animations/Magnetic';
import { profileLinks } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  usePageSeo({
    title: isHebrew ? 'אביתר חזן | Full Stack Developer' : 'Evyatar Hazan | Full Stack Developer',
    description: isHebrew
      ? 'פורטפוליו של אביתר חזן עם אתרים עסקיים, מערכות Full Stack, כלי מוצר, כתיבה מקצועית ודרכי יצירת קשר ישירות.'
      : 'Portfolio of Evyatar Hazan with business websites, full-stack systems, product tools, technical writing, and direct contact paths.',
    path: '/'
  });

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const nameText = t('home.name').split('');
  const proofItems = [
    { key: 'repos', icon: Code2 },
    { key: 'delivery', icon: ShieldCheck },
    { key: 'systems', icon: Workflow },
  ];

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-24 pb-16">
      {/* Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-600/20 dark:bg-primary-600/20 blur-[120px] rounded-full -z-10 transition-colors duration-500" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-600/15 dark:bg-accent-600/15 blur-[120px] rounded-full -z-10 transition-colors duration-500"
      />

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      <main className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur-sm transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400"
        >
          <span className="available-status-indicator h-2 w-2 rounded-full bg-success-500" />
          {t('home.available')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-5 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 text-center text-5xl font-bold tracking-tight text-neutral-950 transition-colors duration-500 dark:text-white md:text-8xl"
        >
          <span className="bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:to-neutral-500">{t('home.greeting')}</span>
          {isHebrew ? (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
              className="text-primary-500"
              translate="no"
            >
              {t('home.name')}
            </motion.span>
          ) : (
            <span className="inline-flex text-primary-500" translate="no">
              {nameText.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.05, type: "spring", stiffness: 100 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          )}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-6 text-center text-xl font-semibold text-neutral-800 transition-colors duration-500 dark:text-neutral-200 md:text-3xl"
        >
          {t('home.subtitle')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mx-auto mb-10 max-w-3xl text-center text-lg leading-relaxed text-neutral-600 transition-colors duration-500 dark:text-neutral-400 md:text-xl"
        >
          {t('home.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Magnetic intensity={0.2}>
            <a
              href={`${profileLinks.whatsapp}?text=${encodeURIComponent(t('home.whatsappText'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-primary-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
            >
              {t('home.whatsappCta')}
              <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
          </Magnetic>
          <Magnetic intensity={0.2}>
            <Button onClick={() => scrollTo('#projects')} variant="outline" className="group bg-white/50 px-8 text-lg backdrop-blur-md transition-colors duration-500 dark:bg-neutral-950/50">
              {t('home.viewProjects')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3"
        >
          {proofItems.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-neutral-200 bg-white/70 p-4 text-start shadow-sm backdrop-blur-md transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-900/50"
            >
              <Icon className="mb-3 h-5 w-5 text-primary-500" />
              <div className="text-sm font-bold text-neutral-900 dark:text-white">{t(`home.proof.${key}.title`)}</div>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t(`home.proof.${key}.description`)}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <Magnetic intensity={0.4}>
            <a href={profileLinks.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-none" aria-label="GitHub">
              <Github className="w-6 h-6" />
            </a>
          </Magnetic>
          <Magnetic intensity={0.4}>
            <a href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-none" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6" />
            </a>
          </Magnetic>
          <Magnetic intensity={0.4}>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }} className="p-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-none" aria-label="Email">
              <Mail className="w-6 h-6" />
            </a>
          </Magnetic>
        </motion.div>
      </main>
    </section>
  );
};

export default Home;
