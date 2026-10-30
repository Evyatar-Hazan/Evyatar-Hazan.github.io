import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let currentLanguage = 'en';

const libraryCopy = {
  en: {
    'blog.title': 'Blog',
    'blog.library.searchFormLabel': 'Search and filter the knowledge library',
    'blog.library.searchLabel': 'Search all notes',
    'blog.library.searchPlaceholder': 'Title, summary, or tag',
    'blog.library.clearSearch': 'Clear search',
    'blog.library.filtersLabel': 'Filter by topic',
    'blog.library.allTopics': 'All',
    'blog.library.reset': 'Reset library',
    'blog.library.emptyTitle': 'No notes match this signal',
    'blog.library.loadMore': 'Load more notes',
  },
  he: {
    'blog.title': 'בלוג',
    'blog.library.searchFormLabel': 'חיפוש וסינון בספריית הידע',
    'blog.library.searchLabel': 'חיפוש בכל הרשומות',
    'blog.library.searchPlaceholder': 'כותרת, תקציר או תגית',
    'blog.library.clearSearch': 'ניקוי החיפוש',
    'blog.library.filtersLabel': 'סינון לפי נושא',
    'blog.library.allTopics': 'הכול',
    'blog.library.reset': 'איפוס הספרייה',
    'blog.library.emptyTitle': 'אין רשומות שמתאימות לחיפוש',
    'blog.library.loadMore': 'טעינת רשומות נוספות',
  },
} as const;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => libraryCopy[currentLanguage as 'en' | 'he'][key as keyof typeof libraryCopy.en] ?? key,
    i18n: { language: currentLanguage },
  }),
}));

import BlogIndex from './BlogIndex';
import { getPopularBlogTopics, normalizeBlogSearchText } from '../features/blog-library/blogLibrary';
import { getBlogPosts } from '../content/blog/posts';

const renderBlog = (url = '/en/blog/') => {
  window.history.pushState({}, '', url);
  return render(<BrowserRouter><BlogIndex /></BrowserRouter>);
};

const resultCards = () => document.querySelectorAll('[data-library-results] .blog-archive-entry');

beforeEach(() => {
  currentLanguage = 'en';
  window.history.pushState({}, '', '/en/blog/');
});

describe('BlogIndex knowledge library', () => {
  it('uses the explicit editorial rank for the default order in both languages', () => {
    const englishPosts = getBlogPosts('en');
    const hebrewPosts = getBlogPosts('he');

    expect(englishPosts[0]).toMatchObject({
      slug: 'credible-portfolio',
      editorialRank: 10,
    });
    expect(hebrewPosts.map(({ slug }) => slug)).toEqual(englishPosts.map(({ slug }) => slug));
    expect(englishPosts.map(({ editorialRank }) => editorialRank)).toEqual(
      [...englishPosts.map(({ editorialRank }) => editorialRank)].sort((left, right) => left - right),
    );
    expect(new Set(englishPosts.map(({ editorialRank }) => editorialRank)).size).toBe(englishPosts.length);
  });

  it('derives the topic list deterministically from existing tags', () => {
    expect(getPopularBlogTopics(getBlogPosts('en'))).toEqual([
      'Frontend',
      'Product',
      'Java',
      'Testing',
      'Operating Systems',
      'Performance',
      'Data',
      'Reliability',
    ]);
    expect(normalizeBlogSearchText('  MIXED  טקסט  ', 'he')).toBe('mixed טקסט');
  });

  it('shows the lead, compact reading routes, twelve notes, and progressively loads the rest', () => {
    renderBlog();

    expect(document.querySelector('.blog-archive-feature')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What I learned from building a credible portfolio' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-reading-route]')).toHaveLength(3);
    expect(resultCards()).toHaveLength(12);

    fireEvent.click(screen.getByRole('button', { name: /^Load more notes/ }));
    expect(resultCards()).toHaveLength(24);
    fireEvent.click(screen.getByRole('button', { name: /^Load more notes/ }));
    expect(resultCards()).toHaveLength(32);
    expect(screen.queryByRole('button', { name: /^Load more notes/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What I learned from building a credible portfolio' })).toBeInTheDocument();
  });

  it.each([
    ['title, including the lead note', 'unfocused baseline', 'A focus test needs an unfocused baseline'],
    ['summary', 'atomic promotion', 'A failed render should not destroy good output'],
    ['tag', 'monetization', 'Monetization needs product guardrails'],
  ])('searches by %s without requiring submission', (_field, query, expectedTitle) => {
    renderBlog();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search all notes' }), { target: { value: query } });

    expect(screen.getByRole('heading', { name: expectedTitle })).toBeInTheDocument();
    expect(document.querySelector('.blog-archive-feature')).not.toBeInTheDocument();
    expect(document.querySelector('[aria-live="polite"]')).toHaveAttribute('data-result-count', '1');
    expect(window.location.search).toContain(`q=${encodeURIComponent(query).replaceAll('%20', '+')}`);
  });

  it('searches Hebrew and mixed text using the active language', () => {
    currentLanguage = 'he';
    renderBlog('/he/blog/');

    fireEvent.change(screen.getByRole('searchbox', { name: 'חיפוש בכל הרשומות' }), {
      target: { value: '  candidate  ' },
    });

    expect(screen.getByRole('heading', { name: 'רינדור שנכשל לא צריך למחוק פלט תקין' })).toBeInTheDocument();
    expect(document.querySelector('[aria-live="polite"]')).toHaveAttribute('data-result-count', '1');
  });

  it('combines an exact topic filter with search and exposes accessible state', () => {
    renderBlog();

    const reliability = screen.getByRole('button', { name: 'Reliability' });
    fireEvent.click(reliability);
    expect(reliability).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toContain('topic=Reliability');
    expect(resultCards()).toHaveLength(3);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search all notes' }), {
      target: { value: 'timestamp' },
    });
    expect(resultCards()).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'One bad date should not blank an entire screen' })).toBeInTheDocument();
    expect(document.querySelector('[aria-live="polite"]')).toHaveAttribute('aria-atomic', 'true');
  });

  it('shows an accessible empty state and resets query and topic while preserving unrelated params', () => {
    renderBlog('/en/blog/?campaign=portfolio&topic=Reliability&q=definitely-no-match');

    expect(screen.getByRole('status')).toHaveTextContent('No notes match this signal');
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset library' })[0]);

    expect(window.location.search).toBe('?campaign=portfolio');
    expect(document.querySelector('.blog-archive-feature')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('restores direct query state, safely ignores invalid topics, and reacts to history navigation', async () => {
    renderBlog('/en/blog/?ref=direct&q=unicode&topic=Java');

    expect(screen.getByRole('searchbox', { name: 'Search all notes' })).toHaveValue('unicode');
    expect(screen.getByRole('button', { name: 'Java' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Why String.length() does not really count characters' })).toBeInTheDocument();

    window.history.pushState({}, '', '/en/blog/?ref=direct&topic=not-a-real-tag');
    window.dispatchEvent(new PopStateEvent('popstate'));

    await waitFor(() => expect(screen.getByRole('searchbox', { name: 'Search all notes' })).toHaveValue(''));
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toContain('ref=direct');
  });

  it('uses localized control copy in RTL and LTR instead of hardcoded labels', () => {
    const { unmount } = renderBlog();
    expect(screen.getByRole('search', { name: 'Search and filter the knowledge library' })).toBeInTheDocument();
    unmount();

    currentLanguage = 'he';
    renderBlog('/he/blog/');
    expect(screen.getByRole('search', { name: 'חיפוש וסינון בספריית הידע' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'הכול' })).toHaveAttribute('aria-pressed', 'true');
  });
});
