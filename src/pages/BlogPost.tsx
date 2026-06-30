import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPost } from '../content/blog/posts';
import type { BlogLanguage } from '../content/blog/types';
import { usePageSeo } from '../hooks/usePageSeo';

const languageFromI18n = (language: string): BlogLanguage => (language === 'he' ? 'he' : 'en');

const formatDate = (date: string, language: BlogLanguage) =>
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

const BlogPost = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const language = languageFromI18n(i18n.language);
  const post = getBlogPost(slug, language);
  const BackIcon = language === 'he' ? ArrowRight : ArrowLeft;

  usePageSeo({
    title: post ? `${post.title} | ${t('blog.title')}` : t('blog.notFoundSeoTitle'),
    description: post?.excerpt ?? t('blog.notFoundDescription'),
    path: post ? `/blog/${post.slug}/` : '/blog/'
  });

  if (!post) {
    return (
      <main className="min-h-screen px-6 pb-20 pt-32">
        <section className="mx-auto max-w-3xl rounded-3xl border border-neutral-200 bg-white/75 p-8 text-center shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">{t('blog.notFoundTitle')}</h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">{t('blog.notFoundDescription')}</p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-black"
          >
            <BackIcon className="h-4 w-4" />
            {t('blog.backToBlog')}
          </Link>
        </section>
      </main>
    );
  }

  const Content = post.Content;

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <article className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-neutral-500 transition hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-300"
        >
          <BackIcon className="h-4 w-4" />
          {t('blog.backToBlog')}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white/80 p-7 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 md:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-300 to-emerald-400" />
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary-500" />
              {formatDate(post.date, language)}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-500" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-950 dark:text-white md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">{post.excerpt}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="blog-prose mx-auto mt-12 max-w-3xl"
        >
          <Content />
        </motion.div>
      </article>
    </main>
  );
};

export default BlogPost;
