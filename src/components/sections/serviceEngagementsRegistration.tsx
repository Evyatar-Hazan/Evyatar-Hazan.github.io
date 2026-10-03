import type {
  LocalizedPathBuilder,
  PortfolioSlotRegistration,
} from '../../contracts/portfolio';
import { ServiceEngagements } from './ServiceEngagements';

/**
 * Binds the shared localized route helper without making this feature own route
 * shape or the homepage slot registry.
 */
export const createServiceEngagementsRegistration = (
  buildPath: LocalizedPathBuilder,
): PortfolioSlotRegistration => ({
  taskId: 't02',
  slot: 'home.serviceEngagements',
  Component: (props) => <ServiceEngagements {...props} buildPath={buildPath} />,
});
