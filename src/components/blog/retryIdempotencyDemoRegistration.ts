import type { PortfolioSlotRegistration } from '../../contracts/portfolio';
import RetryIdempotencyDemo from './RetryIdempotencyDemo';

export const retryIdempotencyDemoRegistration = {
  taskId: 't11',
  slot: 'article.interactive',
  Component: RetryIdempotencyDemo,
} satisfies PortfolioSlotRegistration;
