import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts } from '../../content/blog/posts';
import type { BlogLanguage, BlogPost } from '../../content/blog/types';
import type { ArticleId } from '../../contracts/portfolio';
import { localizedPath } from '../../routing/portfolioRoutes';
import { HomeSectionHeader } from './HomeSectionPrimitives';
import { cardSurfaceClassName } from '../cardSurface';

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
  return (
    <article
      className={cardSurfaceClassName('interactive', featured ? 'writing-feature' : 'writing-entry')}
      data-writing-index={issue}
    >
      <div className="writing-article-index" aria-hidden="true">
        <span>{issue}</span>
        <span>{featured ? t('blogPreview.editorialPick') : t('blogPreview.note')}</span>
      </div>

      <div className="writing-article-copy">
        <ArticleMeta post={post} language={language} />
        <h3>
          <Link
            to={localizedPath(language, { route: 'article', id: post.slug as ArticleId })}
            className="writing-article-title-link"
          >
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
      </div>

      {featured && (
        <>
          <span className="writing-feature-scan" aria-hidden="true" />
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
    </article>
  );
};

const BlogPreview = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const language = languageFromI18n(i18n.language);
  const posts = getBlogPosts(language).slice(0, 3);
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  useEffect(() => {
    if (window.location.hash !== '#writing') return;

    const timeoutId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="writing"
      data-reader-journey-stage="content"
      className="home-section home-section--writing writing-lab"
    >
      <div className="writing-lab-grid" aria-hidden="true" />
      <div className="writing-lab-orbit" aria-hidden="true" />

      <div className="writing-shell home-section__inner">
        <HomeSectionHeader
          index="03"
          eyebrow={t('blogPreview.eyebrow')}
          title={<>{t('blogPreview.title1')} <em>{t('blogPreview.title2')}</em></>}
          description={(
            <>
              <p>{t('blogPreview.subtitle')}</p>
              <Link to={localizedPath(language, { route: 'blog' })} className="writing-all-link">
                <span>{t('blogPreview.viewAll')}</span>
                <ArrowIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </>
          )}
        />

        <div className="writing-log">
          <div className="writing-progress" aria-hidden="true">
            <span>READING LOG / {String(posts.length).padStart(2, '0')}</span>
            <div>
              <i />
              <b />
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
