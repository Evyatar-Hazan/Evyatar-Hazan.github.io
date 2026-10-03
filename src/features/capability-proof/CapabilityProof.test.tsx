import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { CapabilityProof } from './CapabilityProof';
import { createCapabilityProofRegistration } from './registration';

const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route === 'article') return `/${language}/blog/${target.id}`;
  if (target.route === 'project') return `/${language}/projects/${target.id}`;
  return `/${language}/${target.route}`;
});

describe('CapabilityProof', () => {
  it('renders all groups and separates demonstrations from unpublished outcomes', () => {
    const { container } = render(<CapabilityProof language="en" buildPath={buildPath} />);

    expect(screen.getByRole('heading', { name: 'Trace the capability to shipped work.' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-capability-id]')).toHaveLength(7);
    expect(screen.getAllByText('Demonstrated in')).toHaveLength(7);
    expect(screen.getAllByText('Measured outcomes')).toHaveLength(7);
    expect(screen.getAllByText(/No measured outcome is published/)).toHaveLength(7);
  });

  it('uses the localized path helper for internal project and article links', () => {
    render(<CapabilityProof language="he" buildPath={buildPath} />);

    screen.getAllByRole('link', { name: /Nis Boutique Catering/i }).forEach((link) => {
      expect(link).toHaveAttribute('href', '/he/projects/nis_boutique');
    });
    expect(screen.getByRole('link', { name: /איך בניתי אתר עסקי שמוביל ל-WhatsApp/i })).toHaveAttribute(
      'href',
      '/he/blog/catering-whatsapp',
    );
  });

  it('uses the canonical source URL for projects without an internal case study', () => {
    render(<CapabilityProof language="en" buildPath={buildPath} />);

    screen.getAllByRole('link', { name: /Test Yourself/i }).forEach((projectLink) => {
      expect(projectLink).toHaveAttribute('href', 'https://github.com/Evyatar-Hazan/test-yourself');
      expect(projectLink).toHaveAttribute('target', '_blank');
      expect(projectLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('states the AI/CV evidence gap without creating a false result', () => {
    const { container } = render(<CapabilityProof language="en" buildPath={buildPath} />);
    const aiGroup = container.querySelector('[data-capability-id="aiCv"]');

    expect(aiGroup).not.toBeNull();
    expect(within(aiGroup as HTMLElement).getByText(/No canonical public project or article/)).toBeInTheDocument();
    expect(within(aiGroup as HTMLElement).getByText(/No measured outcome is published/)).toBeInTheDocument();
    expect(within(aiGroup as HTMLElement).queryByRole('link')).not.toBeInTheDocument();
  });

  it('exports the approved t04 slot registration', () => {
    const registration = createCapabilityProofRegistration(buildPath);

    expect(registration.taskId).toBe('t04');
    expect(registration.slot).toBe('projects.capabilityProof');
    expect(registration.Component).toBeTypeOf('function');
  });
});
