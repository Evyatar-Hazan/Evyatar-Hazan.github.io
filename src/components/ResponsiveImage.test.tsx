import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResponsiveImage from './ResponsiveImage';

describe('ResponsiveImage', () => {
  it('publishes AVIF and WebP candidates with an explicit responsive size contract', () => {
    const { container } = render(
      <ResponsiveImage
        source="/project-nis-boutique.webp"
        sizes="(max-width: 759px) calc(100vw - 2.5rem), 804px"
        alt="Nis Boutique public homepage"
      />,
    );

    const image = screen.getByRole('img');
    const sources = container.querySelectorAll('source');

    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[0]?.getAttribute('srcset')).toContain('480w');
    expect(sources[0]?.getAttribute('srcset')).toContain('1440w');
    expect(sources[1]).toHaveAttribute('type', 'image/webp');
    expect(image).toHaveAttribute('srcset');
    expect(image).toHaveAttribute('sizes', '(max-width: 759px) calc(100vw - 2.5rem), 804px');
    expect(image).toHaveAttribute('width', '1440');
    expect(image).toHaveAttribute('height', '900');
  });

  it('never advertises a generated candidate wider than a portrait source', () => {
    const { container } = render(
      <ResponsiveImage
        source="/case-studies/nis-boutique/mobile-home.webp"
        sizes="(max-width: 759px) calc(100vw - 2.5rem), 390px"
        alt="Nis Boutique mobile homepage"
      />,
    );

    const candidateWidths = [...container.querySelectorAll('source')]
      .flatMap((source) => source.srcset.split(', '))
      .map((candidate) => Number(candidate.match(/(\d+)w$/)?.[1]));

    expect(Math.max(...candidateWidths)).toBe(390);
  });
});
