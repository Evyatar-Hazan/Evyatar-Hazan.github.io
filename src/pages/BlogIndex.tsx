import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts } from '../content/blog/posts';
import type { BlogLanguage, BlogPost } from '../content/blog/types';
import { usePageSeo } from '../hooks/usePageSeo';

const languageFromI18n = (language: string): BlogLanguage => (language === 'he' ? 'he' : 'en');

const formatDate = (date: string, language: BlogLanguage) =>
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

const BlogCard = ({ post, index, language }: { post: BlogPost; index: number; language: BlogLanguage }) => {
  const { t } = useTranslation();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-2xl hover:shadow-primary-500/10 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-primary-700"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-300 to-emerald-400 opacity-70" />
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {post.featured && (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-primary-700 dark:border-primary-900/70 dark:bg-primary-950/40 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            {t('blog.featured')}
          </span>
        )}
        <span>{formatDate(post.date, language)}</span>
        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.readTime}
        </span>
      </div>

      <h2 className="text-2xl font-bold leading-tight text-neutral-950 dark:text-white">
        <Link to={`/blog/${post.slug}`} className="outline-none focus-visible:text-primary-500">
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h2>

      <p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">{post.excerpt}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-300">
        {t('blog.readPost')}
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </motion.article>
  );
};

const BlogIndex = () => {
  const { t, i18n } = useTranslation();
  const language = languageFromI18n(i18n.language);
  const posts = getBlogPosts(language);

  usePageSeo({
    title: t('blog.seo.indexTitle'),
    description: t('blog.seo.indexDescription'),
    path: '/blog/'
  });

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <section className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-neutral-600 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
            <BookOpen className="h-4 w-4 text-primary-500" />
            {t('blog.eyebrow')}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-7xl">
            {t('blog.title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 md:text-xl">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {posts.map((post, index) => (
            <BlogCard key={`${post.language}-${post.slug}`} post={post} index={index} language={language} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogIndex;
