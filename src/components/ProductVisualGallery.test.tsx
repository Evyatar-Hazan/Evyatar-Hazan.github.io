import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import ProductVisualGallery from './ProductVisualGallery';

const localizedPath = vi.fn<LocalizedPathBuilder>((language, target) => (
  target.route === 'project' ? `/${language}/projects/${target.id}/` : `/${language}/`
));

describe('ProductVisualGallery', () => {
  it('renders semantic, lazy public evidence with an injected localized route', () => {
    const { container } = render(
      <ProductVisualGallery
        projectId="online_converter"
        language="en"
        localizedPath={localizedPath}
      />,
    );

    const gallery = screen.getByRole('region', { name: 'Public product views' });
    expect(gallery).toHaveAttribute('data-project-id', 'online_converter');
    expect(gallery).toHaveAttribute('data-project-path', '/en/projects/online_converter/');
    expect(localizedPath).toHaveBeenCalledWith('en', {
      route: 'project',
      id: 'online_converter',
    });

    const figures = container.querySelectorAll('figure');
    expect(figures).toHaveLength(2);
    figures.forEach((figure) => {
      const image = within(figure).getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('decoding', 'async');
      expect(image).toHaveAttribute('width');
      expect(image).toHaveAttribute('height');
      expect(within(figure).getByRole('link', { name: 'View the public product' })).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      );
    });
  });

  it('renders Hebrew alt text and captions without changing the stable project id', () => {
    const { container } = render(
      <ProductVisualGallery
        projectId="emergency_protocol"
        language="he"
        localizedPath={localizedPath}
      />,
    );

    const gallery = screen.getByRole('region', { name: 'תצוגות ציבוריות של מוצר הלמידה' });
    expect(gallery).toHaveAttribute('data-project-id', 'emergency_protocol');
    expect(container.querySelectorAll('figcaption')).toHaveLength(2);
    expect(screen.getAllByRole('img')[0]).toHaveAccessibleName(/כלי הלמידה הציבורי/);
    expect(screen.getAllByRole('link', { name: 'צפייה במוצר הלמידה הציבורי' })).toHaveLength(2);
  });

  it('renders nothing for a featured story without approved public product visuals', () => {
    const { container } = render(
      <ProductVisualGallery
        projectId="united_hatzalah"
        language="en"
        localizedPath={localizedPath}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
