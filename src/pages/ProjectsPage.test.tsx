import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../data/profile';

const changeLanguageMock = vi.fn().mockResolvedValue(undefined);
let currentLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: currentLanguage, changeLanguage: changeLanguageMock },
  }),
}));

import App from '../App';

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

const archiveRow = (projectId: string) => {
  const row = document.querySelector<HTMLElement>(`[data-project-id="${projectId}"]`);
  expect(row).not.toBeNull();
  return row!;
};

beforeEach(() => {
  currentLanguage = 'en';
  window.history.pushState({}, '', '/en/projects/');
  changeLanguageMock.mockClear();
});

describe('ProjectsPage', () => {
  it.each(['en', 'he'] as const)('renders the canonical %s project hub and all seven archive entries', async (language) => {
    currentLanguage = language;
    renderAt(`/${language}/projects/`);

    expect(await screen.findByRole('heading', { level: 1, name: 'projectsHub.title' })).toBeInTheDocument();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelectorAll('[data-hub-featured-project]')).toHaveLength(4);
    expect(document.querySelectorAll('[data-project-id]')).toHaveLength(7);
    expect(document.querySelectorAll('[data-lifecycle="active"]')).toHaveLength(9);
    expect(document.querySelectorAll('[data-lifecycle="historical"]')).toHaveLength(2);
    expect(within(archiveRow('password_gen')).getByLabelText(/projectsHub\.lifecycleNote\.historical/)).toHaveTextContent('projectsHub.lifecycle.historical');
    expect(within(archiveRow('nis_boutique')).getByLabelText(/projectsHub\.lifecycleNote\.active/)).toHaveTextContent('projectsHub.lifecycle.active');
    expect(screen.getAllByRole('link', { name: 'nav.Projects' })[0]).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByRole('link', { name: 'nav.Projects' }).some((link) => link.getAttribute('href') === `/${language}/projects/`)).toBe(true);
  });

  it('shows only actions backed by canonical project URLs', async () => {
    renderAt('/en/projects/');
    await screen.findByRole('heading', { level: 1, name: 'projectsHub.title' });

    for (const project of projects) {
      const row = within(archiveRow(project.id));
      expect(row.queryByRole('link', { name: 'projects.caseStudy' }) !== null).toBe(Boolean(project.caseStudy));
      expect(row.queryByRole('link', { name: 'projectsHub.liveProduct' }) !== null).toBe(Boolean(project.liveUrl));
      expect(row.queryByRole('link', { name: 'projects.code' }) !== null).toBe(Boolean(project.githubUrl));
    }
  });

  it('filters by category, capability, and their combination while preserving unrelated query state', async () => {
    renderAt('/en/projects/?ref=portfolio');
    await screen.findByRole('heading', { level: 1, name: 'projectsHub.title' });

    const capabilityOptions = within(screen.getByLabelText('projectsHub.capabilityFilter'))
      .getAllByRole('option')
      .map((option) => option.getAttribute('value'));
    expect(capabilityOptions).toEqual(['', 'webMobile', 'languages', 'devops', 'databases', 'methodologies']);
    expect(capabilityOptions).not.toContain('React');

    fireEvent.change(screen.getByLabelText('projectsHub.categoryFilter'), { target: { value: 'fullstack' } });
    expect(document.querySelectorAll('[data-project-id]')).toHaveLength(2);
    expect(window.location.search).toContain('ref=portfolio');
    expect(window.location.search).toContain('category=fullstack');

    fireEvent.change(screen.getByLabelText('projectsHub.capabilityFilter'), { target: { value: 'languages' } });
    expect(document.querySelectorAll('[data-project-id]')).toHaveLength(1);
    expect(window.location.search).toContain('capability=languages');

    fireEvent.change(screen.getByLabelText('projectsHub.capabilityFilter'), { target: { value: 'databases' } });
    expect(screen.getByRole('heading', { name: 'projectsHub.emptyTitle' })).toBeInTheDocument();
    expect(screen.getByText('projectsHub.resultCount')).toHaveAttribute('aria-live', 'polite');

    fireEvent.click(screen.getByRole('button', { name: 'projectsHub.resetFilters' }));
    expect(document.querySelectorAll('[data-project-id]')).toHaveLength(7);
    expect(window.location.search).toBe('?ref=portfolio');

    window.history.back();
    window.dispatchEvent(new PopStateEvent('popstate'));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'projectsHub.emptyTitle' })).toBeInTheDocument());
  });

  it('sanitizes invalid query values and invalid project IDs without dropping unrelated parameters', async () => {
    renderAt('/en/projects/?category=unknown&capability=Nope&compare=bad,nis_boutique,bad&ref=safe');

    await waitFor(() => expect(window.location.search).toBe('?compare=nis_boutique&ref=safe'));
    expect(screen.getByLabelText('projectsHub.categoryFilter')).toHaveValue('');
    expect(screen.getByLabelText('projectsHub.capabilityFilter')).toHaveValue('');
    expect(screen.getByText('projectsHub.compareOne')).toBeInTheDocument();
  });

  it('selects two and three projects, blocks a fourth, and supports removal and clearing', () => {
    renderAt('/en/projects/');

    const select = (id: string) => fireEvent.click(within(archiveRow(id)).getByRole('button', { name: 'projectsHub.addToComparison' }));
    select('nis_boutique');
    expect(screen.getByText('projectsHub.compareOne')).toBeInTheDocument();
    select('online_converter');
    expect(document.querySelectorAll('.projects-hub-comparison-grid > article')).toHaveLength(2);
    select('emergency_protocol');
    expect(document.querySelectorAll('.projects-hub-comparison-grid > article')).toHaveLength(3);
    select('united_hatzalah');
    expect(screen.getByText('projectsHub.compareLimit')).toBeInTheDocument();
    expect(window.location.search).not.toContain('united_hatzalah');

    const selectedRow = within(archiveRow('nis_boutique'));
    expect(selectedRow.getByRole('button', { name: 'projectsHub.removeFromComparison' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(selectedRow.getByRole('button', { name: 'projectsHub.removeFromComparison' }));
    expect(document.querySelectorAll('.projects-hub-comparison-grid > article')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'projectsHub.clearComparison' }));
    expect(document.querySelector('.projects-hub-comparison-grid')).not.toBeInTheDocument();
    expect(window.location.search).toBe('');
  });

  it('preserves the project route and query when changing language', () => {
    renderAt('/en/projects/?category=tool&ref=language');
    fireEvent.click(screen.getAllByRole('button', { name: 'shell.languageSwitch' })[0]);

    expect(window.location.pathname).toBe('/he/projects/');
    expect(window.location.search).toBe('?category=tool&ref=language');
    expect(changeLanguageMock).toHaveBeenCalledWith('he');
  });

  it('redirects the unlocalized project hub without colliding with legacy project detail routes', async () => {
    renderAt('/projects/?lang=he&ref=legacy');
    await waitFor(() => expect(window.location.pathname).toBe('/he/projects/'));
    expect(window.location.search).toBe('?ref=legacy');
  });
});
