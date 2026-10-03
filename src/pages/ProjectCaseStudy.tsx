import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjectById, type LocalizedText } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';
import CaseStudyReadingLevels from '../components/CaseStudyReadingLevels';
import RelatedContentLinks, { type RelatedContentItem } from '../components/RelatedContentLinks';
import { getBlogPostMetadata } from '../content/blog/metadata';
import { getRelatedArticleIds } from '../data/contentRelations';
import { localizedPath } from '../routing/portfolioRoutes';
import { isCaseStudyReadingProjectId } from '../data/caseStudyReadingLevels';

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
  const solution = t(`projects.items.${project.id}.solution`);
  const impact = t(`projects.items.${project.id}.impact`);
  const role = t(`projects.items.${project.id}.role`);
  const relatedWriting: RelatedContentItem[] = getRelatedArticleIds(project.id).flatMap((articleId) => {
    const article = getBlogPostMetadata(articleId, language);
    return article ? [{ target: { route: 'article', id: articleId }, label: article.title }] : [];
  });

  return (
    <main className="bg-white px-6 py-20 transition-colors duration-500 dark:bg-black">
      <article className="mx-auto max-w-5xl">
        <header className="border-b border-neutral-200 pb-10 dark:border-neutral-800">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
            {pick(caseStudy.eyebrow, i18n.language)}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300">
              {t(`projects.categories.${project.category}`)}
            </span>
            <span className="rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-bold text-success-700 dark:border-success-900/70 dark:bg-success-950/30 dark:text-success-300">
              {t(`projects.statuses.${project.status}`)}
            </span>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {isCaseStudyReadingProjectId(project.id) && (
          <CaseStudyReadingLevels
            language={language}
            projectId={project.id}
            buildLocalizedPath={localizedPath}
            caseStudy={caseStudy}
            problem={problem}
            solution={solution}
            impact={impact}
            role={role}
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl ?? undefined}
          />
        )}

        <RelatedContentLinks
          buildPath={localizedPath}
          heading={t('projects.caseStudyRelatedWriting')}
          items={relatedWriting}
          language={language}
        />
      </article>
    </main>
  );
};

export default ProjectCaseStudy;
