import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjectById, type LocalizedText } from '../data/profile';
import { usePageSeo } from '../hooks/usePageSeo';

const pick = (value: LocalizedText, language: string) => (language === 'he' ? value.he : value.en);

const ProjectCaseStudy = () => {
  const { projectId } = useParams();
  const { t, i18n } = useTranslation();
  const project = getProjectById(projectId);
  const caseStudy = project?.caseStudy;

  usePageSeo({
    title: caseStudy ? pick(caseStudy.seoTitle, i18n.language) : t('projects.caseStudyNotFoundSeoTitle'),
    description: caseStudy ? pick(caseStudy.seoDescription, i18n.language) : t('projects.caseStudyNotFoundDescription')
  });

  if (!project || !caseStudy) {
    return (
      <main className="min-h-[70vh] bg-white px-6 py-24 transition-colors duration-500 dark:bg-black">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">{t('projects.caseStudyNotFoundTitle')}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{t('projects.caseStudyNotFoundDescription')}</p>
          <Link
            to="/#projects"
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
  const overview = i18n.language === 'he' ? caseStudy.overview.he : caseStudy.overview.en;
  const decisions = i18n.language === 'he' ? caseStudy.decisions.he : caseStudy.decisions.en;
  const outcomes = i18n.language === 'he' ? caseStudy.outcomes.he : caseStudy.outcomes.en;

  return (
    <main className="bg-white px-6 py-20 transition-colors duration-500 dark:bg-black">
      <article className="mx-auto max-w-5xl">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('projects.caseStudyBack')}
        </Link>

        <header className="mt-8 border-b border-neutral-200 pb-10 dark:border-neutral-800">
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
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
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

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              {t('projects.code')}
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-5 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300"
              >
                <ExternalLink className="h-4 w-4" />
                {t('projects.liveDemo')}
              </a>
            )}
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            {overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-950/60">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary-500">{t('projects.caseStudyAudience')}</h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {pick(caseStudy.audience, i18n.language)}
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-950/60">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary-500">{t('projects.caseStudyProof')}</h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {pick(caseStudy.proof, i18n.language)}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{t('projects.problem')}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{problem}</p>
        </section>

        <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{t('projects.solution')}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{solution}</p>
          <ul className="mt-6 space-y-3">
            {decisions.map((item) => (
              <li key={item} className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{t('projects.impact')}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{impact}</p>
          <ul className="mt-6 space-y-3">
            {outcomes.map((item) => (
              <li key={item} className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{t('projects.role')}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{role}</p>
        </section>

        <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            {t('projects.caseStudyRelatedWriting')}
          </Link>
        </section>
      </article>
    </main>
  );
};

export default ProjectCaseStudy;
