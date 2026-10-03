import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import SignatureInteraction, {
  type SignatureInteractionStableIds,
} from './SignatureInteraction';
import stylesheet from './SignatureInteraction.module.css?raw';

const stableIds: SignatureInteractionStableIds = {
  section: 'signature-flow',
  heading: 'signature-flow-heading',
  detail: 'signature-flow-detail',
  status: 'signature-flow-status',
};

const renderInteraction = (language: PortfolioLanguage = 'en') => {
  const localizedPath = vi.fn((activeLanguage: PortfolioLanguage) => (
    `/${activeLanguage}/#projects`
  ));

  const result = render(
    <SignatureInteraction
      language={language}
      localizedPath={localizedPath}
      stableIds={stableIds}
    />,
  );

  return { ...result, localizedPath };
};

describe('SignatureInteraction', () => {
  it('renders the complete synthetic flow before any optional interaction', () => {
    const { container, localizedPath } = renderInteraction();

    expect(screen.getByRole('heading', { name: 'Follow one need through the product.' })).toBeInTheDocument();
    expect(screen.getByText('Synthetic illustration only. It sends nothing and stores nothing.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Business need/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^01 Business need/ })).toHaveAttribute('aria-controls', stableIds.detail);
    expect(screen.getByRole('button', { name: /UI/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /API/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Data/ })).toBeInTheDocument();
    expect(screen.getByText('A clearer next action, with a system path the team can still understand.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore project evidence' })).toHaveAttribute('href', '/en/#projects');
    expect(localizedPath).toHaveBeenCalledWith('en', { route: 'projects' });
    expect(container.querySelector('form, input, textarea, iframe, canvas, audio, video')).not.toBeInTheDocument();
  });

  it('supports direct selection and a deterministic manual trace', () => {
    renderInteraction();

    fireEvent.click(screen.getByRole('button', { name: /API/ }));
    expect(screen.getByText('Selected layer: API')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /API/ })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Trace next layer' }));
    expect(screen.getByText('Selected layer: Data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trace again' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Trace again' }));
    expect(screen.getByText('Selected layer: Business need')).toBeInTheDocument();
  });

  it('uses injected stable ids for the mount, heading, detail, and live status', () => {
    renderInteraction();

    const section = document.getElementById(stableIds.section);
    expect(section).toHaveAttribute('aria-labelledby', stableIds.heading);
    expect(document.getElementById(stableIds.heading)).toHaveTextContent('Follow one need through the product.');
    expect(document.getElementById(stableIds.detail)).toHaveAttribute('aria-live', 'polite');
    expect(document.getElementById(stableIds.status)).toHaveTextContent('Selected layer: Business need');
  });

  it('renders the Hebrew copy and RTL direction without changing stable identifiers', () => {
    const { localizedPath } = renderInteraction('he');

    expect(document.getElementById(stableIds.section)).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('heading', { name: 'עקבו אחרי צורך אחד לאורך המוצר.' })).toBeInTheDocument();
    expect(screen.getByText('המחשה סינתטית בלבד. היא לא שולחת ולא שומרת דבר.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'לצפייה בראיות מהפרויקטים' })).toHaveAttribute('href', '/he/#projects');
    expect(localizedPath).toHaveBeenCalledWith('he', { route: 'projects' });
  });

  it('defines a reduced-motion path and mobile layout in the scoped stylesheet', () => {
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).toContain('@media (max-width: 760px)');
    expect(stylesheet).toContain('transition-duration: 0.01ms !important');
  });
});
