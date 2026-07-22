import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
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

const EntryMeta = ({ post, language }: { post: BlogPost; language: BlogLanguage }) => (
  <div className="blog-archive-meta">
    <time dateTime={post.date}>{formatDate(post.date, language)}</time>
    <span aria-hidden="true" />
    <span><Clock aria-hidden="true" />{post.readTime}</span>
  </div>
);

const ArchiveFeature = ({ post, language }: { post: BlogPost; language: BlogLanguage }) => {
  const { t } = useTranslation();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <article className="blog-archive-feature">
      <div className="blog-archive-index" aria-hidden="true">
        <strong>01</strong>
        <span>LEAD ENTRY</span>
      </div>
      <div className="blog-archive-feature-copy">
        <EntryMeta post={post} language={language} />
        <p className="blog-archive-label">{t('blog.latestEntry')}</p>
        <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.excerpt}</p>
        <div className="blog-archive-feature-footer">
          <ul aria-label={t('blog.articleTopics')}>
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <Link to={`/blog/${post.slug}`} className="blog-archive-read">
            {t('blog.readPost')}<ArrowIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="blog-archive-signal" aria-hidden="true">
        <span>LIVE NOTE / 01</span>
        <div><i /><i /><i /></div>
        <strong>{post.tags[0]}</strong>
      </div>
    </article>
  );
};

const ArchiveEntry = ({ post, index, language }: { post: BlogPost; index: number; language: BlogLanguage }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const number = String(index + 2).padStart(2, '0');

  return (
    <motion.article
      className="blog-archive-entry"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="blog-archive-entry-index" aria-hidden="true">
        <strong>{number}</strong><span>ENTRY / {number}</span>
      </div>
      <div className="blog-archive-entry-copy">
        <EntryMeta post={post} language={language} />
        <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.excerpt}</p>
        <div className="blog-archive-entry-footer">
          <ul aria-label={t('blog.articleTopics')}>
            {post.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <Link to={`/blog/${post.slug}`} aria-label={`${t('blog.readPost')}: ${post.title}`}>
            {t('blog.readPost')}<ArrowIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const BlogIndex = () => {
  const { t, i18n } = useTranslation();
  const language = languageFromI18n(i18n.language);
  const posts = getBlogPosts(language);
  const [featuredPost, ...archivePosts] = posts;

  usePageSeo({
    title: t('blog.seo.indexTitle'),
    description: t('blog.seo.indexDescription'),
    path: '/blog/'
  });

  return (
    <main className="blog-archive">
      <div className="blog-archive-grid" aria-hidden="true" />
      <section className="blog-archive-shell" aria-labelledby="blog-archive-title">
        <header className="blog-archive-header">
          <div>
            <p className="blog-archive-kicker"><span />WRITING ARCHIVE / {String(posts.length).padStart(2, '0')}</p>
            <h1 id="blog-archive-title" tabIndex={-1}>{t('blog.title')}</h1>
          </div>
          <div className="blog-archive-intro">
            <span>{t('blog.eyebrow')}</span>
            <p>{t('blog.subtitle')}</p>
          </div>
        </header>

        {featuredPost && <ArchiveFeature post={featuredPost} language={language} />}

        <div className="blog-archive-ledger">
          <div className="blog-archive-ledger-heading">
            <span>FIELD NOTES / {String(archivePosts.length).padStart(2, '0')}</span>
            <i aria-hidden="true" />
          </div>
          <div className="blog-archive-entry-grid">
            {archivePosts.map((post, index) => (
              <ArchiveEntry key={`${post.language}-${post.slug}`} post={post} index={index} language={language} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogIndex;
