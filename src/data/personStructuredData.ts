import type { PortfolioLanguage } from './portfolioCapabilities';
import { profileLinks } from './profile';
import { absoluteUrl } from './site';
import { localizedPath } from '../routing/portfolioRoutes';

export const personStructuredDataId = 'person-profile-structured-data';

export const getPersonStructuredData = (language: PortfolioLanguage) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Evyatar Hazan',
  url: absoluteUrl(localizedPath(language, { route: 'about' })),
  jobTitle: 'Full Stack Developer',
  sameAs: [profileLinks.github, profileLinks.linkedin],
});
