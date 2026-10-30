import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { BlogPostMeta } from '../../content/blog/types';
import BlogDateMeta from './BlogDateMeta';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'blog.publishedOn': 'Published',
      'blog.updatedOn': 'Updated',
    }[key] ?? key),
  }),
}));

const post: BlogPostMeta = {
  slug: 'sample',
  language: 'en',
  title: 'Sample',
  excerpt: 'Sample excerpt',
  date: '2026-09-06',
  updatedDate: '2026-10-03',
  readTime: '7 min read',
  tags: ['Testing'],
  featured: false,
};

describe('BlogDateMeta', () => {
  it('distinguishes publication and update dates with semantic, locale-aware values', () => {
    const { container } = render(<BlogDateMeta className="meta" language="en" post={post} />);

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('September 6, 2026')).toHaveAttribute('datetime', '2026-09-06');
    expect(screen.getByText('October 3, 2026')).toHaveAttribute('datetime', '2026-10-03');
    expect(container.querySelectorAll('[data-date-kind]')).toHaveLength(2);
  });

  it('uses Hebrew locale formatting and omits a redundant update date', () => {
    const { container } = render(
      <BlogDateMeta
        className="meta"
        language="he"
        post={{ ...post, updatedDate: post.date, language: 'he' }}
      />,
    );

    expect(screen.getByText('6 בספטמבר 2026')).toHaveAttribute('datetime', '2026-09-06');
    expect(container.querySelector('[data-date-kind="updated"]')).not.toBeInTheDocument();
  });
});
