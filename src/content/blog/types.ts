import type { ComponentType } from 'react';

export type BlogLanguage = 'he' | 'en';

export const blogDepths = ['foundation', 'applied', 'deep-dive'] as const;

export type BlogDepth = (typeof blogDepths)[number];

export type BlogPostMeta = {
  slug: string;
  language: BlogLanguage;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  depth: BlogDepth;
  featured: boolean;
};

export type BlogPost = BlogPostMeta & {
  Content: ComponentType;
};
