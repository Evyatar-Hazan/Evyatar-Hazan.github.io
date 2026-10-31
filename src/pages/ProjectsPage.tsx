import { ArrowUpRight, Check, Code2, ExternalLink, FileText, GitCompareArrows, RotateCcw, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import type { ProjectArchiveEntry } from '../data/projectArchive';
import { getProjectArchiveEntries } from '../data/projectArchive';
import { getPortfolioCapabilityGroups } from '../data/portfolioCapabilities';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';
import './ProjectsPage.css';
import { buildContactUrl } from '../features/contact/contactIntent';
import ProjectCardFacts from '../components/ProjectCardFacts';
import { formatLocaleIndex, formatLocaleNumber } from '../features/locale-presentation/formatLocale';

const CATEGORY_PARAM = 'category';
const CAPABILITY_PARAM = 'capability';
const COMPARE_PARAM = 'compare';
const MAX_COMPARISON = 3;

const ProjectLinks = ({ entry, compact = false }: { entry: ProjectArchiveEntry; compact?: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className={`projects-hub-links${compact ? ' is-compact' : ''}`}>
      {entry.caseStudyUrl ? (
        <Link to={entry.caseStudyUrl}>
          <FileText aria-hidden="true" />
          {t('projects.caseStudy')}
        </Link>
      ) : null}
      {entry.liveUrl ? (
        <a href={entry.liveUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" />
          {t('projectsHub.liveProduct')}
        </a>
      ) : null}
      {entry.codeUrl ? (
        <a href={entry.codeUrl} target="_blank" rel="noopener noreferrer">
          <Code2 aria-hidden="true" />
          {t('projects.code')}
        </a>
      ) : null}
    </div>
  );
};

const LifecycleStatus = ({ entry }: { entry: ProjectArchiveEntry }) => {
  const { t } = useTranslation();
  const lifecycle = entry.verification.status === 'verified'
    ? entry.verification.lifecycle
    : 'undocumented';
  const label = t(`projectsHub.lifecycle.${lifecycle}`);
  const qualifier = t(`projectsHub.lifecycleNote.${lifecycle}`);

  return (
    <span
      className="projects-hub-lifecycle"
      data-lifecycle={lifecycle}
      title={qualifier}
      aria-label={`${label}. ${qualifier}`}
    >
      <span aria-hidden="true" />
      {label}
    </span>
  );
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const [limitMessage, setLimitMessage] = useState('');
  const entries = useMemo(
    () => getProjectArchiveEntries(language, localizedPath),
    [language],
  );
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    entries.forEach((entry) => seen.set(entry.categoryId, entry.category));
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [entries]);
  const capabilities = useMemo(() => getPortfolioCapabilityGroups(language)
    .filter((group) => entries.some((entry) => entry.capabilityIds.includes(group.id))), [entries, language]);
  const validIds = useMemo(() => new Set(entries.map((entry) => entry.id)), [entries]);
  const rawCategory = searchParams.get(CATEGORY_PARAM) ?? '';
  const rawCapability = searchParams.get(CAPABILITY_PARAM) ?? '';
  const category = categories.some((item) => item.id === rawCategory) ? rawCategory : '';
  const capability = capabilities.find((item) => item.id === rawCapability)?.id ?? '';
  const rawCompareIds = (searchParams.get(COMPARE_PARAM) ?? '').split(',').filter(Boolean);
  const compareIds = [...new Set(rawCompareIds.filter((id) => validIds.has(id as ProjectArchiveEntry['id'])))].slice(0, MAX_COMPARISON);
  const comparedEntries = compareIds.flatMap((id) => {
    const entry = entries.find((candidate) => candidate.id === id);
    return entry ? [entry] : [];
  });
  const filteredEntries = entries.filter((entry) => (
    (!category || entry.categoryId === category)
    && (!capability || entry.capabilityIds.includes(capability))
  ));
  const featuredEntries = entries.filter((entry) => entry.featured);
  const caseStudyCount = entries.filter((entry) => entry.caseStudyUrl).length;
  const liveProductCount = entries.filter((entry) => entry.liveUrl).length;
  const formatNumber = (value: number) => formatLocaleNumber(value, language);

  usePageSeo({
    title: t('projectsHub.seoTitle'),
    description: t('projectsHub.seoDescription'),
    path: '/projects/',
  });

  useEffect(() => {
    const shouldNormalize = rawCategory !== category
      || rawCapability !== capability
      || rawCompareIds.join(',') !== compareIds.join(',');
    if (!shouldNormalize) return;

    const next = new URLSearchParams(searchParams);
    if (category) next.set(CATEGORY_PARAM, category);
    else next.delete(CATEGORY_PARAM);
    if (capability) next.set(CAPABILITY_PARAM, capability);
    else next.delete(CAPABILITY_PARAM);
    if (compareIds.length) next.set(COMPARE_PARAM, compareIds.join(','));
    else next.delete(COMPARE_PARAM);
    setSearchParams(next, { replace: true });
  }, [capability, category, compareIds, rawCapability, rawCategory, rawCompareIds, searchParams, setSearchParams]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const resetFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(CATEGORY_PARAM);
    next.delete(CAPABILITY_PARAM);
    setSearchParams(next);
  };

  const toggleComparison = (id: ProjectArchiveEntry['id']) => {
    setLimitMessage('');
    const isSelected = compareIds.includes(id);
    if (!isSelected && compareIds.length >= MAX_COMPARISON) {
      setLimitMessage(t('projectsHub.compareLimit'));
      return;
    }

    const nextIds = isSelected
      ? compareIds.filter((candidate) => candidate !== id)
      : [...compareIds, id];
    updateParam(COMPARE_PARAM, nextIds.join(','));
  };

  const clearComparison = () => updateParam(COMPARE_PARAM, '');

  return (
    <main id="main-content" tabIndex={-1} className="projects-hub">
      <div className="projects-hub-grid" aria-hidden="true" />
      <header className="content-container projects-hub-hero">
        <div>
          <h1 tabIndex={-1}>{t('projectsHub.title')}</h1>
          <p>{t('projectsHub.introduction')}</p>
        </div>
        <dl aria-label={t('projectsHub.countsLabel')}>
          <div><dt>{t('projectsHub.projectsCount')}</dt><dd>{formatNumber(entries.length)}</dd></div>
          <div><dt>{t('projectsHub.caseStudiesCount')}</dt><dd>{formatNumber(caseStudyCount)}</dd></div>
          <div><dt>{t('projectsHub.liveProductsCount')}</dt><dd>{formatNumber(liveProductCount)}</dd></div>
        </dl>
      </header>

      <section className="content-container projects-hub-section" aria-labelledby="projects-featured-title">
        <div className="projects-hub-section-heading">
          <div>
            <p>{t('projectsHub.featuredEyebrow')}</p>
            <h2 id="projects-featured-title">{t('projectsHub.featuredTitle')}</h2>
          </div>
          <p>{t('projectsHub.featuredDescription')}</p>
        </div>
        <div className="projects-hub-featured">
          {featuredEntries.map((entry, index) => (
            <article key={entry.id} data-hub-featured-project={entry.id} data-project-card={entry.id}>
              <div className="projects-hub-featured-index" aria-hidden="true">{formatLocaleIndex(index + 1, language)}</div>
              <div className="projects-hub-featured-main">
                <div className="projects-hub-project-meta">
                  <span>{entry.category}</span>
                  <LifecycleStatus entry={entry} />
                </div>
                <h3>{entry.title}</h3>
                <p className="projects-hub-summary">{entry.summary}</p>
                <ProjectCardFacts
                  role={entry.role}
                  problem={entry.problem}
                  result={entry.result}
                  status={entry.status}
                />
                <ul aria-label={t('projects.technologiesLabel')}>
                  {entry.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <div className="projects-hub-featured-actions">
                <ProjectLinks entry={entry} />
                <button
                  type="button"
                  aria-pressed={compareIds.includes(entry.id)}
                  onClick={() => toggleComparison(entry.id)}
                >
                  {compareIds.includes(entry.id) ? <Check aria-hidden="true" /> : <GitCompareArrows aria-hidden="true" />}
                  {compareIds.includes(entry.id) ? t('projectsHub.inComparison') : t('projectsHub.addToComparison')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-container projects-hub-section projects-hub-archive" aria-labelledby="projects-archive-title">
        <div className="projects-hub-section-heading">
          <div>
            <p>{t('projectsHub.archiveEyebrow')}</p>
            <h2 id="projects-archive-title">{t('projectsHub.archiveTitle')}</h2>
          </div>
          <p>{t('projectsHub.archiveDescription')}</p>
        </div>

        <div className="projects-hub-toolbar" role="group" aria-label={t('projectsHub.filterToolbar')}>
          <label>
            <span>{t('projectsHub.categoryFilter')}</span>
            <select value={category} onChange={(event) => updateParam(CATEGORY_PARAM, event.target.value)}>
              <option value="">{t('projectsHub.all')}</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>{t('projectsHub.capabilityFilter')}</span>
            <select value={capability} onChange={(event) => updateParam(CAPABILITY_PARAM, event.target.value)}>
              <option value="">{t('projectsHub.all')}</option>
              {capabilities.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <p className="projects-hub-result-count" aria-live="polite">
            {t('projectsHub.resultCount', {
              count: filteredEntries.length,
              formattedCount: formatNumber(filteredEntries.length),
            })}
          </p>
        </div>

        {filteredEntries.length ? (
          <ol className="projects-hub-list">
            {filteredEntries.map((entry, index) => (
              <li key={entry.id} data-project-id={entry.id} data-project-card={entry.id}>
                <span className="projects-hub-list-index" aria-hidden="true">{formatLocaleIndex(index + 1, language)}</span>
                <div className="projects-hub-list-copy">
                  <div className="projects-hub-project-meta"><span>{entry.category}</span><LifecycleStatus entry={entry} /></div>
                  <h3>{entry.title}</h3>
                  <p>{entry.summary}</p>
                  <ProjectCardFacts
                    role={entry.role}
                    problem={entry.problem}
                    result={entry.result}
                    status={entry.status}
                  />
                </div>
                <ul aria-label={t('projects.technologiesLabel')}>
                  {entry.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="projects-hub-list-actions">
                  <ProjectLinks entry={entry} compact />
                  <button
                    type="button"
                    aria-pressed={compareIds.includes(entry.id)}
                    onClick={() => toggleComparison(entry.id)}
                  >
                    {compareIds.includes(entry.id) ? <X aria-hidden="true" /> : <GitCompareArrows aria-hidden="true" />}
                    {compareIds.includes(entry.id) ? t('projectsHub.removeFromComparison') : t('projectsHub.addToComparison')}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="projects-hub-empty" role="status">
            <h3>{t('projectsHub.emptyTitle')}</h3>
            <p>{t('projectsHub.emptyDescription')}</p>
            <button type="button" onClick={resetFilters}><RotateCcw aria-hidden="true" />{t('projectsHub.resetFilters')}</button>
          </div>
        )}
      </section>

      <section className="content-container projects-hub-section projects-hub-compare" aria-labelledby="projects-compare-title">
        <div className="projects-hub-compare-heading">
          <div>
            <p>{t('projectsHub.compareEyebrow')}</p>
            <h2 id="projects-compare-title">{t('projectsHub.compareTitle')}</h2>
          </div>
          {compareIds.length ? <button type="button" onClick={clearComparison}>{t('projectsHub.clearComparison')}</button> : null}
        </div>
        <p className="projects-hub-compare-status" aria-live="polite">
          {limitMessage || (compareIds.length === 0
            ? t('projectsHub.compareEmpty')
            : compareIds.length === 1
              ? t('projectsHub.compareOne')
              : t('projectsHub.compareReady', {
                count: compareIds.length,
                formattedCount: formatNumber(compareIds.length),
              }))}
        </p>
        {comparedEntries.length >= 2 ? (
          <div className="projects-hub-comparison-grid">
            {comparedEntries.map((entry) => (
              <article key={entry.id} data-project-card={`comparison-${entry.id}`}>
                <div className="projects-hub-project-meta"><span>{entry.category}</span><LifecycleStatus entry={entry} /></div>
                <h3>{entry.title}</h3>
                <ProjectCardFacts
                  role={entry.role}
                  problem={entry.problem}
                  result={entry.result}
                  status={entry.status}
                />
                <dl>
                  <div><dt>{t('projectsHub.technologies')}</dt><dd>{entry.tags.join(' · ')}</dd></div>
                  <div><dt>{t('projectsHub.caseStudyAvailable')}</dt><dd>{entry.caseStudyUrl ? t('projectsHub.yes') : t('projectsHub.no')}</dd></div>
                  <div><dt>{t('projectsHub.liveProductAvailable')}</dt><dd>{entry.liveUrl ? t('projectsHub.yes') : t('projectsHub.no')}</dd></div>
                  <div><dt>{t('projectsHub.publicCodeAvailable')}</dt><dd>{entry.codeUrl ? t('projectsHub.yes') : t('projectsHub.no')}</dd></div>
                  <div><dt>{t('projectsHub.lifecycleStatus')}</dt><dd><LifecycleStatus entry={entry} /></dd></div>
                </dl>
                <ProjectLinks entry={entry} compact />
                <button type="button" className="projects-hub-remove" onClick={() => toggleComparison(entry.id)}>
                  <X aria-hidden="true" />{t('projectsHub.removeFromComparison')}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <div className="content-container projects-hub-contact">
        <p>{t('projectsHub.contactPrompt')}</p>
        <Link to={buildContactUrl(language, { intent: 'improve-existing' })}>{t('projectsHub.contactCta')}<ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </main>
  );
};

export default ProjectsPage;
