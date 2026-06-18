import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts } from '../../content/blog/posts';
import type { BlogLanguage, BlogPost } from '../../content/blog/types';

const languageFromI18n = (language: string): BlogLanguage => (language === 'he' ? 'he' : 'en');

const formatDate = (date: string, language: BlogLanguage) =>
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

const BlogPreviewCard = ({ post, index, language }: { post: BlogPost; index: number; language: BlogLanguage }) => {
  const { t } = useTranslation();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 dark:border-neutral-800 dark:bg-neutral-950/70 dark:hover:border-primary-800 md:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-300 to-emerald-400 opacity-80" />
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        <span>{formatDate(post.date, language)}</span>
        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.readTime}
        </span>
      </div>

      <h3 className="text-xl font-bold leading-tight text-neutral-950 dark:text-white md:text-2xl">
        <Link to={`/blog/${post.slug}`} className="outline-none focus-visible:text-primary-500">
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400 md:text-base">
        {post.excerpt}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-300">
        {t('blogPreview.read')}
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </motion.article>
  );
};

const BlogPreview = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const language = languageFromI18n(i18n.language);
  const posts = getBlogPosts(language).slice(0, 2);
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (window.location.hash !== '#writing') return;

    const timeoutId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section ref={sectionRef} id="writing" className="relative overflow-hidden bg-neutral-50 px-6 py-24 transition-colors duration-500 dark:bg-neutral-950/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="lg:sticky lg:top-28"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-sm font-bold text-neutral-600 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300">
            <BookOpen className="h-4 w-4 text-primary-500" />
            {t('blogPreview.eyebrow')}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
            {t('blogPreview.title1')} <span className="text-primary-500">{t('blogPreview.title2')}</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            {t('blogPreview.subtitle')}
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 shadow-sm transition hover:border-primary-300 hover:text-primary-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-primary-800 dark:hover:text-primary-300"
          >
            {t('blogPreview.viewAll')}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-5">
          {posts.map((post, index) => (
            <BlogPreviewCard key={`${post.language}-${post.slug}`} post={post} index={index} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
