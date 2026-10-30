import { render, screen } from '@testing-library/react';
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
  it('renders every evidenced group and separates demonstrations from verified outcomes', () => {
    const { container } = render(<CapabilityProof language="en" buildPath={buildPath} />);

    expect(screen.getByRole('heading', { name: 'Trace the capability to shipped work.' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-capability-id]')).toHaveLength(6);
    expect(screen.getAllByText('Demonstrated in')).toHaveLength(6);
    expect(screen.getAllByText('Measured outcomes')).toHaveLength(6);
    expect(screen.getAllByText(/No measured outcome is published/)).toHaveLength(1);
    expect(screen.getAllByText('October 29, 2026')).toHaveLength(14);
    expect(screen.getAllByText('Verified on')).toHaveLength(14);
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

  it('does not publish AI/CV as a capability without public evidence', () => {
    const { container } = render(<CapabilityProof language="en" buildPath={buildPath} />);
    const aiGroup = container.querySelector('[data-capability-id="aiCv"]');

    expect(aiGroup).toBeNull();
    expect(screen.queryByRole('button', { name: /AI & computer vision/ })).not.toBeInTheDocument();
  });

  it('exports the approved t04 slot registration', () => {
    const registration = createCapabilityProofRegistration(buildPath);

    expect(registration.taskId).toBe('t04');
    expect(registration.slot).toBe('projects.capabilityProof');
    expect(registration.Component).toBeTypeOf('function');
  });
});
