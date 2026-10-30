import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjectById, type LocalizedText } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';
import type { RelatedContentItem } from '../components/RelatedContentLinks';
import { getBlogPostMetadata } from '../content/blog/metadata';
import {
  getRelatedArticleRelations,
  getRelatedCapabilityRelations,
} from '../data/contentRelations';
import { getPortfolioCapabilityGroups } from '../data/portfolioCapabilities';
import { localizedPath } from '../routing/portfolioRoutes';
import ProductVisualGallery from '../components/ProductVisualGallery';
import CaseStudyStory from '../components/CaseStudyStory';
import {
  caseStudyStories,
  getNextCaseStudyProjectId,
  getPreviousCaseStudyProjectId,
  type CaseStudyStoryProjectId,
} from '../data/caseStudyStories';
import { projectById } from '../data/profile';

const pick = (value: LocalizedText, language: string) => (language === 'he' ? value.he : value.en);

const ProjectCaseStudy = () => {
  const { projectId } = useParams();
  const { t, i18n } = useTranslation();
  const project = getProjectById(projectId);
  const caseStudy = project?.caseStudy;
  const language = i18n.language === 'he' ? 'he' : 'en';

  usePageSeo({
    title: caseStudy ? pick(caseStudy.seoTitle, i18n.language) : t('projects.caseStudyNotFoundSeoTitle'),
    description: caseStudy ? pick(caseStudy.seoDescription, i18n.language) : t('projects.caseStudyNotFoundDescription'),
    path: projectId ? `/projects/${projectId}/` : '/'
  });

  if (!project || !caseStudy) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[70vh] bg-surface-canvas py-24 transition-colors duration-500">
        <div className="content-container">
          <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">{t('projects.caseStudyNotFoundTitle')}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{t('projects.caseStudyNotFoundDescription')}</p>
          <Link
            to={localizedPath(language, { route: 'projects' })}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('projects.caseStudyBack')}
          </Link>
          </div>
        </div>
      </main>
    );
  }

  const title = t(`projects.items.${project.id}.title`);
  const description = t(`projects.items.${project.id}.description`);
  const problem = t(`projects.items.${project.id}.problem`);
  const impact = t(`projects.items.${project.id}.impact`);
  const role = t(`projects.items.${project.id}.role`);
  const relatedWriting: RelatedContentItem[] = getRelatedArticleRelations(project.id).flatMap((relation) => {
    const article = getBlogPostMetadata(relation.articleId, language);
    return article ? [{
      target: { route: 'article', id: relation.articleId },
      label: article.title,
      reason: relation.reason[language],
    }] : [];
  });
  const capabilityById = new Map(getPortfolioCapabilityGroups(language).map((capability) => [capability.id, capability]));
  const relatedCapabilities = getRelatedCapabilityRelations(project.id).flatMap((relation) => {
    const capability = capabilityById.get(relation.capabilityId);
    return capability ? [{
      id: relation.capabilityId,
      label: capability.label,
      reason: relation.reason[language],
    }] : [];
  });
  const story = project.id in caseStudyStories
    ? caseStudyStories[project.id as CaseStudyStoryProjectId]
    : null;

  if (!story) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[70vh] bg-surface-canvas py-24 transition-colors duration-500">
        <div className="content-container">
          <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">{t('projects.caseStudyNotFoundTitle')}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{t('projects.caseStudyNotFoundDescription')}</p>
          </div>
        </div>
      </main>
    );
  }

  const storyProjectId = project.id as CaseStudyStoryProjectId;
  const previousProject = projectById.get(getPreviousCaseStudyProjectId(storyProjectId));
  const nextProject = projectById.get(getNextCaseStudyProjectId(storyProjectId));

  if (!previousProject || !nextProject) return null;

  const visualProof = (
    <ProductVisualGallery
      language={language}
      localizedPath={localizedPath}
      projectId={storyProjectId}
    />
  );

  const supplementaryEvidence: ReactNode = undefined;

  return (
    <main id="main-content" tabIndex={-1} className="bg-surface-canvas transition-colors duration-500">
      <div className="content-container">
        <div className="mx-auto max-w-6xl">
        <CaseStudyStory
          buildPath={localizedPath}
          caseStudy={caseStudy}
          categoryLabel={t(`projects.categories.${project.category}`)}
          challenge={problem}
          description={description}
          impact={impact}
          language={language}
          nextProject={nextProject}
          previousProject={previousProject}
          project={{ ...project, id: storyProjectId }}
          relatedWriting={relatedWriting}
          relatedCapabilities={relatedCapabilities}
          role={role}
          story={story}
          supplementaryEvidence={supplementaryEvidence}
          statusLabel={t(`projects.statuses.${project.status}`)}
          title={title}
          visualProof={visualProof}
        />
        </div>
      </div>
    </main>
  );
};

export default ProjectCaseStudy;
