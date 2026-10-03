import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
  PortfolioSlotRegistration,
} from '../contracts/portfolio';
import { ProjectArchive, type ProjectArchiveMode } from './ProjectArchive';

export const createProjectArchiveSlot = (
  buildLocalizedPath: LocalizedPathBuilder,
  mode: ProjectArchiveMode = 'short',
): PortfolioSlotRegistration => {
  const ProjectArchiveSlot = (props: PortfolioSlotProps) => (
    <ProjectArchive {...props} buildLocalizedPath={buildLocalizedPath} mode={mode} />
  );

  return {
    taskId: 't16',
    slot: 'projects.archive',
    Component: ProjectArchiveSlot,
  };
};
