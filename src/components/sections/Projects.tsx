import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Github,
  Hammer,
  Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../../data/profile';

const featuredProjects = projects.filter((project) => project.featured);
const secondaryProjects = projects.filter((project) => !project.featured);
const storySteps = ['problem', 'solution', 'impact'] as const;

const getStoryProgress = (progress: number) => {
  if (progress <= 0.28) return 0;
  if (progress < 0.38) return ((progress - 0.28) / 0.1) * 0.5;
  if (progress <= 0.62) return 0.5;
  if (progress < 0.72) return 0.5 + ((progress - 0.62) / 0.1) * 0.5;
  return 1;
};

const previewImages: Partial<Record<Project['visual'], string>> = {
  catering: '/project-nis-boutique.webp',
  converter: '/project-online-converter.webp',
  protocol: '/project-emergency-protocol.webp',
  branch: '/project-united-hatzalah.webp',
};

const ProjectActions = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  const { t } = useTranslation();
  const secondaryClass = compact
    ? 'inline-flex min-h-9 items-center justify-center gap-2 border border-neutral-300 px-3 text-xs font-bold text-neutral-700 transition-[transform,border-color,color] duration-200 hover:border-primary-500 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white'
    : 'inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-300 bg-white/60 px-3.5 text-sm font-bold text-neutral-700 transition-[transform,border-color,color,background-color] duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-300 dark:hover:text-white';

  return (
    <div className={`project-actions flex flex-wrap items-center gap-2 ${compact ? 'project-actions-compact' : ''}`}>
      {project.caseStudy && !compact && (
        <Link
          to={`/projects/${project.id}`}
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
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryClass}
      >
        <Github className="h-4 w-4" />
        {t('projects.code')}
      </a>
    </div>
  );
};

const ProjectScrollChapter = ({
  project,
  projectIndex,
}: {
  project: Project;
  projectIndex: number;
}) => {
  const { t, i18n } = useTranslation();
  const stageRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const isHebrew = i18n.language === 'he';
  const direction = isHebrew ? 1 : -1;
  const [activeFrame, setActiveFrame] = useState(0);
  const localizedProof = project.caseStudy
    ? project.caseStudy.proof[isHebrew ? 'he' : 'en']
    : t(project.impactKey);
  const localizedOutcomes = project.caseStudy?.outcomes[isHebrew ? 'he' : 'en'].slice(0, 2) ?? [];
  const titleId = `project-chapter-${project.id}`;
  const projectTitle = t(`projects.items.${project.id}.title`);
  const previewImage = previewImages[project.visual];

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const rail = railRef.current;
    const track = trackRef.current;

    if (!stage || !rail || !track) {
      return;
    }

    if (shouldReduceMotion) {
      distance.set(0);
      stage.style.removeProperty('--project-duration');
      stage.style.removeProperty('--project-story-width');
      return;
    }

    const measure = () => {
      const visibleWidth = rail.clientWidth;
      stage.style.setProperty('--project-story-width', `${visibleWidth}px`);
      const travel = Math.max(0, track.scrollWidth - visibleWidth);
      const scrollDuration = Math.min(travel, Math.max(680, window.innerHeight * 1.35));
      distance.set(travel);
      stage.style.setProperty('--project-duration', `${scrollDuration}px`);
    };

    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(rail);
    observer?.observe(track);

    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [distance, shouldReduceMotion]);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });
  const storyProgress = useTransform(scrollYProgress, getStoryProgress);
  const trackX = useTransform(
    [storyProgress, distance],
    ([progress, measuredDistance]) => Number(progress) * direction * Number(measuredDistance),
  );
  useMotionValueEvent(storyProgress, 'change', (progress) => {
    const nextFrame = Math.min(storySteps.length - 1, Math.round(progress * (storySteps.length - 1)));
    setActiveFrame((currentFrame) => (currentFrame === nextFrame ? currentFrame : nextFrame));
  });

  return (
    <article
      ref={stageRef}
      className={`project-scroll-stage project-scroll-chapter relative border-t border-neutral-300/80 dark:border-neutral-800 ${shouldReduceMotion ? 'project-scroll-stage-static' : ''}`}
      data-project-visual={project.visual}
      aria-labelledby={titleId}
    >
      <div className="project-scroll-pin">
        <div className="project-scroll-hud mx-auto flex w-full max-w-[1480px] items-end justify-between gap-4 px-5 sm:px-8 lg:px-12" aria-hidden="true">
          <div className="flex items-center gap-3">
            <span className="project-scroll-index grid h-9 w-9 place-items-center border border-current font-mono text-[0.6rem] font-black">
              {String(projectIndex + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.16em] text-neutral-500">
                PROJECT {String(projectIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono text-[0.62rem] font-black tracking-[0.12em] text-neutral-800 dark:text-neutral-200">
                {t(`projects.${storySteps[activeFrame]}`)} {String(activeFrame + 1).padStart(2, '0')} / 03
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em] text-neutral-500 sm:flex">
            <span>{t('projects.scrollHint')}</span>
            <ArrowDown className="h-3.5 w-3.5 project-scroll-accent-text" />
          </div>
        </div>

        <div className="project-story-layout mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <aside className="project-story-anchor">
            {previewImage && (
              <a
                href={project.liveUrl}
                className="project-story-preview"
                aria-label={`${t('projects.openLivePreview')} ${projectTitle}`}
              >
                <img
                  src={previewImage}
                  alt={t(`projects.items.${project.id}.previewTitle`)}
                  width="1440"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="project-live-capture"
                />
                <span className="project-story-live">
                  {t('projects.liveDemo')} <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            )}
            <div className="project-story-identity">
              <div className="project-story-meta">
                <span>{t(`projects.statuses.${project.status}`)}</span>
                <span>{t(`projects.categories.${project.category}`)}</span>
              </div>
              <h3 id={titleId}>{projectTitle}</h3>
              <p>{t(project.summaryKey)}</p>
              <div className="project-story-tags" aria-label={t('projects.technologiesLabel')}>
                {project.tags.slice(0, 5).map((tag) => <span key={tag}>+ {tag}</span>)}
              </div>
            </div>
          </aside>

          <div ref={railRef} className="project-scroll-rail project-story-rail">
            <motion.div
              ref={trackRef}
              style={shouldReduceMotion ? undefined : { x: trackX }}
              className="project-scroll-track project-story-track"
            >
              <section className="project-scroll-frame project-story-slide project-story-challenge" data-frame-index="01">
                <div className="project-story-step"><span>01</span><span>/ 03</span></div>
                <Target className="project-story-icon" aria-hidden="true" />
                <p className="project-story-kicker">{t('projects.storyChallenge')}</p>
                <h4>{t('projects.problem')}</h4>
                <p className="project-story-lead">{t(`projects.items.${project.id}.problem`)}</p>
              </section>

              <section className="project-scroll-frame project-story-slide project-story-build" data-frame-index="02">
                <div className="project-story-step"><span>02</span><span>/ 03</span></div>
                <Hammer className="project-story-icon" aria-hidden="true" />
                <p className="project-story-kicker">{t('projects.storyBuild')}</p>
                <h4>{t('projects.solution')}</h4>
                <p className="project-story-lead">{t(`projects.items.${project.id}.solution`)}</p>
                <div className="project-story-role">
                  <span>{t('projects.role')}</span>
                  <p>{t(`projects.items.${project.id}.role`)}</p>
                </div>
              </section>

              <section className="project-scroll-frame project-story-slide project-story-result" data-frame-index="03">
                <div className="project-story-step"><span>03</span><span>/ 03</span></div>
                <CheckCircle2 className="project-story-icon" aria-hidden="true" />
                <p className="project-story-kicker">{t('projects.storyResult')}</p>
                <h4>{t('projects.storyResult')}</h4>
                <p className="project-story-impact">{t(project.impactKey)}</p>
                <p className="project-story-proof">{localizedProof}</p>
                {localizedOutcomes.length > 0 && (
                  <ul className="project-story-outcomes">
                    {localizedOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                  </ul>
                )}
                <ProjectActions project={project} />
              </section>
            </motion.div>
          </div>
        </div>

        {!shouldReduceMotion && (
          <div className="mx-auto h-px w-[calc(100%-2.5rem)] max-w-[calc(1480px-6rem)] overflow-hidden bg-neutral-300 dark:bg-neutral-800" aria-hidden="true">
            <motion.div style={{ scaleX: scrollYProgress }} className="project-scroll-progress h-full origin-left rtl:origin-right" />
          </div>
        )}
      </div>
    </article>
  );
};

const ProjectIndexRow = ({ project }: { project: Project }) => {
  const { t } = useTranslation();

  return (
    <li className="grid gap-3 border-t border-neutral-300/80 py-5 first:border-t-0 dark:border-neutral-800 md:grid-cols-[1.25fr_0.8fr_1.15fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-black text-neutral-950 dark:text-white">{t(`projects.items.${project.id}.title`)}</h4>
          <span className="border border-neutral-300 px-2 py-0.5 font-mono text-[0.56rem] font-bold uppercase tracking-[0.08em] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            {t(`projects.statuses.${project.status}`)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t(`projects.items.${project.id}.description`)}</p>
      </div>
      <div className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.08em] text-neutral-500">
        {t(`projects.categories.${project.category}`)}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.06em] text-neutral-500">
            <span className="me-1 text-primary-500">+</span>{tag}
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

      <div aria-label={t('projects.featuredLabel')} className="relative">
        {featuredProjects.map((project, index) => (
          <ProjectScrollChapter key={project.id} project={project} projectIndex={index} />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="border border-neutral-300/80 bg-white/55 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/55 md:p-8">
          <div className="mb-5 grid gap-3 border-b border-neutral-300/80 pb-5 dark:border-neutral-800 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="mb-2 font-mono text-[0.6rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">{t('projects.indexEyebrow')}</p>
              <h3 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">{t('projects.indexTitle')}</h3>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{t('projects.indexSubtitle')}</p>
          </div>
          <ul className="project-secondary-index">
            {secondaryProjects.map((project) => (
              <ProjectIndexRow key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Projects;
