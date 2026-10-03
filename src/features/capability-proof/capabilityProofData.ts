import { getBlogPostMetadata } from '../../content/blog/metadata';
import type { CaseStudyEvidence } from '../../data/caseStudyEvidence';
import {
  getPortfolioCapabilityGroups,
  type PortfolioLanguage,
} from '../../data/portfolioCapabilities';
import {
  getFlagshipPortfolioProjects,
  getRemainingPortfolioProjects,
} from '../../data/portfolioProjects';
import { projectById } from '../../data/profile';
import type {
  ArticleId,
  CapabilityId,
  PortfolioContentRef,
  ProjectId,
} from '../../contracts/portfolio';

type LocalizedCopy = Record<PortfolioLanguage, string>;
type DemonstrationRef = Extract<PortfolioContentRef, { kind: 'project' | 'article' }>;
type VerifiedEvidence = Extract<CaseStudyEvidence, { evidenceStatus: 'verified' }>;

type CapabilityProofDefinition = {
  demonstrations: readonly DemonstrationRef[];
  publicEvidenceGap?: LocalizedCopy;
};

export type CapabilityDemonstration =
  | {
      kind: 'project';
      id: ProjectId;
      title: string;
      summary: string;
      githubUrl: string;
      hasCaseStudy: boolean;
    }
  | {
      kind: 'article';
      id: ArticleId;
      title: string;
      summary: string;
    };

export type CapabilityMeasuredOutcome = {
  projectId: ProjectId;
  projectTitle: string;
  evidence: VerifiedEvidence;
};

export type CapabilityProofGroup = {
  id: CapabilityId;
  label: string;
  description: string;
  skills: readonly string[];
  demonstrations: CapabilityDemonstration[];
  measuredOutcomes: CapabilityMeasuredOutcome[];
  publicEvidenceGap?: string;
};

/**
 * Curated links from broad capability claims to canonical public work.
 * A related project or article demonstrates practice; it is never promoted to
 * a measured outcome unless task72 marks that project's evidence as verified.
 */
export const capabilityProofDefinitions: Record<CapabilityId, CapabilityProofDefinition> = {
  webMobile: {
    demonstrations: [
      { kind: 'project', id: 'nis_boutique' },
      { kind: 'project', id: 'online_converter' },
      { kind: 'project', id: 'emergency_protocol' },
      { kind: 'project', id: 'united_hatzalah' },
      { kind: 'article', id: 'catering-whatsapp' },
      { kind: 'article', id: 'small-project-architecture' },
    ],
  },
  languages: {
    demonstrations: [
      { kind: 'project', id: 'test_yourself' },
      { kind: 'project', id: 'password_gen' },
      { kind: 'article', id: 'data-types-java-typescript-python' },
      { kind: 'article', id: 'java-program-execution' },
    ],
  },
  aiCv: {
    demonstrations: [],
    publicEvidenceGap: {
      en: 'No canonical public project or article currently demonstrates the listed AI and computer-vision stack.',
      he: 'אין כרגע בפרויקט הפורטפוליו או במאמר קנוני ציבורי הדגמה של סטאק ה-AI והראייה הממוחשבת המופיע כאן.',
    },
  },
  devops: {
    demonstrations: [
      { kind: 'project', id: 'online_converter' },
      { kind: 'project', id: 'emergency_protocol' },
      { kind: 'project', id: 'united_hatzalah' },
      { kind: 'project', id: 'lev_chedva' },
      { kind: 'article', id: 'deployment-is-product' },
      { kind: 'article', id: 'tests-need-honest-environments' },
    ],
  },
  databases: {
    demonstrations: [
      { kind: 'project', id: 'emergency_protocol' },
      { kind: 'project', id: 'united_hatzalah' },
      { kind: 'article', id: 'retries-should-not-duplicate-data' },
    ],
  },
  automation: {
    demonstrations: [
      { kind: 'project', id: 'online_converter' },
      { kind: 'project', id: 'test_yourself' },
      { kind: 'article', id: 'tests-need-honest-environments' },
      { kind: 'article', id: 'performance-optimizations-need-product-verification' },
    ],
    publicEvidenceGap: {
      en: 'These references demonstrate validation practice, but they do not publicly verify every named device-automation tool.',
      he: 'ההפניות מדגימות פרקטיקת אימות, אך אינן מאמתות בפומבי כל אחד מכלי אוטומציית המכשירים שמופיעים ברשימה.',
    },
  },
  methodologies: {
    demonstrations: [
      { kind: 'project', id: 'nis_boutique' },
      { kind: 'project', id: 'online_converter' },
      { kind: 'project', id: 'emergency_protocol' },
      { kind: 'project', id: 'united_hatzalah' },
      { kind: 'article', id: 'credible-portfolio' },
      { kind: 'article', id: 'monetization-needs-product-guardrails' },
      { kind: 'article', id: 'privacy-safe-product-analytics' },
    ],
  },
};

const getLocalizedProjectMap = (language: PortfolioLanguage) => new Map(
  [
    ...getFlagshipPortfolioProjects(language),
    ...getRemainingPortfolioProjects(language),
  ].map((project) => [project.id, project]),
);

const resolveDemonstration = (
  reference: DemonstrationRef,
  language: PortfolioLanguage,
  projectMap: ReturnType<typeof getLocalizedProjectMap>,
): CapabilityDemonstration => {
  if (reference.kind === 'article') {
    const article = getBlogPostMetadata(reference.id, language);

    if (!article) {
      throw new Error(`Missing canonical capability article: ${reference.id}:${language}`);
    }

    return {
      kind: 'article',
      id: reference.id,
      title: article.title,
      summary: article.excerpt,
    };
  }

  const project = projectMap.get(reference.id);
  const sourceProject = projectById.get(reference.id);

  if (!project || !sourceProject) {
    throw new Error(`Missing canonical capability project: ${reference.id}`);
  }

  return {
    kind: 'project',
    id: reference.id,
    title: project.title,
    summary: project.summary,
    githubUrl: project.githubUrl,
    hasCaseStudy: Boolean(sourceProject.caseStudy),
  };
};

const resolveMeasuredOutcomes = (
  demonstrations: readonly DemonstrationRef[],
  projectMap: ReturnType<typeof getLocalizedProjectMap>,
): CapabilityMeasuredOutcome[] => demonstrations.flatMap((reference) => {
  if (reference.kind !== 'project') return [];

  const project = projectById.get(reference.id);
  const localizedProject = projectMap.get(reference.id);
  const evidence = project?.caseStudy;

  if (!localizedProject || !evidence || evidence.evidenceStatus !== 'verified') return [];

  return [{
    projectId: reference.id,
    projectTitle: localizedProject.title,
    evidence,
  }];
});

export const getCapabilityProofGroups = (
  language: PortfolioLanguage,
): CapabilityProofGroup[] => {
  const projectMap = getLocalizedProjectMap(language);

  return getPortfolioCapabilityGroups(language).map((group) => {
    const definition = capabilityProofDefinitions[group.id];

    return {
      ...group,
      demonstrations: definition.demonstrations.map((reference) => (
        resolveDemonstration(reference, language, projectMap)
      )),
      measuredOutcomes: resolveMeasuredOutcomes(definition.demonstrations, projectMap),
      publicEvidenceGap: definition.publicEvidenceGap?.[language],
    };
  });
};
