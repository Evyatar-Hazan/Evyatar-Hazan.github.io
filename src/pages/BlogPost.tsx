import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBlogPost, getBlogPosts } from '../content/blog/posts';
import type { BlogLanguage } from '../content/blog/types';
import { usePageSeo } from '../hooks/usePageSeo';

type ArticleHeading = { id: string; label: string; level: number };

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
  const posts = getBlogPosts(language);
  const postIndex = post ? posts.findIndex((candidate) => candidate.slug === post.slug) : -1;
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const olderPost = postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const BackIcon = language === 'he' ? ArrowRight : ArrowLeft;
  const ForwardIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const articleRef = useRef<HTMLElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  usePageSeo({
    title: post ? `${post.title} | ${t('blog.title')}` : t('blog.notFoundSeoTitle'),
    description: post?.excerpt ?? t('blog.notFoundDescription'),
    path: post ? `/blog/${post.slug}/` : '/blog/'
  });

  useEffect(() => {
    const prose = proseRef.current;
    if (!prose || !post) return;

    const elements = Array.from(prose.querySelectorAll<HTMLElement>('h2, h3'));
    const outline = elements.map((heading, index) => {
      const fallback = `section-${index + 1}`;
      const normalized = heading.textContent
        ?.toLocaleLowerCase(language === 'he' ? 'he-IL' : 'en-US')
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '') || fallback;
      const id = `${normalized}-${index + 1}`;
      heading.id = id;
      return { id, label: heading.textContent?.trim() || fallback, level: Number(heading.tagName.slice(1)) };
    });

    setHeadings(outline);
    setActiveHeading(outline[0]?.id ?? '');

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveHeading(visible.target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 }
    );
    elements.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [language, post]);

  if (!post) {
    return (
      <main className="blog-article blog-article-not-found">
        <section>
          <span>WRITING / 404</span>
          <h1 tabIndex={-1}>{t('blog.notFoundTitle')}</h1>
          <p>{t('blog.notFoundDescription')}</p>
          <Link to="/blog"><BackIcon aria-hidden="true" />{t('blog.backToBlog')}</Link>
        </section>
      </main>
    );
  }

  const Content = post.Content;
  const articleNumber = String(postIndex + 1).padStart(2, '0');

  return (
    <main className="blog-article">
      <div className="blog-article-grid" aria-hidden="true" />
      <article ref={articleRef} className="blog-article-shell">
        <Link to="/blog" className="blog-article-back">
          <BackIcon aria-hidden="true" />{t('blog.backToBlog')}
        </Link>

        <header className="blog-article-masthead">
          <div className="blog-article-number" aria-hidden="true">
            <strong>{articleNumber}</strong>
            <span>ENTRY / {String(posts.length).padStart(2, '0')}</span>
          </div>
          <div className="blog-article-heading">
            <div className="blog-article-meta">
              <span><CalendarDays aria-hidden="true" />{formatDate(post.date, language)}</span>
              <i aria-hidden="true" />
              <span><Clock aria-hidden="true" />{post.readTime}</span>
            </div>
            <p>WRITING SYSTEM / ENTRY {articleNumber}</p>
            <h1 tabIndex={-1}>{post.title}</h1>
            <div className="blog-article-deck">
              <p>{post.excerpt}</p>
              <ul aria-label={t('blog.articleTopics')}>
                {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
          </div>
          <div className="blog-article-mark" aria-hidden="true"><i /><i /><i /></div>
        </header>

        <div className="blog-reading-layout">
          <aside className="blog-reading-rail" aria-label={t('blog.articleOutline')}>
            <div className="blog-reading-progress" aria-hidden="true">
              <span>READING / {articleNumber}</span>
              <div><motion.i style={{ scaleY: reduceMotion ? 1 : progressScale }} /></div>
            </div>
            {headings.length > 0 && (
              <nav>
                <span>{t('blog.articleOutline')}</span>
                <ol>
                  {headings.map((heading) => (
                    <li key={heading.id} data-level={heading.level}>
                      <a href={`#${heading.id}`} aria-current={activeHeading === heading.id ? 'location' : undefined}>
                        {heading.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <div ref={proseRef} className="blog-prose">
            <Content />
          </div>
        </div>

        <nav className="blog-article-next" aria-label={t('blog.moreWriting')}>
          <div className="blog-article-next-heading">
            <span>CONTINUE READING / 02</span>
            <h2>{t('blog.moreWriting')}</h2>
          </div>
          <div className="blog-article-next-grid">
            {newerPost && (
              <Link to={`/blog/${newerPost.slug}`}>
                <span>{t('blog.newerPost')}</span><strong>{newerPost.title}</strong><BackIcon aria-hidden="true" />
              </Link>
            )}
            {olderPost && (
              <Link to={`/blog/${olderPost.slug}`}>
                <span>{t('blog.olderPost')}</span><strong>{olderPost.title}</strong><ForwardIcon aria-hidden="true" />
              </Link>
            )}
          </div>
        </nav>
      </article>
    </main>
  );
};

export default BlogPost;
