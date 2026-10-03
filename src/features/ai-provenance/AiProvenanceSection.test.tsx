import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import AiProvenanceSection from './AiProvenanceSection';
import {
  AI_PROVENANCE_PROJECT_ID,
  AI_PROVENANCE_SLOT_ID,
  AI_PROVENANCE_TASK_ID,
  aiProvenanceEvidence,
  aiProvenanceItems,
} from './aiProvenance';

const createPathBuilder = () => vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route !== 'project') return `/${language}`;
  return `/${language}/projects/${target.id}/`;
});

describe('AiProvenanceSection', () => {
  it('exports the stable integration identifiers for task 14', () => {
    expect(AI_PROVENANCE_TASK_ID).toBe('t14');
    expect(AI_PROVENANCE_SLOT_ID).toBe('content.aiProvenance');
    expect(AI_PROVENANCE_PROJECT_ID).toBe('nis_boutique');
  });

  it('renders the full English disclosure with dated public evidence', () => {
    const buildPath = createPathBuilder();
    render(<AiProvenanceSection buildPath={buildPath} language="en" />);

    const section = screen.getByRole('region', {
      name: 'Where AI assisted—and where human control stayed essential',
    });
    expect(section).toHaveAttribute('data-task-id', 't14');
    expect(section).toHaveAttribute('data-portfolio-slot', 'content.aiProvenance');
    expect(section).toHaveAttribute('data-project-id', 'nis_boutique');

    aiProvenanceItems.forEach((item) => {
      expect(within(section).getByText(item.label.en)).toBeInTheDocument();
      expect(within(section).getByText(item.full.en)).toBeInTheDocument();
    });

    expect(screen.getByText('July 22, 2026')).toHaveAttribute('datetime', '2026-07-22');
    expect(screen.getAllByRole('link')).toHaveLength(aiProvenanceEvidence.evidenceLinks.length + 1);
    expect(buildPath).toHaveBeenCalledWith('en', {
      route: 'project',
      id: 'nis_boutique',
    });
    expect(screen.getByRole('link', { name: /Read the Nis Boutique Catering case study/i }))
      .toHaveAttribute('href', '/en/projects/nis_boutique/');
  });

  it('keeps all disclosure categories, limitations, and evidence in short Hebrew mode', () => {
    const buildPath = createPathBuilder();
    const { container } = render(
      <div dir="rtl">
        <AiProvenanceSection buildPath={buildPath} language="he" mode="short" />
      </div>,
    );

    aiProvenanceItems.forEach((item) => {
      expect(screen.getByText(item.label.he)).toBeInTheDocument();
      expect(screen.getByText(item.short.he)).toBeInTheDocument();
    });

    expect(screen.getByText('22 ביולי 2026')).toHaveAttribute('datetime', '2026-07-22');
    expect(screen.getByRole('list', { name: 'מקורות ראיה ציבוריים' })).toBeInTheDocument();
    expect(container.querySelector('[data-provenance-item="limitations"]')).toBeInTheDocument();
    expect(buildPath).toHaveBeenCalledWith('he', {
      route: 'project',
      id: 'nis_boutique',
    });
  });
});
