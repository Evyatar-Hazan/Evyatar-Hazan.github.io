import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import { Fragment, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPosts } from '../content/blog/posts';
import type { BlogLanguage, BlogPost } from '../content/blog/types';
import { usePageSeo } from '../hooks/usePageSeo';
import type { ArticleId } from '../contracts/portfolio';
import ReadingRoutesSection from '../features/curated-reading-routes/ReadingRoutesSection';
import {
  BLOG_LIBRARY_PAGE_SIZE,
  getAvailableBlogDepths,
  getPopularBlogTopics,
  normalizeBlogSearchText,
} from '../features/blog-library/blogLibrary';
import { localizedPath } from '../routing/portfolioRoutes';
import { cardSurfaceClassName } from '../components/cardSurface';
import BlogDateMeta from '../components/blog/BlogDateMeta';

const languageFromI18n = (language: string): BlogLanguage => (language === 'he' ? 'he' : 'en');

const EntryMeta = ({ post, language }: { post: BlogPost; language: BlogLanguage }) => (
  <BlogDateMeta className="blog-archive-meta" post={post} language={language} showDepth />
);

const escapeSearchPattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightedSearchText = ({ text, query }: { text: string; query: string }) => {
  const pattern = query
    .normalize('NFKC')
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map(escapeSearchPattern)
    .join('\\s+');

  if (!pattern) return text;

  const parts = text.split(new RegExp(`(${pattern})`, 'giu')).filter(Boolean);
  const exactMatch = new RegExp(`^${pattern}$`, 'iu');

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {exactMatch.test(part) ? <mark className="blog-search-highlight">{part}</mark> : part}
    </Fragment>
  ));
};

const ArchiveFeature = ({ post, language }: { post: BlogPost; language: BlogLanguage }) => {
  const { t } = useTranslation();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <article className={cardSurfaceClassName('interactive', 'blog-archive-feature')}>
      <div className="blog-archive-index" aria-hidden="true">
        <strong>01</strong>
        <span>LEAD ENTRY</span>
      </div>
      <div className="blog-archive-feature-copy">
        <EntryMeta post={post} language={language} />
        <p className="blog-archive-label">{t('blog.featured')}</p>
        <h2><Link to={localizedPath(language, { route: 'article', id: post.slug as ArticleId })}>{post.title}</Link></h2>
        <p>{post.excerpt}</p>
        <div className="blog-archive-feature-footer">
          <ul aria-label={t('blog.articleTopics')}>
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <Link to={localizedPath(language, { route: 'article', id: post.slug as ArticleId })} className="blog-archive-read">
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

const ArchiveEntry = ({
  post,
  index,
  language,
  query,
}: {
  post: BlogPost;
  index: number;
  language: BlogLanguage;
  query: string;
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      className={cardSurfaceClassName('interactive', 'blog-archive-entry')}
      data-blog-slug={post.slug}
      data-blog-depth={post.depth}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px -5% 0px' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="blog-archive-entry-index" aria-hidden="true">
        <strong>{number}</strong><span>NOTE / {number}</span>
      </div>
      <div className="blog-archive-entry-copy">
        <EntryMeta post={post} language={language} />
        <h2>
          <Link to={localizedPath(language, { route: 'article', id: post.slug as ArticleId })}>
            <HighlightedSearchText text={post.title} query={query} />
          </Link>
        </h2>
        <p><HighlightedSearchText text={post.excerpt} query={query} /></p>
        <div className="blog-archive-entry-footer">
          <ul aria-label={t('blog.articleTopics')}>
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag}><HighlightedSearchText text={tag} query={query} /></li>
            ))}
          </ul>
          <Link to={localizedPath(language, { route: 'article', id: post.slug as ArticleId })} aria-label={`${t('blog.readPost')}: ${post.title}`}>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(BLOG_LIBRARY_PAGE_SIZE);
  const topics = getPopularBlogTopics(posts);
  const depths = getAvailableBlogDepths(posts);
  const query = searchParams.get('q') ?? '';
  const requestedTopic = searchParams.get('topic') ?? '';
  const requestedDepth = searchParams.get('depth') ?? '';
  const activeTopic = topics.includes(requestedTopic) ? requestedTopic : '';
  const activeDepth = depths.includes(requestedDepth as (typeof depths)[number])
    ? requestedDepth as (typeof depths)[number]
    : '';
  const normalizedQuery = normalizeBlogSearchText(query, language);
  const isFiltering = normalizedQuery.length > 0 || activeTopic.length > 0 || activeDepth.length > 0;
  const [featuredPost, ...archivePosts] = posts;

  const filteredPosts = posts.filter((post) => {
    const matchesTopic = !activeTopic || post.tags.includes(activeTopic);
    const matchesDepth = !activeDepth || post.depth === activeDepth;
    if (!matchesTopic || !matchesDepth) return false;
    if (!normalizedQuery) return true;

    const searchableText = normalizeBlogSearchText(
      [post.title, post.excerpt, ...post.tags].join(' '),
      language,
    );
    return searchableText.includes(normalizedQuery);
  });

  const listedPosts = isFiltering ? filteredPosts : archivePosts.slice(0, visibleCount);
  const hasMore = !isFiltering && visibleCount < archivePosts.length;

  const updateParams = (
    updates: { q?: string; topic?: string; depth?: string },
    options: { replace?: boolean } = {},
  ) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const cleanValue = value?.trim() ?? '';
      if (cleanValue) next.set(key, cleanValue);
      else next.delete(key);
    });

    setVisibleCount(BLOG_LIBRARY_PAGE_SIZE);
    setSearchParams(next, options);
  };

  const resetLibrary = () => updateParams({ q: '', topic: '', depth: '' });

  usePageSeo({
    title: t('blog.seo.indexTitle'),
    description: t('blog.seo.indexDescription'),
    path: '/blog/'
  });

  return (
    <main id="main-content" tabIndex={-1} className="blog-archive">
      <div className="blog-archive-grid" aria-hidden="true" />
      <section className="blog-archive-shell content-container" aria-labelledby="blog-archive-title">
        <header className="blog-archive-header">
          <div>
            <p className="blog-archive-kicker"><span />{t('blog.library.kicker', { count: posts.length })}</p>
            <h1 id="blog-archive-title" tabIndex={-1}>{t('blog.title')}</h1>
          </div>
          <div className="blog-archive-intro">
            <span>{t('blog.eyebrow')}</span>
            <p>{t('blog.subtitle')}</p>
          </div>
        </header>

        {!isFiltering && featuredPost && <ArchiveFeature post={featuredPost} language={language} />}

        {!isFiltering && (
          <ReadingRoutesSection
            language={language}
            buildPath={localizedPath}
            className="blog-reading-routes"
          />
        )}

        <section className="blog-library" aria-labelledby="blog-library-title">
          <header className="blog-library-heading">
            <div>
              <p>{t('blog.library.eyebrow')}</p>
              <h2 id="blog-library-title">{t('blog.library.title')}</h2>
            </div>
            <p>{t('blog.library.description')}</p>
          </header>

          <form
            className="blog-library-toolbar"
            role="search"
            aria-label={t('blog.library.searchFormLabel')}
            onSubmit={(event: FormEvent) => event.preventDefault()}
          >
            <div className="blog-library-search">
              <label htmlFor="blog-library-search">{t('blog.library.searchLabel')}</label>
              <div>
                <Search aria-hidden="true" />
                <input
                  id="blog-library-search"
                  type="search"
                  value={query}
                  onChange={(event) => updateParams({ q: event.target.value }, { replace: true })}
                  placeholder={t('blog.library.searchPlaceholder')}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="blog-library-clear"
                    onClick={() => updateParams({ q: '' })}
                    aria-label={t('blog.library.clearSearch')}
                  >
                    <X aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div className="blog-library-filter-stack">
              <div className="blog-library-filter-group" role="group" aria-label={t('blog.library.topicFiltersLabel')}>
                <p>{t('blog.library.topicFiltersLabel')}</p>
                <div className="blog-library-filters">
                  <button
                    type="button"
                    aria-pressed={!activeTopic}
                    onClick={() => updateParams({ topic: '' })}
                  >
                    {t('blog.library.allTopics')}
                  </button>
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      aria-pressed={activeTopic === topic}
                      onClick={() => updateParams({ topic })}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="blog-library-filter-group" role="group" aria-label={t('blog.library.depthFiltersLabel')}>
                <p>{t('blog.library.depthFiltersLabel')}</p>
                <div className="blog-library-filters blog-library-depth-filters">
                  <button
                    type="button"
                    aria-pressed={!activeDepth}
                    onClick={() => updateParams({ depth: '' })}
                  >
                    {t('blog.library.allDepths')}
                  </button>
                  {depths.map((depth) => (
                    <button
                      key={depth}
                      type="button"
                      aria-pressed={activeDepth === depth}
                      onClick={() => updateParams({ depth })}
                    >
                      {t(`blog.library.depths.${depth}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div className="blog-library-status">
            <p
              aria-live="polite"
              aria-atomic="true"
              data-result-count={isFiltering ? filteredPosts.length : posts.length}
            >
              {isFiltering
                ? t('blog.library.resultsCount', { count: filteredPosts.length })
                : t('blog.library.totalCount', { count: posts.length })}
            </p>
            {isFiltering && (
              <button type="button" onClick={resetLibrary}>{t('blog.library.reset')}</button>
            )}
          </div>

          {listedPosts.length > 0 ? (
            <div className="blog-archive-entry-grid" data-library-results>
              {listedPosts.map((post, index) => (
                <ArchiveEntry
                  key={`${post.language}-${post.slug}`}
                  post={post}
                  index={index + (isFiltering ? 0 : 1)}
                  language={language}
                  query={normalizedQuery ? query : ''}
                />
              ))}
            </div>
          ) : (
            <div className="blog-library-empty" role="status">
              <span aria-hidden="true">00</span>
              <h3>{t('blog.library.emptyTitle')}</h3>
              <p>{t('blog.library.emptyDescription')}</p>
              <button type="button" onClick={resetLibrary}>{t('blog.library.reset')}</button>
            </div>
          )}

          {hasMore && (
            <div className="blog-library-load-more">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + BLOG_LIBRARY_PAGE_SIZE, archivePosts.length))}
              >
                {t('blog.library.loadMore')}
                <span>{Math.min(BLOG_LIBRARY_PAGE_SIZE, archivePosts.length - visibleCount)}</span>
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default BlogIndex;
