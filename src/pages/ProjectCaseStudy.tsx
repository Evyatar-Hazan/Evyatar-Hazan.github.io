import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjectById, type LocalizedText } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';
import type { RelatedContentItem } from '../components/RelatedContentLinks';
import { getBlogPostMetadata } from '../content/blog/metadata';
import { getRelatedArticleIds } from '../data/contentRelations';
import { localizedPath } from '../routing/portfolioRoutes';
import AiProvenanceSection from '../features/ai-provenance/AiProvenanceSection';
import ProductVisualGallery from '../components/ProductVisualGallery';
import CaseStudyStory from '../components/CaseStudyStory';
import {
  caseStudyStories,
  getNextCaseStudyProjectId,
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
      <main className="min-h-[70vh] bg-white px-6 py-24 transition-colors duration-500 dark:bg-black">
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
      </main>
    );
  }

  const title = t(`projects.items.${project.id}.title`);
  const description = t(`projects.items.${project.id}.description`);
  const problem = t(`projects.items.${project.id}.problem`);
  const impact = t(`projects.items.${project.id}.impact`);
  const role = t(`projects.items.${project.id}.role`);
  const relatedWriting: RelatedContentItem[] = getRelatedArticleIds(project.id).flatMap((articleId) => {
    const article = getBlogPostMetadata(articleId, language);
    return article ? [{ target: { route: 'article', id: articleId }, label: article.title }] : [];
  });
  const story = project.id in caseStudyStories
    ? caseStudyStories[project.id as CaseStudyStoryProjectId]
    : null;

  if (!story) {
    return (
      <main className="min-h-[70vh] bg-white px-6 py-24 transition-colors duration-500 dark:bg-black">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">{t('projects.caseStudyNotFoundTitle')}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{t('projects.caseStudyNotFoundDescription')}</p>
        </div>
      </main>
    );
  }

  const storyProjectId = project.id as CaseStudyStoryProjectId;
  const nextProject = projectById.get(getNextCaseStudyProjectId(storyProjectId));

  if (!nextProject) return null;

  const visualProof = (
    <ProductVisualGallery
      language={language}
      localizedPath={localizedPath}
      projectId={storyProjectId}
    />
  );

  const supplementaryEvidence: ReactNode = project.id === 'nis_boutique' ? (
    <AiProvenanceSection
      buildPath={localizedPath}
      language={language}
      mode="full"
    />
  ) : undefined;

  return (
    <main className="bg-white px-6 transition-colors duration-500 dark:bg-black">
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
          project={{ ...project, id: storyProjectId }}
          relatedWriting={relatedWriting}
          role={role}
          story={story}
          supplementaryEvidence={supplementaryEvidence}
          statusLabel={t(`projects.statuses.${project.status}`)}
          title={title}
          visualProof={visualProof}
        />
      </div>
    </main>
  );
};

export default ProjectCaseStudy;
