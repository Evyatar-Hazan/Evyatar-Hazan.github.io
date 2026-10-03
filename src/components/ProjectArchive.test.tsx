import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import { ProjectArchive } from './ProjectArchive';
import { createProjectArchiveSlot } from './projectArchiveSlot';

const buildLocalizedPath = vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route !== 'project') throw new Error('Unexpected route target');
  return `/${language}/projects/${target.id}/`;
});

const renderArchive = (language: 'en' | 'he' = 'en', mode: 'short' | 'full' = 'short') => render(
  <MemoryRouter>
    <ProjectArchive language={language} buildLocalizedPath={buildLocalizedPath} mode={mode} />
  </MemoryRouter>,
);

describe('ProjectArchive', () => {
  it('renders a compact seven-project archive without filter controls', () => {
    renderArchive();

    expect(screen.getByRole('heading', { name: 'Project archive' })).toBeInTheDocument();
    expect(document.querySelectorAll('#project-archive [data-project-id]')).toHaveLength(7);
    expect(screen.getAllByText('Year not documented')).toHaveLength(7);
    expect(screen.getAllByText('Verification undocumented')).toHaveLength(7);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('keeps role, lifecycle evidence, and links visible in short mode', () => {
    renderArchive('en', 'short');

    const nisEntry = document.querySelector<HTMLElement>('[data-project-id="nis_boutique"]');
    expect(nisEntry).not.toBeNull();
    const entry = within(nisEntry as HTMLElement);

    expect(entry.getByText('Discovery, copy, frontend design, motion, SEO, baseline accessibility, and Vercel deployment.')).toBeInTheDocument();
    expect(entry.getByText('Verification undocumented')).toBeInTheDocument();
    expect(entry.getByRole('link', { name: /Case study/i })).toHaveAttribute('href', '/en/projects/nis_boutique/');
    expect(entry.getByRole('link', { name: /Live site/i })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(entry.getByRole('link', { name: /Code/i })).toHaveAttribute('target', '_blank');
    expect(entry.queryByText('A live business website for a boutique catering brand, guiding visitors from first impression to a WhatsApp conversation.')).not.toBeInTheDocument();
  });

  it('adds descriptive context in full mode without removing verification', () => {
    renderArchive('en', 'full');

    expect(screen.getByText('A live business website for a boutique catering brand, guiding visitors from first impression to a WhatsApp conversation.')).toBeInTheDocument();
    expect(screen.getAllByText('Verification undocumented')).toHaveLength(7);
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
  });

  it('renders the same evidence-safe structure in Hebrew and RTL', () => {
    renderArchive('he');

    const archive = screen.getByRole('heading', { name: 'ארכיון פרויקטים' }).closest('section');
    expect(archive).toHaveAttribute('dir', 'rtl');
    expect(screen.getAllByText('השנה לא תועדה')).toHaveLength(7);
    expect(screen.getAllByText('האימות לא תועד')).toHaveLength(7);
    expect(screen.getByText('אפיון, קופי, עיצוב Frontend, אנימציות, SEO, נגישות בסיסית ופריסה ל-Vercel.')).toBeInTheDocument();
  });

  it('exposes the t16 slot contract with an injected localized path builder', () => {
    const slot = createProjectArchiveSlot(buildLocalizedPath, 'short');

    expect(slot.taskId).toBe('t16');
    expect(slot.slot).toBe('projects.archive');

    render(
      <MemoryRouter>
        <slot.Component language="en" />
      </MemoryRouter>,
    );

    expect(buildLocalizedPath).toHaveBeenCalledWith('en', {
      route: 'project',
      id: 'nis_boutique',
    });
  });
});
