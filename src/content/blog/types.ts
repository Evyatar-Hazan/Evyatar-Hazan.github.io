import type { ComponentType } from 'react';

export type BlogLanguage = 'he' | 'en';

export type BlogPostMeta = {
  slug: string;
  language: BlogLanguage;
  title: string;
  excerpt: string;
  readerOutcome: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  editorialRank: number;
};

export type BlogPost = BlogPostMeta & {
  Content: ComponentType;
};
