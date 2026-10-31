import { useEffect } from 'react';
import type { BlogPostMeta } from '../content/blog/types';
import {
  articleStructuredDataId,
  getArticleStructuredData,
} from '../data/articleStructuredData';

const ArticleStructuredData = ({ post }: { post: BlogPostMeta }) => {
  useEffect(() => {
    let script = document.getElementById(articleStructuredDataId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = articleStructuredDataId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(getArticleStructuredData(post));

    return () => script?.remove();
  }, [post]);

  return null;
};

export default ArticleStructuredData;
