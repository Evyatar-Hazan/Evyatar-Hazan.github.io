import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import RelatedContentLinks from './RelatedContentLinks';

const targetId = (target: Parameters<LocalizedPathBuilder>[1]) => (
  'id' in target ? target.id : target.route
);

const renderLinks = (
  language: 'en' | 'he',
  buildPath: LocalizedPathBuilder,
) => render(
  <MemoryRouter>
    <RelatedContentLinks
      buildPath={buildPath}
      heading={language === 'he' ? 'תוכן קשור' : 'Related content'}
      items={[
        {
          target: { route: 'article', id: 'catering-whatsapp' },
          label: language === 'he'
            ? 'איך בניתי אתר עסקי שמוביל ל-WhatsApp'
            : 'How I built a business site around WhatsApp',
        },
        {
          target: { route: 'project', id: 'nis_boutique' },
          label: 'Nis Boutique Catering',
        },
      ]}
      language={language}
    />
  </MemoryRouter>,
);

describe('RelatedContentLinks', () => {
  it.each(['en', 'he'] as const)('uses the injected localized path builder in %s', (language) => {
    const buildPath = vi.fn<LocalizedPathBuilder>((activeLanguage, target) => (
      `/${activeLanguage}/${target.route}/${targetId(target)}`
    ));
    renderLinks(language, buildPath);

    const list = screen.getByRole('list');
    expect(within(list).getByRole('link', {
      name: language === 'he'
        ? 'איך בניתי אתר עסקי שמוביל ל-WhatsApp'
        : 'How I built a business site around WhatsApp',
    })).toHaveAttribute('href', `/${language}/article/catering-whatsapp`);
    expect(within(list).getByRole('link', { name: 'Nis Boutique Catering' })).toHaveAttribute(
      'href',
      `/${language}/project/nis_boutique`,
    );
    expect(buildPath).toHaveBeenCalledWith(language, {
      route: 'article',
      id: 'catering-whatsapp',
    });
  });

  it('renders individual links as an unordered semantic list', () => {
    const buildPath: LocalizedPathBuilder = (_language, target) => (
      `/${target.route}/${targetId(target)}`
    );
    renderLinks('en', buildPath);

    const section = screen.getByRole('heading', { name: 'Related content' }).closest('section');
    expect(section).not.toBeNull();
    expect(within(section as HTMLElement).getByRole('list').tagName).toBe('UL');
    expect(within(section as HTMLElement).getAllByRole('link')).toHaveLength(2);
  });

  it('renders nothing when no factual relation exists', () => {
    const { container } = render(
      <MemoryRouter>
        <RelatedContentLinks
          buildPath={() => '/unused'}
          heading="Related content"
          items={[]}
          language="en"
        />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
