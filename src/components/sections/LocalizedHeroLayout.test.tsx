import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import stylesheet from './LocalizedHeroLayout.module.css?raw';
import {
  LocalizedHeroLayout,
  type LocalizedHeroCopy,
} from './LocalizedHeroLayout';
import { createLocalizedHeroLayoutRegistration } from './localizedHeroLayoutRegistration';

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
  });

  it('registers the feature in the approved localized hero slot', () => {
    const buildPath: LocalizedPathBuilder = (language, target) => `/${language}/${target.route}`;
    const registration = createLocalizedHeroLayoutRegistration({
      buildPath,
      copy: { en: englishCopy, he: hebrewCopy },
      getPrimaryAction: (language) => ({
        label: language === 'he' ? 'בואו נדבר' : 'Start a conversation',
        target: { route: 'contact' },
      }),
      getSecondaryAction: (language) => ({
        label: language === 'he' ? 'ראו פרויקטים' : 'See projects',
        target: { route: 'projects' },
      }),
    });

    expect(registration.taskId).toBe('t10');
    expect(registration.slot).toBe('home.localizedHeroLayout');
    const RegisteredHero = registration.Component;
    render(<RegisteredHero language="he" />);
    expect(screen.getByRole('link', { name: 'בואו נדבר' })).toHaveAttribute('href', '/he/contact');
  });
});
