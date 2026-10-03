import type { PortfolioSlotRegistration } from '../../contracts/portfolio';
import HumanAboutSection from './HumanAboutSection';

export { getHumanAboutContent, humanAboutSourceIds } from './content';
export type { HumanAboutPillarId, HumanAboutSourceId } from './content';
export { default as HumanAboutSection } from './HumanAboutSection';

export const humanAboutRegistration = {
  taskId: 't03',
  slot: 'home.humanAbout',
  Component: HumanAboutSection,
} satisfies PortfolioSlotRegistration;
