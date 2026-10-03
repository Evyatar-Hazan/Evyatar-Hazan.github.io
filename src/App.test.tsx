import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { projects } from './data/profile';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

beforeEach(() => {
  window.history.pushState({}, '', '/en/');
  changeLanguageMock.mockClear();
});

describe('App', () => {
  it('renders the main navigation and hero section', () => {
    render(<App />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(document.querySelector('#home')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'nav.Blog' })[0]).toHaveAttribute('href', '/en/blog/');
  });

  it('renders the primary contact and profile links', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: 'home.compiler.buildCta' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/972587127547')
    );
    screen.getAllByRole('link', { name: 'LinkedIn' }).forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/evyatar-hazan-662235210/');
    });
  });

  it('renders the operating system chapter and canonical capability map', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'about.systemTitle' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'What I am working to make clearer now.' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-focus-id]')).toHaveLength(2);
    await waitFor(() => expect(screen.getAllByText('Web & mobile products')).toHaveLength(2));
    expect(document.querySelectorAll('.about-capability-module')).toHaveLength(7);
    expect(await screen.findByRole('heading', { name: 'Follow one need through the product.' })).toBeInTheDocument();
    expect(document.querySelector('[data-portfolio-slot="shell.signatureInteraction"]')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Working principles, visible in the work.' })).toBeInTheDocument();
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
    expect(document.querySelectorAll('.project-scroll-chapter')).toHaveLength(featuredIds.length);
    expect(document.querySelectorAll('.project-scroll-frame')).toHaveLength(featuredIds.length * 3);
    expect(document.querySelectorAll('.project-live-capture')).toHaveLength(featuredIds.length);
    const liveCaptureLinks = document.querySelectorAll<HTMLAnchorElement>('.project-story-preview');
    expect(liveCaptureLinks).toHaveLength(featuredIds.length);
    liveCaptureLinks.forEach((link) => expect(link).not.toHaveAttribute('target'));
    expect(document.querySelectorAll('.project-scroll-stage-static')).toHaveLength(0);
    expect(document.querySelectorAll('#projects .project-secondary-index > li')).toHaveLength(
      projects.filter((project) => !project.featured).length
    );
    expect(await screen.findByRole('heading', { name: 'Project archive' })).toBeInTheDocument();
  });

  it('surfaces recent writing on the home page', async () => {
    render(<App />);

    expect(await screen.findByText('blogPreview.eyebrow')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blogPreview.viewAll/i })).toHaveAttribute('href', '/en/blog/');
    expect(screen.getByRole('heading', { name: 'One bad date should not blank an entire screen' })).toBeInTheDocument();
    expect(document.querySelectorAll('#writing article')).toHaveLength(3);
    expect(document.querySelectorAll('#writing .writing-feature')).toHaveLength(1);
    expect(document.querySelectorAll('#writing .writing-entry')).toHaveLength(2);
  });

  it('renders the project handoff contact flow without removing direct channels', async () => {
    render(<App />);

    expect(await screen.findByText('PROJECT HANDOFF / 01')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'WhatsApp' }).at(-1)).toHaveAttribute('target', '_blank');
    expect(screen.getAllByRole('link', { name: 'Email' }).at(-1)).toHaveAttribute('href', expect.stringContaining('mailto:'));
    expect(screen.getAllByRole('link', { name: 'LinkedIn' }).at(-1)).toHaveAttribute('target', '_blank');

    fireEvent.click(screen.getByRole('button', { name: 'Build a short project brief (optional)' }));
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeRequired();
    expect(screen.getByLabelText('Message preview')).toHaveAttribute('readonly');
  });

  it('only renders live links for projects with a liveUrl', async () => {
    render(<App />);

    await screen.findByText('projects.indexTitle');

    const expectedLiveActions = projects.filter((project) => project.liveUrl).length;
    const featuredCoverActions = projects.filter((project) => project.featured && project.liveUrl).length;
    expect(screen.getAllByText('projects.liveDemo')).toHaveLength(expectedLiveActions + featuredCoverActions);
  });

  it('links to live projects without embedding external sites in the portfolio page', async () => {
    render(<App />);

    expect(await screen.findByRole('link', { name: 'projects.openLivePreview projects.items.nis_boutique.title' })).toHaveAttribute(
      'href',
      'https://nisboutiquecatering.com/'
    );
    expect(screen.getByRole('link', { name: 'projects.openLivePreview projects.items.online_converter.title' })).toHaveAttribute(
      'href',
      'https://online-converter.evyatarhazan.com/'
    );
    expect(screen.getByRole('link', { name: 'projects.openLivePreview projects.items.emergency_protocol.title' })).toHaveAttribute(
      'href',
      'https://bls-protocol.evyatarhazan.com/'
    );
    expect(screen.getByRole('link', { name: 'projects.openLivePreview projects.items.united_hatzalah.title' })).toHaveAttribute(
      'href',
      'https://hatzalah-shoham.evyatarhazan.com/'
    );
    expect(document.querySelector('iframe')).not.toBeInTheDocument();
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
    expect(window.location.pathname).toBe('/he/');
  });

  it('marks the active nav item with aria-current', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'nav.About' }));
    expect(screen.getByRole('link', { name: 'nav.About' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders the blog index with posts for the active language', async () => {
    renderAt('/en/blog/');

    expect(await screen.findByRole('heading', { name: 'blog.title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I built a business site around WhatsApp' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What I learned from building a credible portfolio' })).toBeInTheDocument();
    expect(document.querySelectorAll('.blog-archive-feature')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Choose a deliberate route through the work' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-reading-route]')).toHaveLength(3);
    expect(document.querySelectorAll('.blog-archive-entry')).toHaveLength(28);
    expect(screen.getByText('WRITING / Archive')).toBeInTheDocument();
  });

  it('publishes self-canonical and reciprocal language metadata', async () => {
    renderAt('/en/blog/');

    await screen.findByRole('heading', { name: 'blog.title' });
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://evyatarhazan.com/en/blog/',
    );
    expect(document.querySelector('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      'https://evyatarhazan.com/en/blog/',
    );
    expect(document.querySelector('link[rel="alternate"][hreflang="he"]')).toHaveAttribute(
      'href',
      'https://evyatarhazan.com/he/blog/',
    );
    expect(document.querySelector('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://evyatarhazan.com/en/blog/',
    );
  });

  it('preserves legacy deep-link query strings and fragments during localization', async () => {
    renderAt('/blog/catering-whatsapp?ref=legacy#summary');

    await waitFor(() => expect(window.location.pathname).toBe('/en/blog/catering-whatsapp/'));
    expect(window.location.search).toBe('?ref=legacy');
    expect(window.location.hash).toBe('#summary');
  });

  it('migrates the legacy language query into the canonical path', async () => {
    renderAt('/projects/nis_boutique?lang=he&ref=legacy#evidence');

    await waitFor(() => expect(window.location.pathname).toBe('/he/projects/nis_boutique/'));
    expect(window.location.search).toBe('?ref=legacy');
    expect(window.location.hash).toBe('#evidence');
  });

  it('renders a single blog post by slug', async () => {
    renderAt('/en/blog/catering-whatsapp/');

    expect(await screen.findByRole('heading', { name: 'How I built a business site around WhatsApp' })).toBeInTheDocument();
    expect(screen.getByText(/The solution was almost funny in its simplicity/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog.backToBlog/i })).toHaveAttribute('href', '/en/blog/');
    expect(document.querySelector('.blog-article-masthead')).toBeInTheDocument();
    expect(document.querySelector('.blog-reading-rail')).toBeInTheDocument();
    expect(document.querySelectorAll('.blog-article-next-grid a').length).toBeGreaterThan(0);
  });

  it('mounts the synthetic retry demo only in its related article', async () => {
    renderAt('/en/blog/retries-should-not-duplicate-data/');

    expect(await screen.findByRole('heading', { level: 3, name: 'Retry the same intent' })).toBeInTheDocument();
    expect(screen.getByText(/Local simulation only/)).toBeInTheDocument();
  });

  it('serves the localized interface lab with its reusable date presenter', async () => {
    renderAt('/en/lab/');

    expect(await screen.findByRole('heading', { level: 1, name: 'Small states. Serious product decisions.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'A date should inform, not interrupt.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute('href', '/en/lab/');
  });

  it('renders the closing dock as the shared site footer', () => {
    render(<App />);

    expect(document.querySelector('.closing-dock-shell')).toBeInTheDocument();
    expect(document.querySelectorAll('.brand-mark')).toHaveLength(2);
    expect(document.querySelector('.system-rail-brand .brand-mark')).toBeInTheDocument();
    expect(document.querySelector('.closing-dock-signature .brand-mark')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'footer.cta' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/972587127547')
    );
  });

  it('shows the contextual WhatsApp node after scrolling and omits it on contact routes', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    const blogView = renderAt('/en/blog/');

    expect(screen.queryByRole('link', { name: 'contactNode.ariaLabel' })).not.toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    fireEvent.scroll(window);

    expect(await screen.findByRole('link', { name: 'contactNode.ariaLabel' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/972587127547')
    );

    blogView.unmount();
    renderAt('/en/contact/');
    fireEvent.scroll(window);

    expect(screen.queryByRole('link', { name: 'contactNode.ariaLabel' })).not.toBeInTheDocument();
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('renders a featured project case study page', async () => {
    renderAt('/en/projects/online_converter/');

    expect(await screen.findByRole('heading', { name: 'projects.items.online_converter.title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '30-second overview' })).toBeInTheDocument();
    const unknownEvidence = screen.getByText('Evidence date and public sources are not yet verified.');
    expect(unknownEvidence.closest('section')?.querySelector('time')).not.toBeInTheDocument();
    expect(unknownEvidence.closest('section')?.querySelector('a')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to projects' })).toHaveAttribute('href', '/en/#projects');
    expect(screen.getByRole('link', { name: 'Source code' })).toHaveAttribute(
      'href',
      'https://github.com/Evyatar-Hazan/online-converter',
    );
    expect(screen.getByRole('link', { name: 'Live product' })).toHaveAttribute(
      'href',
      'https://online-converter.evyatarhazan.com/',
    );
    expect(screen.getByRole('heading', { name: 'Public product views' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-project-id="online_converter"] figure')).toHaveLength(2);
  });

  it('publishes factual AI provenance only on the Nis case study', async () => {
    const nisView = renderAt('/en/projects/nis_boutique/');

    expect(await screen.findByRole('heading', { name: 'Where AI assisted—and where human control stayed essential' })).toBeInTheDocument();
    expect(screen.getByText(/public records do not establish which individual lines were generated by AI/i)).toBeInTheDocument();

    nisView.unmount();
    renderAt('/en/projects/online_converter/');
    expect(screen.queryByRole('heading', { name: 'Where AI assisted—and where human control stayed essential' })).not.toBeInTheDocument();
  });

  it('discloses contact-form and advertising data use on the privacy page', () => {
    renderAt('/en/privacy/');

    expect(screen.getByRole('heading', { name: 'Advertising and Google AdSense' })).toBeInTheDocument();
    expect(screen.getByText(/FormSubmit processes the submission/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /How Google uses information from partner sites/i })).toHaveAttribute(
      'href',
      'https://policies.google.com/technologies/partner-sites'
    );
  });

  it('renders a not found state for an unknown blog post', async () => {
    renderAt('/en/blog/missing-post/');

    expect(await screen.findByRole('heading', { name: 'blog.notFoundTitle' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog.backToBlog/i })).toHaveAttribute('href', '/en/blog/');
  });

  it('renders a noindex site-level not-found page for unknown routes', () => {
    renderAt('/en/missing-route/');

    expect(screen.getByRole('heading', { name: 'This page could not be found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to the home page/i })).toHaveAttribute('href', '/en/');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(document.querySelector('link[rel="alternate"]')).not.toBeInTheDocument();
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
