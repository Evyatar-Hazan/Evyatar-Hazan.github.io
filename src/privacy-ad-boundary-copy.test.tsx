import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

let currentLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: currentLanguage },
  }),
}));

vi.mock('./hooks/usePageSeo', () => ({
  usePageSeo: () => undefined,
}));

import PrivacyPage from './pages/PrivacyPage';

const renderPrivacyPage = (language: 'en' | 'he') => {
  currentLanguage = language;
  return render(
    <MemoryRouter initialEntries={[`/${language}/privacy/`]}>
      <PrivacyPage />
    </MemoryRouter>,
  );
};

describe('FIX-198 privacy advertising boundary copy', () => {
  it.each([
    {
      language: 'en' as const,
      advertisingHeading: 'No ads on this portfolio',
      advertisingCopy: /This portfolio, including this page, does not load ads or Google AdSense\./,
      choicesCopy: /Google ad settings apply only to Online Converter/,
      thirdPartyHeading: 'Ad-free portfolio — third-party choices and policies',
      googlePolicyLink: 'Google data use — Online Converter only',
      googleSettingsLink: 'Google ad settings — Online Converter only',
      contactCta: 'Ask about privacy',
    },
    {
      language: 'he' as const,
      advertisingHeading: 'אין מודעות בפורטפוליו הזה',
      advertisingCopy: /הפורטפוליו, כולל העמוד הזה, אינו טוען מודעות או Google AdSense\./,
      choicesCopy: /הגדרות המודעות של Google רלוונטיות רק ל-Online Converter/,
      thirdPartyHeading: 'הפורטפוליו ללא מודעות — בחירות ומדיניות של צד שלישי',
      googlePolicyLink: 'השימוש של Google במידע — Online Converter בלבד',
      googleSettingsLink: 'הגדרות המודעות של Google — Online Converter בלבד',
      contactCta: 'שאלה על פרטיות',
    },
  ])('separates the ad-free portfolio from Online Converter in $language', ({
    language,
    advertisingHeading,
    advertisingCopy,
    choicesCopy,
    thirdPartyHeading,
    googlePolicyLink,
    googleSettingsLink,
    contactCta,
  }) => {
    renderPrivacyPage(language);

    expect(screen.getByRole('heading', { name: advertisingHeading })).toBeInTheDocument();
    expect(screen.getByText(advertisingCopy)).toBeInTheDocument();
    expect(screen.getByText(choicesCopy)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: thirdPartyHeading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: googlePolicyLink })).toHaveAttribute(
      'href',
      'https://policies.google.com/technologies/partner-sites',
    );
    expect(screen.getByRole('link', { name: googleSettingsLink })).toHaveAttribute(
      'href',
      'https://adssettings.google.com/',
    );
    expect(screen.getByRole('link', { name: contactCta })).toHaveAttribute(
      'href',
      `/${language}/contact/`,
    );
  });
});
