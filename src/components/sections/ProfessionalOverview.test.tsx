import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { localizedPath } from '../../routing/portfolioRoutes';
import ProfessionalOverview from './ProfessionalOverview';

describe('ProfessionalOverview', () => {
  it.each([
    ['en', 'Full-stack product work, shaped around the outcome.', 'Open the full professional profile'],
    ['he', 'עבודת מוצר מקצה לקצה, ממוקדת בתוצאה.', 'לפרופיל המקצועי המלא'],
  ] as const)('presents one factual overview in %s', (language, title, fullProfileLabel) => {
    const { container } = render(
      <ProfessionalOverview language={language} buildPath={localizedPath} />,
    );

    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fullProfileLabel })).toHaveAttribute('href', `/${language}/about/`);
    expect(container.querySelectorAll('#about')).toHaveLength(1);
    expect(container.querySelectorAll('[data-professional-capability]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-professional-engagement]')).toHaveLength(0);
    expect(container.querySelector('.about-capability-module')).not.toBeInTheDocument();
    expect(container.querySelector('#service-engagements')).not.toBeInTheDocument();
  });

  it('realigns the legacy #about deep link after the lazy section mounts', () => {
    window.history.replaceState({}, '', '/en/#about');
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');

    render(<ProfessionalOverview language="en" buildPath={localizedPath} />);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    scrollIntoView.mockRestore();
    window.history.replaceState({}, '', '/en/');
  });
});
