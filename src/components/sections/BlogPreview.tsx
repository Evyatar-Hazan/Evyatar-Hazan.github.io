import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts } from '../../content/blog/posts';
import type { BlogLanguage, BlogPost } from '../../content/blog/types';

const languageFromI18n = (language: string): BlogLanguage => (language === 'he' ? 'he' : 'en');

const formatDate = (date: string, language: BlogLanguage) =>
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

type ArticleMetaProps = {
  post: BlogPost;
  language: BlogLanguage;
};

const ArticleMeta = ({ post, language }: ArticleMetaProps) => (
  <div className="writing-article-meta">
    <time dateTime={post.date}>{formatDate(post.date, language)}</time>
    <span aria-hidden="true">/</span>
    <span className="inline-flex items-center gap-1.5">
      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
      {post.readTime}
    </span>
  </div>
);

type ArticleLinkProps = {
  post: BlogPost;
  language: BlogLanguage;
  featured?: boolean;
  index: number;
};

const ArticleLink = ({ post, language, featured = false, index }: ArticleLinkProps) => {
  const { t } = useTranslation();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const issue = String(index + 1).padStart(2, '0');
  const articleRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start 92%', 'end 8%'],
  });
  const entryX = useTransform(scrollYProgress, [0, 0.32, 1], [index % 2 === 0 ? -42 : 42, 0, 0]);
  const numberY = useTransform(scrollYProgress, [0, 0.55, 1], [24, -4, -16]);
  const copyY = useTransform(scrollYProgress, [0, 0.55, 1], [28, 0, -18]);
  const scanY = useTransform(scrollYProgress, [0, 1], [-80, 560]);
  const scanOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 0.75, 0.75, 0]);

  return (
    <motion.article
      ref={articleRef}
      className={featured ? 'writing-feature' : 'writing-entry'}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12%' }}
      transition={{ duration: 0.65, delay: featured ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: featured || reduceMotion ? 0 : entryX }}
      data-writing-index={issue}
    >
      <div className="writing-article-index" aria-hidden="true">
        <motion.span style={{ y: reduceMotion ? 0 : numberY }}>{issue}</motion.span>
        <span>{featured ? t('blogPreview.latest') : t('blogPreview.note')}</span>
      </div>

      <motion.div className="writing-article-copy" style={{ y: featured && !reduceMotion ? copyY : 0 }}>
        <ArticleMeta post={post} language={language} />
        <h3>
          <Link to={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>
        <p>{post.excerpt}</p>

        <div className="writing-article-footer">
          <ul aria-label={t('blogPreview.topics')}>
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <span className="writing-read-link">
            {t('blogPreview.read')}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </motion.div>

      {featured && (
        <>
          <motion.span
            className="writing-feature-scan"
            aria-hidden="true"
            style={{ y: reduceMotion ? 0 : scanY, opacity: reduceMotion ? 0 : scanOpacity }}
          />
          <div className="writing-signal" aria-hidden="true">
            <span>INPUT</span>
            <div>
              <i />
              <i />
              <i />
            </div>
            <strong>{t('blogPreview.signal')}</strong>
            <span>OUTPUT</span>
          </div>
        </>
      )}
    </motion.article>
  );
};

const BlogPreview = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const language = languageFromI18n(i18n.language);
  const posts = getBlogPosts(language).slice(0, 3);
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 72%', 'end 62%'],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const markerY = useTransform(scrollYProgress, [0, 1], ['0%', '96%']);
  const orbitY = useTransform(scrollYProgress, [0, 1], [-70, 180]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-8, 34]);

  useEffect(() => {
    if (window.location.hash !== '#writing') return;

    const timeoutId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section ref={sectionRef} id="writing" className="writing-lab">
      <div className="writing-lab-grid" aria-hidden="true" />
      <motion.div
        className="writing-lab-orbit"
        aria-hidden="true"
        style={{ y: reduceMotion ? 0 : orbitY, rotate: reduceMotion ? 0 : orbitRotate }}
      />

      <div className="writing-shell">
        <header className="writing-header">
          <div>
            <p className="writing-kicker">
              <span />
              {t('blogPreview.eyebrow')}
            </p>
            <h2>
              {t('blogPreview.title1')} <em>{t('blogPreview.title2')}</em>
            </h2>
          </div>

          <div className="writing-header-note">
            <p>{t('blogPreview.subtitle')}</p>
            <Link to="/blog" className="writing-all-link">
              <span>{t('blogPreview.viewAll')}</span>
              <ArrowIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="writing-log">
          <div className="writing-progress" aria-hidden="true">
            <span>READING LOG / {String(posts.length).padStart(2, '0')}</span>
            <div>
              <motion.i style={{ scaleY: reduceMotion ? 1 : railScale }} />
              <motion.b style={{ y: reduceMotion ? '96%' : markerY }} />
            </div>
          </div>

          <div className="writing-articles">
            {posts[0] && <ArticleLink post={posts[0]} language={language} index={0} featured />}
            <div className="writing-entry-grid">
              {posts.slice(1).map((post, index) => (
                <ArticleLink key={`${post.language}-${post.slug}`} post={post} language={language} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
