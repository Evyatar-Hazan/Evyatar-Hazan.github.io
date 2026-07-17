import { blogPostMetadata as sourcePosts } from '../content/blog/metadata';

export const blogPosts = sourcePosts.map((post) => ({
  slug: post.slug,
  language: post.language,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
  tags: post.tags
}));
