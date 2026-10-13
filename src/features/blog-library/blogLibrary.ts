import type { BlogLanguage, BlogPostMeta } from '../../content/blog/types';

export const BLOG_LIBRARY_PAGE_SIZE = 12;
export const BLOG_LIBRARY_TOPIC_LIMIT = 8;

export const normalizeBlogSearchText = (value: string, language: BlogLanguage) => value
  .normalize('NFKC')
  .toLocaleLowerCase(language === 'he' ? 'he-IL' : 'en-US')
  .trim()
  .replace(/\s+/gu, ' ');

export const getPopularBlogTopics = (
  posts: BlogPostMeta[],
  limit = BLOG_LIBRARY_TOPIC_LIMIT,
) => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return [...counts.entries()]
    .sort(([leftTag, leftCount], [rightTag, rightCount]) => (
      rightCount - leftCount || leftTag.localeCompare(rightTag, 'en')
    ))
    .slice(0, limit)
    .map(([tag]) => tag);
};
