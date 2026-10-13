import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../../data/profile';
import type { ProjectId } from '../../contracts/portfolio';
import { localizedPath } from '../../routing/portfolioRoutes';
import './Projects.css';

const featuredProjects = projects.filter((project) => project.featured);

const previewImages: Partial<Record<Project['visual'], string>> = {
  catering: '/project-nis-boutique.webp',
  converter: '/project-online-converter.webp',
  protocol: '/project-emergency-protocol.webp',
  branch: '/project-united-hatzalah.webp',
};

const ProjectActions = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';
  const secondaryClass = compact
    ? 'inline-flex min-h-9 items-center justify-center gap-2 border border-neutral-300 px-3 text-xs font-bold text-neutral-700 transition-[transform,border-color,color] duration-200 hover:border-primary-500 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white'
    : 'inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-300 bg-white/60 px-3.5 text-sm font-bold text-neutral-700 transition-[transform,border-color,color,background-color] duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-300 dark:hover:text-white';

  return (
    <div className={`project-actions flex flex-wrap items-center gap-2 ${compact ? 'project-actions-compact' : ''}`}>
      {project.caseStudy && !compact && (
        <Link
          to={localizedPath(language, { route: 'project', id: project.id as ProjectId })}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary-600 bg-primary-600 px-4 text-sm font-black text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-neutral-950"
        >
          {t('projects.caseStudy')}
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          className={secondaryClass}
          aria-label={`${t('projects.liveDemo')} ${t(`projects.items.${project.id}.title`)}`}
        >
          <ExternalLink className="h-4 w-4" />
          {t('projects.liveDemo')}
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryClass}
          aria-label={`${t('projects.code')} ${t(`projects.items.${project.id}.title`)}`}
        >
          <Github className="h-4 w-4" />
          {t('projects.code')}
        </a>
      )}
    </div>
  );
};

const FeaturedProjectCard = ({
  project,
  projectIndex,
}: {
  project: Project;
  projectIndex: number;
}) => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const localizedProof = project.caseStudy
    ? project.caseStudy.proof[isHebrew ? 'he' : 'en']
    : t(project.impactKey);
  const titleId = `featured-project-${project.id}`;
  const projectTitle = t(`projects.items.${project.id}.title`);
  const previewImage = previewImages[project.visual];

  return (
    <article
      className="featured-case-card"
      data-project-visual={project.visual}
      data-featured-project={project.id}
      aria-labelledby={titleId}
    >
      <div className="featured-case-card__masthead">
        <span className="featured-case-card__index" aria-hidden="true">
          {String(projectIndex + 1).padStart(2, '0')}
        </span>
        <p>
          PROJECT {String(projectIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
        </p>
        <div className="featured-case-card__meta">
          <span>{t(`projects.statuses.${project.status}`)}</span>
          <span>{t(`projects.categories.${project.category}`)}</span>
        </div>
      </div>

      {previewImage && (
        project.liveUrl ? (
          <a
            href={project.liveUrl}
            className="featured-case-card__media"
            aria-label={`${t('projects.openLivePreview')} ${projectTitle}`}
          >
            <img
              src={previewImage}
              alt={t(`projects.items.${project.id}.previewTitle`)}
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <span>{t('projects.liveDemo')} <ExternalLink className="h-3.5 w-3.5" /></span>
          </a>
        ) : (
          <div className="featured-case-card__media">
            <img
              src={previewImage}
              alt={t(`projects.items.${project.id}.previewTitle`)}
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        )
      )}

      <div className="featured-case-card__body">
        <div className="featured-case-card__intro">
          <h3 id={titleId}>{projectTitle}</h3>
          <p>{t(project.summaryKey)}</p>
        </div>

        <div className="featured-case-card__story">
          <section>
            <span>01</span>
            <h4>{t('projects.storyChallenge')}</h4>
            <p>{t(`projects.items.${project.id}.problem`)}</p>
          </section>
          <section>
            <span>02</span>
            <h4>{t('projects.storyBuild')}</h4>
            <p>{t(`projects.items.${project.id}.solution`)}</p>
          </section>
          <section>
            <span>03</span>
            <h4>{t('projects.storyResult')}</h4>
            <p>{t(project.impactKey)}</p>
            <small>{localizedProof}</small>
          </section>
        </div>

        <div className="featured-case-card__footer">
          <div className="featured-case-card__tags" aria-label={t('projects.technologiesLabel')}>
            {project.tags.slice(0, 5).map((tag) => <span key={tag}>+ {tag}</span>)}
          </div>
          <ProjectActions project={project} />
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  return (
    <section id="projects" className="projects-evidence relative border-b border-neutral-300/70 dark:border-neutral-800/70">
      <div className="projects-evidence-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <header className="relative mx-auto grid w-full max-w-[1480px] gap-6 px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-12">
        <div>
          <p className="mb-4 flex items-center gap-3 font-mono text-[0.64rem] font-black uppercase tracking-[0.17em] text-primary-700 dark:text-primary-400">
            <span className="h-px w-8 bg-primary-500" />
            {t('projects.eyebrow')}
          </p>
          <h2 className="max-w-[12ch] text-[clamp(2.7rem,6vw,6rem)] font-black leading-[0.9] tracking-[-0.06em] text-neutral-950 dark:text-white">
            {t('projects.title1')} <span className="text-primary-600 dark:text-primary-400">{t('projects.title2')}</span>
          </h2>
        </div>
        <p className="max-w-2xl text-base font-medium leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
          {t('projects.subtitle')}
        </p>
      </header>

      <div aria-label={t('projects.featuredLabel')} className="featured-case-grid relative mx-auto w-full max-w-[1480px] px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        {featuredProjects.map((project, index) => (
          <FeaturedProjectCard key={project.id} project={project} projectIndex={index} />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid gap-6 border-y border-neutral-300/80 py-8 dark:border-neutral-800 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">{t('projects.viewAllEyebrow')}</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-neutral-950 dark:text-white">{t('projects.viewAllTitle')}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t('projects.viewAllDescription')}</p>
          </div>
          <Link
            to={localizedPath(language, { route: 'projects' })}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary-600 bg-primary-600 px-5 text-sm font-black text-white transition-colors hover:bg-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
          >
            {t('projects.viewAllCta')}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
