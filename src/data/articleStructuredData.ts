import type { BlogPostMeta } from '../content/blog/types';
import type { ArticleId } from '../contracts/portfolio';
import { localizedPath } from '../routing/portfolioRoutes';
import { absoluteUrl } from './site';

export const articleStructuredDataId = 'blog-article-structured-data';

export const getArticleStructuredData = (post: BlogPostMeta) => {
  const articleUrl = absoluteUrl(localizedPath(post.language, { route: 'article', id: post.slug as ArticleId }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedDate ?? post.date,
    inLanguage: post.language,
    mainEntityOfPage: articleUrl,
    author: {
      '@type': 'Person',
      name: 'Evyatar Hazan',
      url: absoluteUrl(localizedPath(post.language, { route: 'about' })),
    },
    keywords: post.tags,
  };
};
