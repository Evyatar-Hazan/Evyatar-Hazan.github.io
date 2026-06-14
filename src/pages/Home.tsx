import { motion } from 'framer-motion';
import { ArrowRight, Github, Mail } from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import Magnetic from '../components/animations/Magnetic';

const Home = () => {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const nameText = t('home.name').split('');

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20">
      {/* Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-600/20 dark:bg-primary-600/20 blur-[120px] rounded-full -z-10 transition-colors duration-500" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-600/15 dark:bg-purple-600/15 blur-[120px] rounded-full -z-10 transition-colors duration-500" 
      />

      <main className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-block px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm text-neutral-600 dark:text-neutral-400 text-sm font-medium transition-colors duration-500"
        >
          {t('home.available')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-4 flex flex-wrap justify-center items-center gap-x-4 bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent transition-colors duration-500"
        >
          {t('home.greeting')} 
          <span className="text-primary-500 inline-flex">
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
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl md:text-3xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200 transition-colors duration-500"
        >
          {t('home.subtitle')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-500"
        >
          {t('home.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Magnetic intensity={0.2}>
            <Button onClick={() => scrollTo('#projects')} variant="primary" className="group text-lg px-8">
              {t('home.viewProjects')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Magnetic>
          <Magnetic intensity={0.2}>
            <Button onClick={() => scrollTo('#contact')} variant="outline" className="group bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md transition-colors duration-500 text-lg px-8">
              {t('home.contactMe')}
              <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
            </Button>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex items-center justify-center gap-6"
        >
          <Magnetic intensity={0.4}>
            <a href="https://github.com/Evyatar-Hazan" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-none">
              <Github className="w-6 h-6" />
            </a>
          </Magnetic>
          <Magnetic intensity={0.4}>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }} className="p-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-none">
              <Mail className="w-6 h-6" />
            </a>
          </Magnetic>
        </motion.div>
      </main>
    </section>
  );
};

export default Home;
