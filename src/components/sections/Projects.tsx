import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ExternalLink,
  Github,
  MonitorSmartphone,
  PanelsTopLeft,
  Route,
  Shield,
  UtensilsCrossed,
  Workflow,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projects, type Project } from '../../data/profile';

const visualIcons: Record<Project['visual'], typeof PanelsTopLeft> = {
  catering: UtensilsCrossed,
  converter: PanelsTopLeft,
  protocol: Route,
  nonprofit: Workflow,
  mobile: MonitorSmartphone,
  learning: CheckCircle2,
  branch: Shield,
};

const featuredProjects = projects.filter((project) => project.featured);
const indexProjects = projects;

const TechnicalPreview = ({ project }: { project: Project }) => {
  const Icon = visualIcons[project.visual];

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(14,165,233,0.35),transparent_32%),radial-gradient(circle_at_82%_36%,rgba(16,185,129,0.18),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <Icon className="h-5 w-5 text-primary-300" />
        </div>

        <div className="grid grid-cols-[0.8fr_1.4fr] gap-4">
          <div className="space-y-2">
            <span className="block h-3 rounded-full bg-white/25" />
            <span className="block h-3 rounded-full bg-white/10" />
            <span className="block h-3 rounded-full bg-white/10" />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-3">
            <span className="mb-3 block h-3 w-3/4 rounded-full bg-primary-300/80" />
            <div className="space-y-2">
              <span className="block h-2 rounded-full bg-white/25" />
              <span className="block h-2 w-5/6 rounded-full bg-white/15" />
              <span className="block h-2 w-2/3 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectMedia = ({ project }: { project: Project }) => {
  const { t } = useTranslation();

  if (project.liveUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <span>{t('projects.livePreview')}</span>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-500 dark:text-primary-300"
            aria-label={`${t('projects.openLivePreview')} ${t(`projects.items.${project.id}.title`)}`}
          >
            {t('projects.open')}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="relative aspect-[16/9] bg-white md:aspect-[16/8] xl:aspect-[16/7]">
          <iframe
            src={project.liveUrl}
            title={t(`projects.items.${project.id}.previewTitle`)}
            className="h-full w-full border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        </div>
      </div>
    );
  }

  return <TechnicalPreview project={project} />;
};

const ProjectActions = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  const { t } = useTranslation();

  const baseClass = compact
    ? 'inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-bold transition-colors'
    : 'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:text-white`}
      >
        <Github className="h-4 w-4" />
        {t('projects.code')}
      </a>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClass} border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300`}
          aria-label={`${t('projects.liveDemo')} ${t(`projects.items.${project.id}.title`)}`}
        >
          <ExternalLink className="h-4 w-4" />
          {t('projects.liveDemo')}
        </a>
      )}
    </div>
  );
};

const FeaturedProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5 transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-900/40 dark:shadow-none"
    >
      <ProjectMedia project={project} />

      <div className="p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300">
            {t(`projects.categories.${project.category}`)}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
            {t(`projects.statuses.${project.status}`)}
          </span>
        </div>

        <h3 className="mb-3 text-2xl font-bold text-neutral-950 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {t(`projects.items.${project.id}.title`)}
        </h3>
        <p className="mb-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t(project.summaryKey)}
        </p>
        <p className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-300">
          <span className="font-bold text-neutral-950 dark:text-white">{t('projects.impact')}</span>{' '}
          {t(project.impactKey)}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors duration-500 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <ProjectActions project={project} />
      </div>
    </motion.article>
  );
};

const ProjectIndexRow = ({ project }: { project: Project }) => {
  const { t } = useTranslation();

  return (
    <li className="grid gap-4 border-t border-neutral-200 py-5 transition-colors duration-500 first:border-t-0 dark:border-neutral-800 md:grid-cols-[1.25fr_0.8fr_1.15fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-neutral-950 dark:text-white">
            {t(`projects.items.${project.id}.title`)}
          </h3>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {t(`projects.statuses.${project.status}`)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t(`projects.items.${project.id}.description`)}
        </p>
      </div>

      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        {t(`projects.categories.${project.category}`)}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <ProjectActions project={project} compact />
    </li>
  );
};

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative bg-white px-6 py-24 transition-colors duration-500 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-500">{t('projects.eyebrow')}</p>
            <h2 className="text-4xl font-bold text-neutral-900 transition-colors duration-500 dark:text-white md:text-5xl">
              {t('projects.title1')} <span className="text-primary-500">{t('projects.title2')}</span>
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('projects.subtitle')}
          </p>
        </div>

        <div aria-label={t('projects.featuredLabel')} className="grid gap-10">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-20 rounded-lg border border-neutral-200 bg-neutral-50/70 p-5 transition-colors duration-500 dark:border-neutral-800 dark:bg-neutral-950/60 md:p-8">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary-500">{t('projects.indexEyebrow')}</p>
              <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">{t('projects.indexTitle')}</h3>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t('projects.indexSubtitle')}
            </p>
          </div>

          <ul>
            {indexProjects.map((project) => (
              <ProjectIndexRow key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Projects;
