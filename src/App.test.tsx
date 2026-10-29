import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { projects } from './data/profile';
import { caseStudyStoryProjectIds } from './data/caseStudyStories';
import { homepageSectionPurposes } from './contracts/portfolio';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { localizedPath } from './routing/portfolioRoutes';
import {
  routeQaLanguages,
  routeQaMatrix,
  routeQaThemes,
} from './routing/routeQaMatrix';

const changeLanguageMock = vi.fn().mockResolvedValue(undefined);
let currentLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: currentLanguage, changeLanguage: changeLanguageMock },
  }),
}));

import App from './App';

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

beforeEach(() => {
  currentLanguage = 'en';
  window.history.pushState({}, '', '/en/');
  changeLanguageMock.mockClear();
  window.localStorage.clear();
  document.body.removeAttribute('style');
  document.documentElement.classList.remove('dark');
});

describe('App', () => {
  const routeQaCases = routeQaMatrix
    .flatMap(({ id: routeId, samples }) => (
      samples.map(({ id: sampleId, target, readySelector }) => ({
        readySelector,
        routeId,
        sampleId,
        target,
      }))
    ))
    .map((sample, index) => ({
      ...sample,
      language: routeQaLanguages[index % routeQaLanguages.length],
      theme: routeQaThemes[index % routeQaThemes.length],
    }));

  it.each(routeQaCases)(
    'applies the FIX-003 matrix to $routeId/$sampleId in $language $theme',
    async ({ language, readySelector, target, theme }) => {
      currentLanguage = language;
      window.localStorage.setItem('theme', theme);
      const expectedPath = localizedPath(language, target);

      renderAt(expectedPath);

      await waitFor(() => expect(document.querySelector(readySelector)).toBeInTheDocument());
      await waitFor(() => expect(document.documentElement).toHaveClass(theme));
      expect(window.location.pathname).toBe(expectedPath);
      expect(document.documentElement).toHaveAttribute('lang', language);
      expect(document.documentElement).toHaveAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
      expect(document.querySelectorAll('main')).toHaveLength(1);
      expect(document.querySelector('#main-content')).toContainElement(document.querySelector(readySelector));
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://evyatarhazan.com${expectedPath}`,
      );
      expect(screen.getAllByRole('button', { name: 'shell.languageSwitch' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: theme === 'dark' ? 'shell.theme.useLight' : 'shell.theme.useDark' }).length).toBeGreaterThan(0);
    },
  );

  it('renders the main navigation and hero section', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: 'shell.primaryNavigation' })).toBeInTheDocument();
    expect(document.querySelector('.system-rail-header')).toBeInTheDocument();
    expect(document.querySelector('#home')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'nav.Blog' })[0]).toHaveAttribute('href', '/en/blog/');
  });

  it('provides one translated skip target and moves focus to the single main landmark', async () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: 'shell.skipToContent' });
    const main = document.querySelector<HTMLElement>('#main-content');
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(document.querySelectorAll('main')).toHaveLength(1);
    expect(document.querySelectorAll('#main-content')).toHaveLength(1);

    fireEvent.click(skipLink);
    await waitFor(() => expect(document.activeElement).toBe(main));
  });

  it('moves route-entry focus to the main landmark when no fragment is present', async () => {
    renderAt('/en/contact/');

    await waitFor(() => expect(document.activeElement).toBe(document.querySelector('#main-content')));
  });

  it('keeps ordinary and modified navigation clicks native', () => {
    render(<App />);
    const blogLink = screen.getAllByRole('link', { name: 'nav.Blog' })[0];
    const modifiedClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });

    let preventedByApplication = true;
    blogLink.addEventListener('click', (event) => {
      preventedByApplication = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });

    blogLink.dispatchEvent(modifiedClick);
    expect(preventedByApplication).toBe(false);
  });

  it('implements the mobile navigation as a modal with focus trap, inert background, Escape, and focus return', async () => {
    document.body.setAttribute('style', 'overflow: clip; color: red;');
    render(<App />);

    const trigger = screen.getByRole('button', { name: 'shell.menu.open' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'shell.menu.label' });
    const content = document.querySelector('#site-shell-content');
    const closeButton = within(dialog).getByRole('button', { name: 'shell.menu.close' });
    const lastLink = within(dialog).getByRole('link', { name: 'nav.Privacy' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(content).toHaveAttribute('inert');
    expect(content).toHaveAttribute('aria-hidden', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() => expect(document.activeElement).toBe(closeButton));

    lastLink.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);
    closeButton.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastLink);

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
    expect(content).not.toHaveAttribute('inert');
    expect(content).not.toHaveAttribute('aria-hidden');
    expect(document.body.getAttribute('style')).toBe('overflow: clip; color: red;');
    document.body.removeAttribute('style');
  });

  it('renders the mobile sheet masthead, ordered navigation, Contact CTA, and bottom secondary links', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));

    const dialog = screen.getByRole('dialog', { name: 'shell.menu.label' });
    const primaryLinks = Array.from(dialog.querySelectorAll<HTMLAnchorElement>('.system-rail-mobile-link'));

    expect(dialog.querySelector('.system-rail-mobile-masthead .brand-mark')).toBeInTheDocument();
    const closeButton = within(dialog).getByRole('button', { name: 'shell.menu.close' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('shell.menu.closeLabel');
    expect(primaryLinks.map((link) => link.getAttribute('aria-label'))).toEqual([
      'nav.Home', 'nav.Projects', 'nav.About', 'nav.Blog', 'nav.Contact',
    ]);
    expect(primaryLinks.map((link) => link.querySelector('.system-rail-mobile-index')?.textContent)).toEqual([
      '01', '02', '03', '04', '05',
    ]);
    expect(within(dialog).getByRole('link', { name: 'nav.Contact' })).toHaveClass('is-contact');
    expect(within(dialog).queryByRole('button', { name: 'shell.languageSwitch' })).not.toBeInTheDocument();
    expect(dialog.querySelector('.system-rail-mobile-theme')).not.toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'nav.Lab' })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'nav.Privacy' })).toBeInTheDocument();
  });

  it('keeps the mobile language and theme controls fixed before, during, and after the sheet', async () => {
    render(<App />);

    const actions = document.querySelector<HTMLElement>('.system-rail-mobile-actions')!;
    const themeButton = actions.querySelector<HTMLButtonElement>('.system-rail-icon')!;
    const languageButton = actions.querySelector<HTMLButtonElement>('.system-rail-mobile-language')!;
    const readRects = () => [themeButton, languageButton].map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
      };
    });
    const before = readRects();

    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));
    expect(readRects()).toEqual(before);
    expect(themeButton).toBeDisabled();
    expect(languageButton).toBeDisabled();

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'shell.menu.close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(readRects()).toEqual(before);
    expect(themeButton).toBeEnabled();
    expect(languageButton).toBeEnabled();
  });

  it('keeps modified mobile navigation clicks native', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));
    const blogLink = within(screen.getByRole('dialog')).getByRole('link', { name: 'nav.Blog' });
    const modifiedClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });

    let preventedByApplication = true;
    blogLink.addEventListener('click', (event) => {
      preventedByApplication = event.defaultPrevented;
      event.preventDefault();
    }, { once: true });

    blogLink.dispatchEvent(modifiedClick);
    expect(preventedByApplication).toBe(false);
  });

  it('closes the mobile navigation after a route change', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    window.history.pushState({}, '', '/en/blog/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('exposes the same translated theme state on desktop and mobile controls', () => {
    render(<App />);
    const themeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.system-rail-icon'));

    expect(themeButtons).toHaveLength(2);
    expect(new Set(themeButtons.map((button) => button.getAttribute('aria-label'))).size).toBe(1);
    expect(new Set(themeButtons.map((button) => button.getAttribute('aria-pressed'))).size).toBe(1);
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

  it.each(['en', 'he'] as const)('renders the focused four-section homepage in %s', async (language) => {
    currentLanguage = language;
    window.history.pushState({}, '', `/${language}/`);
    render(<App />);

    await screen.findByRole('heading', { name: 'blogPreview.title1 blogPreview.title2' }, { timeout: 10_000 });
    await screen.findByText('PROJECT HANDOFF / 01');

    const mainSections = Array.from(document.querySelectorAll('main > section[id]'));
    expect(mainSections.map((section) => section.id)).toEqual(
      homepageSectionPurposes.map(({ id }) => id),
    );
    await waitFor(() => {
      const journeySections = Array.from(document.querySelectorAll('main > section[id]'));
      expect(journeySections.map((section) => section.getAttribute('data-reader-journey-stage'))).toEqual([
        'value',
        'proof',
        'content',
        'contact',
      ]);
    });

    homepageSectionPurposes.forEach(({ id }) => {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    });
    [
      'audience-paths',
      'service-engagements',
      'current-focus',
      'human-about',
      'system-trace',
      'working-principles',
      'flagship-comparison',
      'project-archive',
      'capability-proof',
    ].forEach((id) => {
      expect(document.querySelector(`#${id}`)).not.toBeInTheDocument();
    });

    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelectorAll('[data-professional-capability]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-professional-engagement]')).toHaveLength(0);
    expect(screen.getByRole('navigation', {
      name: language === 'he' ? 'מה תרצו למצוא כאן?' : 'What are you here to explore?',
    })).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: language === 'he' ? 'לדבר על מוצר או מערכת' : 'Discuss a product or system',
    })).toHaveAttribute('href', `/${language}/contact/`);
    expect(screen.getByRole('link', {
      name: language === 'he' ? 'לצפייה בעבודות נבחרות' : 'Review selected work',
    })).toHaveAttribute('href', `/${language}/projects/`);
    expect(screen.getByRole('link', {
      name: language === 'he' ? 'לקריאת הכתיבה הטכנית' : 'Read the technical notes',
    })).toHaveAttribute('href', `/${language}/blog/`);
    expect(screen.getAllByRole('link', { name: 'nav.Projects' }).some((link) => link.getAttribute('href') === `/${language}/projects/`)).toBe(true);
    expect(screen.getAllByRole('link', { name: 'nav.About' }).some((link) => link.getAttribute('href') === `/${language}/about/`)).toBe(true);
    expect(screen.getAllByRole('link', { name: 'nav.Contact' }).some((link) => link.getAttribute('href') === `/${language}/contact/`)).toBe(true);
    expect(document.querySelector('#about')).not.toBeInTheDocument();
  });

  it.each(['en', 'he'] as const)('renders the evidence-backed About route in %s', async (language) => {
    currentLanguage = language;
    renderAt(`/${language}/about/`);

    expect(await screen.findByRole('heading', { level: 1, name: language === 'he' ? 'אביתר חזן' : 'Evyatar Hazan' })).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'GitHub' }).some((link) => link.getAttribute('href') === 'https://github.com/Evyatar-Hazan')).toBe(true);
    expect(screen.getAllByRole('link', { name: 'LinkedIn' }).some((link) => link.getAttribute('href') === 'https://www.linkedin.com/in/evyatar-hazan-662235210/')).toBe(true);
    expect(screen.getByRole('link', { name: language === 'he' ? 'לצפייה בראיות מהפרויקטים' : 'View project evidence' })).toHaveAttribute('href', `/${language}/projects/`);
    expect(screen.getByRole('link', { name: language === 'he' ? 'להתחיל שיחה' : 'Start a conversation' })).toHaveAttribute('href', `/${language}/contact/`);
    expect(document.querySelectorAll('[aria-controls="capability-panel"]')).toHaveLength(7);
    expect(document.querySelector('#delivery-process-title')?.closest('section')?.querySelectorAll('ol > li')).toHaveLength(5);
    expect(document.querySelectorAll('#working-principles [data-principle-id]')).toHaveLength(4);
    expect(document.querySelectorAll('#service-engagements > div > ol > li')).toHaveLength(3);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it('restores capability state from valid and invalid query values and updates browser history', async () => {
    renderAt('/en/about/?capability=automation&ref=profile#capability-explorer-title');

    await waitFor(() => expect(document.querySelector('#capability-panel')).toHaveAttribute('data-capability-id', 'automation'));
    expect(screen.getByText(/do not publicly verify every named device-automation tool/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /AI & computer vision/ }));
    expect(window.location.search).toContain('capability=aiCv');
    expect(window.location.search).toContain('ref=profile');
    expect(window.location.hash).toBe('#capability-explorer-title');
    expect(document.querySelector('#capability-panel')).toHaveAttribute('data-capability-id', 'aiCv');
    expect(screen.getByText(/No canonical public project or article/i)).toBeInTheDocument();

    window.history.pushState({}, '', '/en/about/?capability=missing');
    fireEvent.popState(window);
    await waitFor(() => expect(document.querySelector('#capability-panel')).toHaveAttribute('data-capability-id', 'webMobile'));
  });

  it('publishes one conservative Person JSON-LD record on About only', async () => {
    const view = renderAt('/en/about/');
    await screen.findByRole('heading', { level: 1, name: 'Evyatar Hazan' });
    const scripts = document.querySelectorAll('#person-profile-structured-data');
    expect(scripts).toHaveLength(1);
    const person = JSON.parse(scripts[0].textContent ?? '{}');

    expect(person).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Evyatar Hazan',
      url: 'https://evyatarhazan.com/en/about/',
      jobTitle: 'Full Stack Developer',
      sameAs: [
        'https://github.com/Evyatar-Hazan',
        'https://www.linkedin.com/in/evyatar-hazan-662235210/',
      ],
    });
    ['employer', 'alumniOf', 'award', 'credential', 'address', 'telephone', 'knowsAbout'].forEach((field) => expect(person).not.toHaveProperty(field));

    view.unmount();
    expect(document.querySelector('#person-profile-structured-data')).not.toBeInTheDocument();
  });

  it('redirects the legacy About route while preserving query and hash', async () => {
    renderAt('/about/?lang=he&capability=databases#capability-explorer-title');

    await waitFor(() => expect(window.location.pathname).toBe('/he/about/'));
    expect(window.location.search).toBe('?capability=databases');
    expect(window.location.hash).toBe('#capability-explorer-title');
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

  it('renders one flagship, three supporting projects, and the standalone project index', async () => {
    render(<App />);

    const featuredIds = projects.filter((project) => project.featured).map((project) => project.id);
    expect(featuredIds).toEqual([
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
    ]);

    for (const project of projects.filter((candidate) => candidate.featured)) {
      expect(await screen.findAllByText(`projects.items.${project.id}.title`)).not.toHaveLength(0);
    }

    expect(screen.getByText('projects.viewAllTitle')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'projects.viewAllCta' })).toHaveAttribute('href', '/en/projects/');
    expect(screen.getAllByText('projects.caseStudy').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[data-featured-project]')).toHaveLength(1);
    expect(document.querySelector('[data-featured-project="nis_boutique"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-supporting-project]')).toHaveLength(3);
    featuredIds.slice(1).forEach((projectId) => {
      expect(document.querySelector(`[data-supporting-project="${projectId}"]`)).toBeInTheDocument();
    });
    expect(document.querySelector('.project-scroll-stage')).not.toBeInTheDocument();
    expect(document.querySelector('.project-secondary-index')).not.toBeInTheDocument();
    expect(document.querySelector('#project-archive')).not.toBeInTheDocument();
  });

  it.each(['en', 'he'] as const)('uses the correct %s case-study links for all featured cards', async (language) => {
    currentLanguage = language;
    window.history.pushState({}, '', `/${language}/`);
    render(<App />);

    await screen.findByText('projects.viewAllTitle');

    projects.filter((project) => project.featured).forEach((project) => {
      const card = document.querySelector<HTMLElement>(
        `[data-featured-project="${project.id}"], [data-supporting-project="${project.id}"]`,
      );
      expect(card).not.toBeNull();
      expect(within(card!).getByRole('link', { name: 'projects.caseStudy' })).toHaveAttribute(
        'href',
        `/${language}/projects/${project.id}/`,
      );
    });
  });

  it('shows featured live and code links only when their canonical URLs exist', async () => {
    render(<App />);

    await screen.findByText('projects.viewAllTitle');

    projects.filter((project) => project.featured).forEach((project) => {
      const card = document.querySelector<HTMLElement>(
        `[data-featured-project="${project.id}"], [data-supporting-project="${project.id}"]`,
      );
      expect(card).not.toBeNull();
      const cardQueries = within(card!);

      if (project.liveUrl) {
        expect(cardQueries.getByRole('link', { name: `projects.liveDemo projects.items.${project.id}.title` })).toHaveAttribute('href', project.liveUrl);
      } else {
        expect(cardQueries.queryByRole('link', { name: `projects.liveDemo projects.items.${project.id}.title` })).not.toBeInTheDocument();
      }

      if (project.githubUrl) {
        expect(cardQueries.getByRole('link', { name: `projects.code projects.items.${project.id}.title` })).toHaveAttribute('href', project.githubUrl);
      } else {
        expect(cardQueries.queryByRole('link', { name: `projects.code projects.items.${project.id}.title` })).not.toBeInTheDocument();
      }
    });
  });

  it('surfaces recent writing on the home page', async () => {
    render(<App />);

    expect(await screen.findByText('blogPreview.eyebrow')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blogPreview.viewAll/i })).toHaveAttribute('href', '/en/blog/');
    expect(screen.getByRole('heading', { name: 'A focus test needs an unfocused baseline' })).toBeInTheDocument();
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
    expect(screen.getByLabelText('Message review')).toHaveAttribute('readonly');
  });

  it('only renders live links for projects with a liveUrl', async () => {
    render(<App />);

    await screen.findByText('projects.viewAllTitle');

    const expectedLiveActions = projects.filter((project) => project.featured && project.liveUrl).length;
    const featuredCoverActions = document.querySelectorAll(
      '[data-featured-project] .featured-case-card__media > span',
    ).length;
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
    document.body.style.overflow = 'clip';
    render(<App />);

    const menuToggle = screen.getByRole('button', { name: 'shell.menu.open' });
    fireEvent.click(menuToggle);

    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'shell.menu.close' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'shell.menu.close' }));
    expect(document.body.style.overflow).toBe('clip');
    document.body.removeAttribute('style');
  });

  it('compensates a classic scrollbar before locking scroll and restores the exact body style', () => {
    const clientWidth = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(window.innerWidth - 15);
    document.body.setAttribute('style', 'overflow: clip; padding-right: 8px; color: red;');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('23px');

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'shell.menu.close' }));
    expect(document.body.getAttribute('style')).toBe('overflow: clip; padding-right: 8px; color: red;');

    clientWidth.mockRestore();
    document.body.removeAttribute('style');
  });

  it('updates i18n and localStorage when language toggle is clicked', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    render(<App />);

    const languageButtons = screen.getAllByRole('button', { name: 'shell.languageSwitch' });
    fireEvent.click(languageButtons[0]);

    expect(setItemSpy).toHaveBeenCalledWith('i18nextLng', 'he');
    expect(changeLanguageMock).toHaveBeenCalledWith('he');
    expect(window.location.pathname).toBe('/he/');
  });

  it('marks the active nav item with aria-current', () => {
    renderAt('/en/about/');

    expect(screen.getAllByRole('link', { name: 'nav.About' })[0]).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the parent nav item active on nested project and article routes', () => {
    const projectView = renderAt('/he/projects/online_converter/');

    const primaryNavigation = screen.getByRole('navigation', { name: 'shell.primaryNavigation' });
    expect(within(primaryNavigation).getByRole('link', { name: 'nav.Projects' }))
      .toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'nav.Projects' }))
      .toHaveAttribute('aria-current', 'page');

    projectView.unmount();
    renderAt('/en/blog/catering-whatsapp/');

    expect(within(screen.getByRole('navigation', { name: 'shell.primaryNavigation' }))
      .getByRole('link', { name: 'nav.Blog' }))
      .toHaveAttribute('aria-current', 'page');
  });

  it('renders the blog index with posts for the active language', async () => {
    renderAt('/en/blog/');

    expect(await screen.findByRole('heading', { name: 'blog.title' })).toBeInTheDocument();
    expect(document.querySelectorAll('.blog-archive-feature')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Choose a deliberate route through the work' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-reading-route]')).toHaveLength(3);
    expect(document.querySelectorAll('.blog-archive-entry')).toHaveLength(12);
    fireEvent.click(screen.getByRole('button', { name: /blog\.library\.loadMore/ }));
    fireEvent.click(screen.getByRole('button', { name: /blog\.library\.loadMore/ }));
    expect(screen.getByRole('heading', { name: 'How I built a business site around WhatsApp' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What I learned from building a credible portfolio' })).toBeInTheDocument();
    expect(screen.getByText('shell.context.writing')).toBeInTheDocument();
    expect(screen.getByText('shell.context.library')).toBeInTheDocument();
  });

  it('preserves blog library query state when switching language', async () => {
    renderAt('/en/blog/?q=frontend&topic=Product&ref=campaign');

    fireEvent.click(screen.getAllByRole('button', { name: 'shell.languageSwitch' })[0]);

    expect(window.location.pathname).toBe('/he/blog/');
    expect(window.location.search).toBe('?q=frontend&topic=Product&ref=campaign');
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
    expect(screen.getAllByRole('link', { name: 'nav.Lab' }).some((link) => link.getAttribute('href') === '/en/lab/')).toBe(true);
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
    const headerDestinations = Array.from(document.querySelectorAll<HTMLAnchorElement>('.system-rail-links a'))
      .map((link) => link.getAttribute('href'));
    const footerNavigation = screen.getByRole('navigation', { name: 'footer.navigation' });
    const footerDestinations = within(footerNavigation).getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(footerDestinations.slice(0, headerDestinations.length)).toEqual(headerDestinations);
    expect(footerDestinations).toEqual([
      '/en/',
      '/en/projects/',
      '/en/about/',
      '/en/blog/',
      '/en/contact/',
      '/en/lab/',
      '/en/privacy/',
    ]);
    expect(new Set(footerDestinations).size).toBe(footerDestinations.length);
    expect(within(footerNavigation).getByRole('link', { name: 'nav.Home' }))
      .toHaveAttribute('aria-current', 'page');
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
    expect(screen.getByRole('heading', { name: 'Executive summary' })).toBeInTheDocument();
    expect(screen.getByText('Contribution')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText('Limitations')).toBeInTheDocument();
    const executiveSummary = document.querySelector('[data-executive-summary="online_converter"]');
    expect(executiveSummary).not.toBeNull();
    expect(within(executiveSummary as HTMLElement).getByText(/do not prove traffic, adoption, or revenue/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Problem' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Decision' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Execution' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Outcome' })).toBeInTheDocument();
    expect(screen.getAllByText('Public evidence not yet verified').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/en/projects/');
    expect(screen.getByRole('link', { name: 'View source code' })).toHaveAttribute(
      'href',
      'https://github.com/Evyatar-Hazan/online-converter',
    );
    expect(screen.getByRole('link', { name: 'View live product' })).toHaveAttribute(
      'href',
      'https://online-converter.evyatarhazan.com/',
    );
    expect(screen.getByRole('heading', { name: 'Public product views' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-project-id="online_converter"] figure')).toHaveLength(2);
  });

  it('uses the same problem-decision-execution-outcome structure for all four projects', async () => {
    for (const projectId of caseStudyStoryProjectIds) {
      const view = renderAt(`/en/projects/${projectId}/`);
      const story = await screen.findByRole('article');

      expect(story).toHaveAttribute('data-case-study-template', 'product-story-v1');
      expect(story).toHaveAttribute('data-case-study-structure', 'problem-decision-execution-outcome');
      expect(within(story).getByRole('heading', { name: 'Executive summary' })).toBeVisible();
      expect(story.querySelector(`[data-executive-summary="${projectId}"]`)).toBeInTheDocument();

      const coreHeadings = within(story)
        .getAllByRole('heading', { level: 2 })
        .filter((heading) => ['Problem', 'Decision', 'Execution', 'Outcome'].includes(heading.textContent ?? ''));
      expect(coreHeadings.map((heading) => heading.textContent)).toEqual([
        'Problem',
        'Decision',
        'Execution',
        'Outcome',
      ]);
      coreHeadings.forEach((heading) => expect(heading).toBeVisible());

      const appendix = story.querySelector('details');
      expect(appendix).not.toHaveAttribute('open');
      expect(story.querySelectorAll('details')).toHaveLength(1);
      expect(story.querySelector('#challenge')).not.toBe(appendix);
      expect(story.querySelector('#decisions')).not.toBe(appendix);
      expect(story.querySelector('#system')).not.toBe(appendix);
      expect(story.querySelector('#evidence')).not.toBe(appendix);

      view.unmount();
    }
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

  it('closes the mobile menu from the backdrop and restores focus to the trigger', async () => {
    render(<App />);

    const trigger = screen.getByRole('button', { name: 'shell.menu.open' });
    fireEvent.click(trigger);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByTestId('mobile-menu-backdrop'));
    expect(screen.getByRole('button', { name: 'shell.menu.open' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('restores body scroll when app unmounts with mobile menu open', () => {
    document.body.style.overflow = 'scroll';
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'shell.menu.open' }));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.removeAttribute('style');
  });
});
