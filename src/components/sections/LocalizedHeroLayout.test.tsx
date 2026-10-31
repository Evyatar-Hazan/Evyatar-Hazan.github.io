import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import globalStylesheet from '../../index.css?raw';
import stylesheet from './LocalizedHeroLayout.module.css?raw';
import {
  LocalizedHeroLayout,
  type LocalizedHeroCopy,
} from './LocalizedHeroLayout';

const englishCopy: LocalizedHeroCopy = {
  availability: 'Available for product work',
  prelude: 'An idea is only the beginning.',
  headline: 'I turn complexity into a product that works.',
  description: 'Business need, user experience, and engineering — connected into one clear product.',
  signature: 'EVYATAR HAZAN / PRODUCT ENGINEER',
};

const hebrewCopy: LocalizedHeroCopy = {
  availability: 'זמין לעבודת מוצר',
  prelude: 'רעיון הוא רק ההתחלה.',
  headline: 'אני הופך מורכבות למוצר שעובד.',
  description: 'צורך עסקי, חוויית משתמש והנדסה — מחוברים למוצר ברור.',
};

const renderHero = (
  language: 'en' | 'he',
  copy: LocalizedHeroCopy,
  buildPath: LocalizedPathBuilder,
) => render(
  <LocalizedHeroLayout
    language={language}
    buildPath={buildPath}
    copy={copy}
    proofLabel={language === 'he' ? 'הוכחות במבט אחד' : 'At-a-glance proof'}
    proofs={[
      {
        title: language === 'he' ? '7 פרויקטים נבחרים' : '7 selected projects',
        description: language === 'he' ? 'עבודה ציבורית נבחרת' : 'Selected public work',
      },
      {
        title: language === 'he' ? 'תהליך מסירה מסודר' : 'Structured delivery',
        description: language === 'he' ? 'מבנייה ועד אימות' : 'From build to verification',
      },
      {
        title: language === 'he' ? 'טווח מוצרי רחב' : 'Broad product range',
        description: language === 'he' ? 'Web, מובייל ומערכות' : 'Web, mobile, and systems',
      },
    ]}
    primaryAction={{
      label: language === 'he' ? 'בואו נדבר' : 'Start a conversation',
      href: 'https://wa.me/972587127547',
      external: true,
    }}
    secondaryAction={{
      label: language === 'he' ? 'ראו פרויקטים' : 'See projects',
      target: { route: 'projects' },
    }}
    visual={<div data-testid="hero-visual">Compiler visual</div>}
  />,
);

describe('LocalizedHeroLayout', () => {
  it('renders English copy, actions and the injected visual without owning route shape', () => {
    const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => `/${language}/${target.route}`);

    renderHero('en', englishCopy, buildPath);

    expect(screen.getByTestId('localized-hero-layout')).toHaveAttribute('data-language', 'en');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'An idea is only the beginning. I turn complexity into a product that works.',
    );
    expect(screen.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute(
      'href',
      'https://wa.me/972587127547',
    );
    expect(screen.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'See projects' })).toHaveAttribute('href', '/en/projects');
    expect(buildPath).toHaveBeenCalledWith('en', { route: 'projects' });
    expect(screen.getByTestId('hero-visual')).toBeInTheDocument();
    expect(screen.getByTestId('hero-proof-strip')).toHaveAccessibleName('At-a-glance proof');
    expect(screen.getAllByRole('term')).toHaveLength(3);
  });

  it('keeps Hebrew content and localized destinations explicit', () => {
    const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => `/${language}/${target.route}`);

    renderHero('he', hebrewCopy, buildPath);

    expect(screen.getByTestId('localized-hero-layout')).toHaveAttribute('data-language', 'he');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'רעיון הוא רק ההתחלה. אני הופך מורכבות למוצר שעובד.',
    );
    expect(screen.getByRole('link', { name: 'ראו פרויקטים' })).toHaveAttribute('href', '/he/projects');
    expect(buildPath).toHaveBeenCalledWith('he', { route: 'projects' });
  });

  it('keeps CTA placement in flow and scopes compact sizing to the short mobile hero', () => {
    expect(stylesheet).toMatch(/\.actions\s*{[\s\S]*?display:\s*flex;/);
    expect(stylesheet).not.toMatch(/\.actions\s*{[^}]*position:\s*absolute;/);
    expect(stylesheet).toContain(".layout[data-language='he'] .heading");
    expect(stylesheet).toContain('@media (max-width: 639px) and (max-height: 700px)');
    expect(stylesheet).toMatch(/@media \(max-width: 639px\) and \(max-height: 700px\)[\s\S]*?\.heading\s*{[\s\S]*?font-size:/);
    expect(stylesheet).toMatch(
      /@media \(max-width: 639px\)\s*{[\s\S]*?\.layout\s*{[^}]*min-block-size:\s*auto;/,
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 639px\)\s*{[\s\S]*?\.visual\s*{[^}]*display:\s*none;/,
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 639px\)\s*{[\s\S]*?\.availability\s*{[^}]*margin-bottom:\s*0\.75rem;/,
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 639px\)\s*{[\s\S]*?\.description\s*{[^}]*margin-top:\s*1rem;/,
    );
  });

  it('keeps one visually primary hero CTA and presents the secondary action as a quiet text link', () => {
    expect(stylesheet).toMatch(
      /\.primaryAction\s*{[^}]*background:\s*var\(--color-primary-700\);[^}]*box-shadow:\s*var\(--home-shadow-action\);/,
    );
    expect(stylesheet).toMatch(
      /\.secondaryAction\s*{\s*border:\s*1px solid transparent;[^}]*background:\s*transparent;[^}]*color:\s*var\(--color-neutral-600\);/,
    );
    expect(stylesheet).not.toMatch(/\.secondaryAction\s*{\s*[^}]*box-shadow:/);
  });

  it('keeps the dark hero prelude readable without promoting it to the headline color', () => {
    const darkPreludeRule = stylesheet.match(/:global\(\.dark\) \.prelude\s*{([^}]*)}/)?.[1];

    expect(darkPreludeRule).toContain('color: var(--color-neutral-400);');
    expect(darkPreludeRule).not.toContain('color: var(--color-neutral-600);');
  });

  it('normalizes availability typography only for Hebrew', () => {
    const defaultAvailabilityRule = stylesheet.match(/\.availability\s*{([^}]*)}/)?.[1];
    const hebrewAvailabilityRule = stylesheet.match(
      /\.layout\[data-language='he'\] \.availability\s*{([^}]*)}/,
    )?.[1];

    expect(defaultAvailabilityRule).toContain('letter-spacing: 0.04em;');
    expect(defaultAvailabilityRule).toContain('text-transform: uppercase;');
    expect(hebrewAvailabilityRule).toContain('letter-spacing: 0;');
    expect(hebrewAvailabilityRule).toContain('text-transform: none;');
  });

  it('scopes the compact heading scale to the desktop hero', () => {
    const desktopHeroStyles = stylesheet
      .split('@media (min-width: 1024px) {')[1]
      ?.split('@media (max-width: 639px) {')[0];
    const mobileHeroStyles = stylesheet.split('@media (max-width: 639px) {')[1];

    expect(desktopHeroStyles).toMatch(
      /\.heading,\s*\.layout\[data-language='he'\] \.heading\s*{[^}]*font-size:\s*clamp\(3\.75rem, 4\.8vw, 5rem\);/,
    );
    expect(globalStylesheet).toContain('--type-display: clamp(3rem, 6vw, 6rem);');
    expect(stylesheet.match(/clamp\(3\.75rem, 4\.8vw, 5rem\)/g)).toHaveLength(1);
    expect(mobileHeroStyles).not.toContain('clamp(3.75rem, 4.8vw, 5rem)');
  });
});
