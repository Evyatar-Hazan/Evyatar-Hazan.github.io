import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../../data/profile';
import type { ProjectId } from '../../contracts/portfolio';
import { localizedPath } from '../../routing/portfolioRoutes';
import { HomeSectionHeader } from './HomeSectionPrimitives';
import './Projects.css';
import { cardSurfaceClassName } from '../cardSurface';
import ProjectCardFacts from '../ProjectCardFacts';

const featuredProjects = projects.filter((project) => project.featured);
const flagshipProjectId = 'nis_boutique';
const flagshipProject = featuredProjects.find((project) => project.id === flagshipProjectId);
const supportingProjects = featuredProjects.filter((project) => project.id !== flagshipProjectId);

if (!flagshipProject) {
  throw new Error(`Missing flagship project: ${flagshipProjectId}`);
}

const previewImages: Partial<Record<Project['visual'], string>> = {
  catering: '/project-nis-boutique.webp',
  converter: '/project-online-converter.webp',
  protocol: '/project-emergency-protocol.webp',
  branch: '/project-united-hatzalah.webp',
};

const ProjectActions = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';
  const secondaryClass = `home-action home-action--secondary${compact ? ' home-action--compact' : ''}`;

  return (
    <div className={`project-actions flex flex-wrap items-center gap-2 ${compact ? 'project-actions-compact' : ''}`}>
      {project.caseStudy && (
        <Link
          to={localizedPath(language, { route: 'project', id: project.id as ProjectId })}
          className={compact ? secondaryClass : 'home-action home-action--primary'}
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
}: {
  project: Project;
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
      className={cardSurfaceClassName('interactive', 'featured-case-card')}
      data-project-visual={project.visual}
      data-featured-project={project.id}
      data-project-card={project.id}
      aria-labelledby={titleId}
    >
      <div className="featured-case-card__masthead">
        <span className="featured-case-card__index" aria-hidden="true">
          01
        </span>
        <p>{t('projects.flagshipLabel')}</p>
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

        <ProjectCardFacts
          role={t(`projects.items.${project.id}.role`)}
          problem={t(`projects.items.${project.id}.problem`)}
          result={t(project.impactKey)}
          status={t(`projects.statuses.${project.status}`)}
        />

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

const SupportingProjectCard = ({
  project,
  projectIndex,
}: {
  project: Project;
  projectIndex: number;
}) => {
  const { t } = useTranslation();
  const titleId = `supporting-project-${project.id}`;
  const projectTitle = t(`projects.items.${project.id}.title`);
  const previewImage = previewImages[project.visual];

  return (
    <article
      className={cardSurfaceClassName('interactive', 'supporting-project-card')}
      data-project-visual={project.visual}
      data-supporting-project={project.id}
      data-project-card={project.id}
      aria-labelledby={titleId}
    >
      <div className="supporting-project-card__masthead">
        <span aria-hidden="true">{String(projectIndex + 2).padStart(2, '0')}</span>
        <p>PROJECT {String(projectIndex + 2).padStart(2, '0')}</p>
        <small>{t(`projects.statuses.${project.status}`)}</small>
      </div>

      {previewImage && (
        project.liveUrl ? (
          <a
            href={project.liveUrl}
            className="supporting-project-card__media-link"
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
          </a>
        ) : (
          <img
            className="supporting-project-card__media"
            src={previewImage}
            alt={t(`projects.items.${project.id}.previewTitle`)}
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
          />
        )
      )}

      <div className="supporting-project-card__body">
        <div>
          <h3 id={titleId}>{projectTitle}</h3>
          <p>{t(project.summaryKey)}</p>
        </div>
        <ProjectCardFacts
          role={t(`projects.items.${project.id}.role`)}
          problem={t(`projects.items.${project.id}.problem`)}
          result={t(project.impactKey)}
          status={t(`projects.statuses.${project.status}`)}
        />
        <ProjectActions project={project} compact />
      </div>
    </article>
  );
};

const Projects = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  return (
    <section
      id="projects"
      data-reader-journey-stage="proof"
      className="home-section home-section--projects projects-evidence relative"
    >
      <div className="projects-evidence-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="home-section__inner">
        <HomeSectionHeader
          index="02"
          eyebrow={t('projects.eyebrow')}
          title={<>{t('projects.title1')} <em>{t('projects.title2')}</em></>}
          description={<p>{t('projects.subtitle')}</p>}
        />
      </div>

      <div aria-label={t('projects.featuredLabel')} className="featured-case-grid home-section__inner relative">
        <FeaturedProjectCard project={flagshipProject} />
      </div>

      <div className="supporting-projects home-section__inner relative">
        <div className="supporting-projects__header">
          <p>{t('projects.supportingEyebrow')}</p>
          <h3>{t('projects.supportingTitle')}</h3>
        </div>
        <div aria-label={t('projects.supportingLabel')} className="supporting-projects__grid">
          {supportingProjects.map((project, index) => (
            <SupportingProjectCard key={project.id} project={project} projectIndex={index} />
          ))}
        </div>
      </div>

      <div className="home-projects-index home-section__inner relative">
        <div className={cardSurfaceClassName('muted', 'home-projects-index__row')}>
          <div>
            <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">{t('projects.viewAllEyebrow')}</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-neutral-950 dark:text-white">{t('projects.viewAllTitle')}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t('projects.viewAllDescription')}</p>
          </div>
          <Link
            to={localizedPath(language, { route: 'projects' })}
            className="home-action home-action--primary"
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
