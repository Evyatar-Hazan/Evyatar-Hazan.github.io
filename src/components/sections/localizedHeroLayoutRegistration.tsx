import type { ReactNode } from 'react';
import type { MotionStyle } from 'framer-motion';
import type {
  LocalizedPathBuilder,
  PortfolioSlotRegistration,
} from '../../contracts/portfolio';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import {
  LocalizedHeroLayout,
  type LocalizedHeroAction,
  type LocalizedHeroCopy,
} from './LocalizedHeroLayout';

type LocalizedHeroLayoutRegistrationOptions = {
  buildPath: LocalizedPathBuilder;
  copy: Readonly<Record<PortfolioLanguage, LocalizedHeroCopy>>;
  getPrimaryAction: (language: PortfolioLanguage) => LocalizedHeroAction;
  getSecondaryAction: (language: PortfolioLanguage) => LocalizedHeroAction;
  renderVisual?: (language: PortfolioLanguage) => ReactNode;
  getCopyStyle?: (language: PortfolioLanguage) => MotionStyle | undefined;
};

/**
 * Binds shared routing and page-owned content without making this feature own
 * Home, the global stylesheet or the language toggle.
 */
export const createLocalizedHeroLayoutRegistration = ({
  buildPath,
  copy,
  getPrimaryAction,
  getSecondaryAction,
  renderVisual,
  getCopyStyle,
}: LocalizedHeroLayoutRegistrationOptions): PortfolioSlotRegistration => ({
  taskId: 't10',
  slot: 'home.localizedHeroLayout',
  Component: ({ language, className }) => (
    <LocalizedHeroLayout
      language={language}
      buildPath={buildPath}
      copy={copy[language]}
      primaryAction={getPrimaryAction(language)}
      secondaryAction={getSecondaryAction(language)}
      visual={renderVisual?.(language)}
      copyStyle={getCopyStyle?.(language)}
      className={className}
    />
  ),
});
