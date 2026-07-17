import enLocaleRaw from '../locales/en.json?raw';
import heLocaleRaw from '../locales/he.json?raw';
import { projectById, type Project } from './profile';
import type { PortfolioLanguage } from './portfolioCapabilities';

export const flagshipPortfolioProjectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
] as const;

export const remainingPortfolioProjectIds = [
  'lev_chedva',
  'password_gen',
  'test_yourself',
  'united_hatzalah',
] as const;

export type FlagshipPortfolioProjectId = (typeof flagshipPortfolioProjectIds)[number];
export type RemainingPortfolioProjectId = (typeof remainingPortfolioProjectIds)[number];
export type PortfolioProjectId = FlagshipPortfolioProjectId | RemainingPortfolioProjectId;

type ProjectLocaleCopy = {
  title: string;
  description: string;
  summary: string;
  status: string;
};

type PortfolioLocale = {
  projects: {
    items: Record<PortfolioProjectId, ProjectLocaleCopy>;
  };
};

export type PortfolioProjectCard<ProjectId extends PortfolioProjectId = PortfolioProjectId> = {
  id: ProjectId;
  title: string;
  description: string;
  summary: string;
  status: string;
  category: Project['category'];
  tags: Project['tags'];
  githubUrl: string;
  liveUrl: string | undefined;
};

export type FlagshipPortfolioProject = PortfolioProjectCard<FlagshipPortfolioProjectId> & {
  liveUrl: string;
};

const localeCopy: Record<PortfolioLanguage, PortfolioLocale> = {
  en: JSON.parse(enLocaleRaw) as PortfolioLocale,
  he: JSON.parse(heLocaleRaw) as PortfolioLocale,
};

const getLocalizedPortfolioProject = <ProjectId extends PortfolioProjectId>(
  id: ProjectId,
  language: PortfolioLanguage,
): PortfolioProjectCard<ProjectId> | undefined => {
  const project = projectById.get(id);
  const copy = localeCopy[language].projects.items[id];

  if (!project || !copy) return undefined;

  return {
    id,
    title: copy.title,
    description: copy.description,
    summary: copy.summary,
    status: copy.status,
    category: project.category,
    tags: [...project.tags],
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  };
};

/**
 * Adapts the canonical flagship order, project structure, and bilingual copy
 * into ready-to-render records. A flagship is required to keep both its source
 * and live actions, so missing canonical data fails loudly instead of silently
 * shrinking the primary portfolio journey.
 */
export const getFlagshipPortfolioProjects = (
  language: PortfolioLanguage,
): FlagshipPortfolioProject[] => flagshipPortfolioProjectIds.map((id) => {
  const project = getLocalizedPortfolioProject(id, language);

  if (!project?.liveUrl) {
    throw new Error(`Missing canonical flagship portfolio project: ${id}`);
  }

  return {
    ...project,
    liveUrl: project.liveUrl,
  };
});

/**
 * Adapts canonical project structure from profile.ts and canonical bilingual
 * copy from the legacy locale files. V2 receives ready-to-render records while
 * links, tags, and descriptions continue to have one source of truth.
 */
export const getRemainingPortfolioProjects = (language: PortfolioLanguage) =>
  remainingPortfolioProjectIds.flatMap((id) => {
    const project = getLocalizedPortfolioProject(id, language);
    return project ? [project] : [];
  });
