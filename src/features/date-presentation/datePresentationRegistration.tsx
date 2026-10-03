import type {
  LocalizedPathBuilder,
  PortfolioSlotComponent,
  PortfolioSlotProps,
  PortfolioSlotRegistration,
} from '../../contracts/portfolio';
import { DatePresentationDemo } from './DatePresentationDemo';

export const createDatePresentationDemo = (
  buildLocalizedPath: LocalizedPathBuilder,
): PortfolioSlotComponent => {
  const BoundDatePresentationDemo = (props: PortfolioSlotProps) => (
    <DatePresentationDemo {...props} buildLocalizedPath={buildLocalizedPath} />
  );

  BoundDatePresentationDemo.displayName = 'BoundDatePresentationDemo';
  return BoundDatePresentationDemo;
};

export const createDatePresentationRegistration = (
  buildLocalizedPath: LocalizedPathBuilder,
): PortfolioSlotRegistration => ({
  taskId: 't12',
  slot: 'lab.reusableComponent',
  Component: createDatePresentationDemo(buildLocalizedPath),
});
