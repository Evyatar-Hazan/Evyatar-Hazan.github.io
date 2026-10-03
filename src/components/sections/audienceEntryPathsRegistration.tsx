import type {
  LocalizedPathBuilder,
  PortfolioSlotRegistration,
} from '../../contracts/portfolio';
import { AudienceEntryPaths } from './AudienceEntryPaths';

/**
 * Binds the shared localized route helper while leaving hero layout and slot
 * placement to the integration owner.
 */
export const createAudienceEntryPathsRegistration = (
  buildPath: LocalizedPathBuilder,
): PortfolioSlotRegistration => ({
  taskId: 't01',
  slot: 'home.audience',
  Component: (props) => <AudienceEntryPaths {...props} buildPath={buildPath} />,
});
