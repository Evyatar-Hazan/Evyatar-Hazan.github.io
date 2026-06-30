import { fireEvent, render, screen } from '@testing-library/react';
import { projects } from './data/profile';
import { describe, expect, it, vi } from 'vitest';

const changeLanguageMock = vi.fn().mockResolvedValue(undefined);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: changeLanguageMock },
  }),
}));

import App from './App';

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('App', () => {
  it('renders the main navigation and hero section', () => {
    render(<App />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(document.querySelector('#home')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'nav.Blog' })).toHaveAttribute('href', '/blog');
  });

  it('renders the primary contact and profile links', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'home.whatsappCta' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/972587127547')
    );
    screen.getAllByRole('link', { name: 'LinkedIn' }).forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/evyatar-hazan-662235210/');
    });
  });

  it('renders the Nis Boutique Catering project with its live link', async () => {
    render(<App />);

    expect(await screen.findAllByText('projects.items.nis_boutique.title')).not.toHaveLength(0);
    screen
      .getAllByRole('link', { name: 'projects.liveDemo projects.items.nis_boutique.title' })
      .forEach((link) => {
        expect(link).toHaveAttribute('href', 'https://nisboutiquecatering.com/');
      });
  });

  it('renders the selected featured projects and public project index', async () => {
    render(<App />);

    const featuredIds = projects.filter((project) => project.featured).map((project) => project.id);
    expect(featuredIds).toEqual([
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
    ]);

    for (const project of projects) {
      expect(await screen.findAllByText(`projects.items.${project.id}.title`)).not.toHaveLength(0);
    }

    expect(screen.getByText('projects.indexTitle')).toBeInTheDocument();
    expect(screen.getAllByText('projects.caseStudy').length).toBeGreaterThan(0);
  });

  it('surfaces recent writing on the home page', async () => {
    render(<App />);

    expect(await screen.findByText('blogPreview.eyebrow')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blogPreview.viewAll/i })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('heading', { name: 'SEO is not decoration, it is product discovery' })).toBeInTheDocument();
  });

  it('only renders live links for projects with a liveUrl', async () => {
    render(<App />);

    await screen.findByText('projects.indexTitle');

    const expectedLiveActions = projects.filter((project) => project.liveUrl).length
      + projects.filter((project) => project.featured && project.liveUrl).length;
    expect(screen.getAllByText('projects.liveDemo')).toHaveLength(expectedLiveActions);
  });

  it('uses live embeds for projects with verified live URLs', async () => {
    render(<App />);

    expect(await screen.findByTitle('projects.items.nis_boutique.previewTitle')).toHaveAttribute(
      'src',
      'https://nisboutiquecatering.com/'
    );
    expect(screen.getByTitle('projects.items.online_converter.previewTitle')).toHaveAttribute(
      'src',
      'https://online-converter.evyatarhazan.com/'
    );
    expect(screen.getByTitle('projects.items.emergency_protocol.previewTitle')).toHaveAttribute(
      'src',
      'https://bls-protocol.evyatarhazan.com/'
    );
  });

  it('locks and unlocks body scroll when mobile menu toggles', () => {
    render(<App />);

    const menuToggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(menuToggle);

    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(document.body.style.overflow).toBe('unset');
  });

  it('updates i18n and localStorage when language toggle is clicked', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    render(<App />);

    const languageButtons = screen.getAllByRole('button', { name: /toggle language/i });
    fireEvent.click(languageButtons[0]);

    expect(setItemSpy).toHaveBeenCalledWith('i18nextLng', 'he');
    expect(changeLanguageMock).toHaveBeenCalledWith('he');
  });

  it('marks the active nav item with aria-current', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'nav.About' }));
    expect(screen.getByRole('link', { name: 'nav.About' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the blog index with posts for the active language', async () => {
    renderAt('/blog');

    expect(await screen.findByRole('heading', { name: 'blog.title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I built a business site around WhatsApp' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What I learned from building a credible portfolio' })).toBeInTheDocument();
  });

  it('renders a single blog post by slug', async () => {
    renderAt('/blog/catering-whatsapp');

    expect(await screen.findByRole('heading', { name: 'How I built a business site around WhatsApp' })).toBeInTheDocument();
    expect(screen.getByText(/The solution was almost funny in its simplicity/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog.backToBlog/i })).toHaveAttribute('href', '/blog');
  });

  it('renders a featured project case study page', async () => {
    renderAt('/projects/online_converter');

    expect(await screen.findByRole('heading', { name: 'projects.items.online_converter.title' })).toBeInTheDocument();
    expect(screen.getByText('projects.caseStudyAudience')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'projects.caseStudyBack' })).toHaveAttribute('href', '/#projects');
  });

  it('renders a not found state for an unknown blog post', async () => {
    renderAt('/blog/missing-post');

    expect(await screen.findByRole('heading', { name: 'blog.notFoundTitle' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog.backToBlog/i })).toHaveAttribute('href', '/blog');
  });

  it('closes the mobile menu when clicking the backdrop', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByTestId('mobile-menu-backdrop'));
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('restores body scroll when app unmounts with mobile menu open', () => {
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });
});
