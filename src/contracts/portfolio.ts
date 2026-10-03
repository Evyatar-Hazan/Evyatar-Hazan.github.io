import type { ComponentType } from 'react';
import type { blogPostMetadataByKey } from '../content/blog/metadata';
import type {
  PortfolioCapabilityGroup,
  PortfolioLanguage,
} from '../data/portfolioCapabilities';
import type { PortfolioProjectId } from '../data/portfolioProjects';

type ArticleMetadataKey = keyof typeof blogPostMetadataByKey;

/** Stable content identifiers. Localized labels and URLs are never identifiers. */
export type ProjectId = PortfolioProjectId;
export type ArticleId = ArticleMetadataKey extends `${infer Slug}:${PortfolioLanguage}`
  ? Slug
  : never;
export type CapabilityId = PortfolioCapabilityGroup['id'];

/** Keep all four projects already featured on the canonical homepage. */
export const homepageFeaturedProjectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'united_hatzalah',
] as const satisfies readonly ProjectId[];

export type PortfolioContentRef =
  | { kind: 'project'; id: ProjectId }
  | { kind: 'article'; id: ArticleId }
  | { kind: 'capability'; id: CapabilityId };

export type CapabilityEvidenceStatus = 'public' | 'unavailable' | 'unreviewed';

export type CapabilityEvidenceRecord = {
  status: CapabilityEvidenceStatus;
  publicRefs: readonly PortfolioContentRef[];
};

/**
 * `unavailable` means that no approved public proof is currently available;
 * it does not make a claim about whether the underlying capability exists.
 * Task 04 may promote a group to `public` only with verified public references.
 */
export const capabilityEvidenceBaseline = {
  webMobile: { status: 'unreviewed', publicRefs: [] },
  languages: { status: 'unreviewed', publicRefs: [] },
  aiCv: { status: 'unavailable', publicRefs: [] },
  devops: { status: 'unreviewed', publicRefs: [] },
  databases: { status: 'unreviewed', publicRefs: [] },
  automation: { status: 'unavailable', publicRefs: [] },
  methodologies: { status: 'unreviewed', publicRefs: [] },
} as const satisfies Record<CapabilityId, CapabilityEvidenceRecord>;

/**
 * Route input contract for task 09. The localized path helper owns URL shape;
 * feature modules pass stable IDs instead of assembling paths themselves.
 */
export type PortfolioRouteTarget =
  | { route: 'home' }
  | { route: 'projects' }
  | { route: 'project'; id: ProjectId }
  | { route: 'blog' }
  | { route: 'article'; id: ArticleId }
  | { route: 'lab' }
  | { route: 'contact' }
  | { route: 'privacy' };

export type LocalizedPathBuilder = (
  language: PortfolioLanguage,
  target: PortfolioRouteTarget,
) => string;

export const approvedPortfolioTasks = [
  { id: 't01', key: 'audience', slot: 'home.audience' },
  { id: 't02', key: 'serviceEngagements', slot: 'home.serviceEngagements' },
  { id: 't03', key: 'humanAbout', slot: 'home.humanAbout' },
  { id: 't04', key: 'capabilityProof', slot: 'projects.capabilityProof' },
  { id: 't05', key: 'flagshipComparison', slot: 'projects.flagshipComparison' },
  { id: 't06', key: 'productVisuals', slot: 'projects.productVisuals' },
  { id: 't07', key: 'projectArticleLinks', slot: 'content.projectArticleLinks' },
  { id: 't08', key: 'contactBrief', slot: 'contact.brief' },
  { id: 't09', key: 'localeUrlsSeo', slot: 'shell.localeUrlsSeo' },
  { id: 't10', key: 'localizedHeroLayout', slot: 'home.localizedHeroLayout' },
  { id: 't11', key: 'interactiveArticle', slot: 'article.interactive' },
  { id: 't12', key: 'reusableComponent', slot: 'lab.reusableComponent' },
  { id: 't13', key: 'craftLab', slot: 'lab.craft' },
  { id: 't14', key: 'aiProvenance', slot: 'content.aiProvenance' },
  { id: 't15', key: 'currentFocus', slot: 'home.currentFocus' },
  { id: 't16', key: 'archive', slot: 'projects.archive' },
  { id: 't17', key: 'caseReadingModes', slot: 'case.readingModes' },
  { id: 't18', key: 'curatedRoutes', slot: 'blog.curatedRoutes' },
  { id: 't19', key: 'workingPrinciples', slot: 'home.workingPrinciples' },
  { id: 't20', key: 'signatureInteraction', slot: 'shell.signatureInteraction' },
] as const;

export type PortfolioTask = (typeof approvedPortfolioTasks)[number];
export type PortfolioTaskId = PortfolioTask['id'];
export type PortfolioSlotId = PortfolioTask['slot'];

/** Minimal mounting contract; domain-specific modules may extend these props. */
export type PortfolioSlotProps = {
  language: PortfolioLanguage;
  className?: string;
};

export type PortfolioSlotComponent = ComponentType<PortfolioSlotProps>;

export type PortfolioSlotRegistration = {
  taskId: PortfolioTaskId;
  slot: PortfolioSlotId;
  Component: PortfolioSlotComponent;
};
