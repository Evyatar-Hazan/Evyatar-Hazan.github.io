import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink, Github } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import type { RelatedContentItem } from './RelatedContentLinks';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';
import {
  caseStudyStoryLabels,
  type CaseStudyStory as CaseStudyStoryData,
  type CaseStudyStoryProjectId,
} from '../data/caseStudyStories';
import type { Project, ProjectCaseStudy } from '../data/profile';
import CaseStudyEvidence from './CaseStudyEvidence';
import './CaseStudyStory.css';
import { buildContactUrl } from '../features/contact/contactIntent';

type CaseStudyStoryProps = {
  buildPath: LocalizedPathBuilder;
  caseStudy: ProjectCaseStudy;
  categoryLabel: string;
  challenge: string;
  description: string;
  impact: string;
  language: PortfolioLanguage;
  nextProject: Project;
  project: Project & { id: CaseStudyStoryProjectId };
  relatedCapabilities: readonly {
    id: string;
    label: string;
    reason: string;
  }[];
  relatedWriting: readonly RelatedContentItem[];
  role: string;
  story: CaseStudyStoryData;
  supplementaryEvidence?: ReactNode;
  statusLabel: string;
  title: string;
  visualProof: ReactNode;
};

const pick = <Value,>(value: Record<PortfolioLanguage, Value>, language: PortfolioLanguage) => value[language];

const coreChapters = ['challenge', 'decisions', 'system', 'evidence'] as const;

const linkClassName = 'case-story-action';

const CaseStudyStory = ({
  buildPath,
  caseStudy,
  categoryLabel,
  challenge,
  description,
  impact,
  language,
  nextProject,
  project,
  relatedCapabilities,
  relatedWriting,
  role,
  story,
  supplementaryEvidence,
  statusLabel,
  title,
  visualProof,
}: CaseStudyStoryProps) => {
  const labels = caseStudyStoryLabels[language];
  const detailsId = `case-appendix-${project.id}`;
  const executiveSummaryId = `executive-summary-${project.id}`;
  const nextProjectTitle = language === 'he'
    ? nextProject.caseStudy?.seoTitle.he.replace(/^קייס סטאדי:\s*/u, '').replace(/\s*\|.*$/u, '') ?? nextProject.id
    : nextProject.caseStudy?.seoTitle.en.replace(/ Case Study \|.*$/u, '') ?? nextProject.id;

  const chapterLabels: Record<(typeof coreChapters)[number], string> = {
    challenge: labels.problem,
    decisions: labels.decision,
    system: labels.execution,
    evidence: labels.outcome,
  };
  const executiveSummary = [
    { label: labels.summaryProblem, value: challenge },
    { label: labels.summaryContribution, value: role },
    { label: labels.summaryResult, value: impact },
    { label: labels.summaryLimitations, value: pick(story.limitation, language) },
  ];

  return (
    <article
      className="case-story"
      data-case-study-template="product-story-v1"
      data-case-study-structure="problem-decision-execution-outcome"
      data-project-id={project.id}
      data-accent={story.accent}
    >
      <header className="case-story-hero">
        <div className="case-story-hero-copy">
          <p className="case-story-kicker">{pick(caseStudy.eyebrow, language)}</p>
          <h1>{title}</h1>
          <p className="case-story-value">{description}</p>
          <div className="case-story-hero-facts">
            <div>
              <span>{labels.heroAudience}</span>
              <p>{pick(caseStudy.audience, language)}</p>
            </div>
            <div>
              <span>{labels.heroRole}</span>
              <p>{role}</p>
            </div>
          </div>
        </div>

        <aside className="case-story-hero-meta" aria-label={`${title} metadata`}>
          <div className="case-story-status-line">
            <span>{statusLabel}</span>
            <span>{categoryLabel}</span>
          </div>
          <ul className="case-story-tags" aria-label="Technologies">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="case-story-actions">
            {project.liveUrl && (
              <a className={linkClassName} href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                {labels.liveProduct}
                <ExternalLink aria-hidden="true" />
              </a>
            )}
            <a className={`${linkClassName} case-story-action--quiet`} href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              {labels.sourceCode}
              <Github aria-hidden="true" />
            </a>
          </div>
        </aside>
      </header>

      <section
        className="case-story-executive-summary"
        aria-labelledby={executiveSummaryId}
        data-executive-summary={project.id}
      >
        <header>
          <p>{labels.executiveSummaryDescription}</p>
          <h2 id={executiveSummaryId}>{labels.executiveSummary}</h2>
        </header>
        <dl>
          {executiveSummary.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="visual-proof" className="case-story-section case-story-visual-stage" aria-label={labels.visualProof}>
        {visualProof}
      </section>

      <nav className="case-story-chapters" aria-label={labels.chapterNavigation}>
        <ol>
          {coreChapters.map((id, index) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {chapterLabels[id]}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="challenge" className="case-story-section case-story-role" aria-labelledby="challenge-title">
        <div className="case-story-section-label">01</div>
        <div>
          <h2 id="challenge-title">{labels.problem}</h2>
          <p className="case-story-lede">{challenge}</p>
          <div className="case-story-context">
            {pick(caseStudy.overview, language).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="case-story-role-boundary">
          <span>{labels.heroRole}</span>
          <p>{role}</p>
        </div>
      </section>

      <section id="decisions" className="case-story-section" aria-labelledby="decisions-title">
        <div className="case-story-section-heading">
          <span className="case-story-section-label">02</span>
          <h2 id="decisions-title">{labels.decision}</h2>
        </div>
        <ol className="case-story-decisions">
          {story.decisions.map((decision, index) => (
            <li key={pick(decision.choice, language)}>
              <span className="case-story-decision-number">{String(index + 1).padStart(2, '0')}</span>
              <dl>
                <div>
                  <dt>{labels.decisionNeed}</dt>
                  <dd>{pick(decision.need, language)}</dd>
                </div>
                <div>
                  <dt>{labels.decisionChoice}</dt>
                  <dd>{pick(decision.choice, language)}</dd>
                </div>
                <div>
                  <dt>{labels.decisionImpact}</dt>
                  <dd>{pick(decision.impact, language)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section id="system" className="case-story-section case-story-system" aria-labelledby="system-title">
        <div className="case-story-section-heading">
          <span className="case-story-section-label">03</span>
          <div>
            <h2 id="system-title">{labels.execution}</h2>
            <p>{pick(story.system.caption, language)}</p>
          </div>
        </div>
        <ol className="case-story-system-flow" aria-label={pick(story.system.caption, language)}>
          {story.system.nodes.map((systemNode, index) => (
            <li key={systemNode.id} data-boundary={systemNode.boundary}>
              <span className="case-story-node-index">{String(index + 1).padStart(2, '0')}</span>
              <strong>{pick(systemNode.label, language)}</strong>
              <p>{pick(systemNode.detail, language)}</p>
            </li>
          ))}
        </ol>
        <div className="case-story-system-legend" aria-label={labels.systemLegend}>
          <span data-boundary="public">{labels.publicBoundary}</span>
          <span data-boundary="production">{labels.productionBoundary}</span>
          {story.system.nodes.some(({ boundary }) => boundary === 'local') && (
            <span data-boundary="local">{labels.localBoundary}</span>
          )}
        </div>
        {story.system.boundaryNote && (
          <p className="case-story-boundary-note">{pick(story.system.boundaryNote, language)}</p>
        )}
      </section>

      <section id="evidence" className="case-story-section case-story-evidence" aria-labelledby="evidence-title">
        <div className="case-story-section-label">04</div>
        <div>
          <h2 id="evidence-title">{labels.outcome}</h2>
          <p className="case-story-lede">{impact}</p>
          <ul className="case-story-outcomes">
            {caseStudy.outcomes.map((outcome) => {
              const value = outcome.support.kind === 'metric'
                ? outcome.support.value
                : pick(outcome.support.value, language);

              return (
                <li key={`${outcome.support.kind}:${pick(outcome.statement, language)}`} data-outcome-support={outcome.support.kind}>
                  <div className="case-story-outcome-measure">
                    <strong>{value}</strong>
                    <span>{pick(outcome.support.label, language)}</span>
                  </div>
                  <p>{pick(outcome.statement, language)}</p>
                  {outcome.support.kind !== 'boundary' && (
                    <a href={outcome.support.source.url} target="_blank" rel="noopener noreferrer">
                      {pick(outcome.support.source.label, language)}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="case-story-evidence-panel">
          <span>{labels.evidenceStatus}</span>
          <strong data-evidence-status={caseStudy.evidenceStatus}>
            {caseStudy.evidenceStatus === 'verified' ? labels.verified : labels.unverified}
          </strong>
          <p>{pick(caseStudy.proof, language)}</p>
          <CaseStudyEvidence
            evidence={caseStudy}
            language={language}
            labels={{
              sources: language === 'he' ? 'מקורות ראיה ציבוריים' : 'Public evidence sources',
              unknown: labels.unverified,
              verifiedOn: language === 'he' ? 'אומת בתאריך' : 'Verified on',
            }}
          />
        </aside>
        {supplementaryEvidence && <div className="case-story-supplementary">{supplementaryEvidence}</div>}
      </section>

      <section id="appendix" className="case-story-section" aria-labelledby="appendix-title">
        <details className="case-story-appendix">
          <summary aria-controls={detailsId}>
            <span>
              <small>05</small>
              <strong id="appendix-title" className="case-story-appendix-open">{labels.appendixOpen}</strong>
              <strong className="case-story-appendix-close">{labels.appendixClose}</strong>
              <span>{labels.appendixDescription}</span>
            </span>
            <ChevronDown aria-hidden="true" />
          </summary>
          <div id={detailsId} className="case-story-appendix-body">
            <section aria-labelledby={`${detailsId}-context`}>
              <h3 id={`${detailsId}-context`}>{labels.context}</h3>
              {pick(caseStudy.overview, language).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
            <section aria-labelledby={`${detailsId}-verification`}>
              <h3 id={`${detailsId}-verification`}>{labels.verification}</h3>
              <ul>
                {pick(story.technicalNotes, language).map((note) => <li key={note}>{note}</li>)}
              </ul>
              {caseStudy.evidenceStatus === 'unknown' && <p>{labels.verificationUnknown}</p>}
            </section>
          </div>
        </details>
      </section>

      <section id="next" className="case-story-section case-story-next" aria-labelledby="next-title">
        <div className="case-story-section-heading">
          <span className="case-story-section-label">06</span>
          <h2 id="next-title">{labels.next}</h2>
        </div>
        <div className="case-story-next-grid">
          <div data-related-content="project-context">
            <h3>{labels.relatedWriting}</h3>
            {relatedWriting.length > 0 ? (
              <ul>
                {relatedWriting.map((item) => (
                  <li key={`${item.target.route}:${item.target.id}`} data-related-reason={item.reason}>
                    <Link to={buildPath(language, item.target)}>{item.label}<ArrowRight aria-hidden="true" className="rtl:rotate-180" /></Link>
                    <p>{item.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Link className={linkClassName} to={buildPath(language, { route: 'blog' })}>{labels.relatedWriting}</Link>
            )}
            {relatedCapabilities.length > 0 && (
              <div className="case-story-related-capabilities" data-related-capabilities>
                <h3>{labels.relatedCapabilities}</h3>
                <ul>
                  {relatedCapabilities.map((capability) => (
                    <li key={capability.id}>
                      <strong>{capability.label}</strong>
                      <p>{capability.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <h3>{labels.nextProject}</h3>
            <Link className="case-story-next-project" to={buildPath(language, { route: 'project', id: nextProject.id as CaseStudyStoryProjectId })}>
              <span>{nextProjectTitle}</span>
              <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
        <nav aria-label={labels.next} className="case-story-footer-actions">
          <Link className={`${linkClassName} case-story-action--quiet`} to={buildPath(language, { route: 'projects' })}>
            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
            {labels.allProjects}
          </Link>
          <Link className={linkClassName} to={buildContactUrl(language, { intent: 'project', projectId: project.id })}>
            {labels.contact}
            <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
          </Link>
        </nav>
      </section>
    </article>
  );
};

export default CaseStudyStory;
