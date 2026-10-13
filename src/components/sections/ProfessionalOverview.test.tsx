import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { localizedPath } from '../../routing/portfolioRoutes';
import ProfessionalOverview from './ProfessionalOverview';

describe('ProfessionalOverview', () => {
  it.each([
    ['en', 'Full-stack product work, shaped around the outcome.', 'A new public product or site'],
    ['he', 'עבודת מוצר מקצה לקצה, ממוקדת בתוצאה.', 'מוצר או אתר ציבורי חדש'],
  ] as const)('presents one factual overview in %s', (language, title, firstEngagement) => {
    const { container } = render(
      <ProfessionalOverview language={language} buildPath={localizedPath} />,
    );

    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: firstEngagement })).toBeInTheDocument();
    expect(container.querySelectorAll('#about')).toHaveLength(1);
    expect(container.querySelectorAll('[data-professional-capability]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-professional-engagement]')).toHaveLength(3);
    expect(container.querySelector('.about-capability-module')).not.toBeInTheDocument();
    expect(container.querySelector('#service-engagements')).not.toBeInTheDocument();
  });
});
