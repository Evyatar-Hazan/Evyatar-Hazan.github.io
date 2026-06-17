import Card from '../Card';
import { ArrowUpRight, CheckCircle2, Github, Lock, MonitorSmartphone, PanelsTopLeft, Route, Shield, UtensilsCrossed, Workflow } from 'lucide-react';
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

const ProjectVisual = ({ project }: { project: Project }) => {
  const Icon = visualIcons[project.visual];

  return (
    <div className="relative mb-6 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-950 p-4 text-white shadow-inner dark:border-neutral-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.35),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(16,185,129,0.2),transparent_26%)]" />
      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <Icon className="h-5 w-5 text-primary-300" />
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <div className="space-y-2">
            <span className="block h-3 rounded-full bg-white/20" />
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

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative flex min-h-screen items-center justify-center bg-white px-6 py-24 transition-colors duration-500 dark:bg-black">
      <div className="max-w-6xl w-full">
        <div className="mb-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col h-full group">
              <ProjectVisual project={project} />
              <div className="mb-6 flex-grow">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {t(`projects.items.${project.id}.title`)}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t(`projects.items.${project.id}.status`)}
                  </span>
                </div>
                <p className="mb-4 text-neutral-600 dark:text-neutral-400 transition-colors duration-500">
                  {t(`projects.items.${project.id}.description`)}
                </p>
                <div className="mb-5 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/60">
                  <p className="text-neutral-700 dark:text-neutral-300"><span className="font-bold text-neutral-950 dark:text-white">{t('projects.problem')}</span> {t(`projects.items.${project.id}.problem`)}</p>
                  <p className="text-neutral-700 dark:text-neutral-300"><span className="font-bold text-neutral-950 dark:text-white">{t('projects.solution')}</span> {t(`projects.items.${project.id}.solution`)}</p>
                  <p className="text-neutral-700 dark:text-neutral-300"><span className="font-bold text-neutral-950 dark:text-white">{t('projects.role')}</span> {t(`projects.items.${project.id}.role`)}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-600 dark:text-neutral-300 transition-colors duration-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 text-neutral-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Github className="w-4 h-4" /> {t('projects.code')}
                </a>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300"
                    aria-label={t('projects.liveDemo')}
                  >
                    <span className="hidden sm:inline">{t('projects.liveDemo')}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600" title={t('projects.noLive')}>
                    <Lock className="h-4 w-4" />
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
