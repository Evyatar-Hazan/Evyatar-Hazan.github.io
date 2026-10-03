import { useId, useState } from 'react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { craftLabContent } from './craftLabContent';
import './CraftLab.css';

type ErrorState = 'idle' | 'failed' | 'recovered';
type UploadState = 'empty' | 'queued' | 'uploading' | 'processing' | 'ready' | 'failed';
type DiagramNodeId = 'request' | 'guardrail' | 'decision' | 'outcome';

export type CraftLabProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

const UsefulErrorExperiment = ({ language }: Pick<CraftLabProps, 'language'>) => {
  const content = craftLabContent[language];
  const [state, setState] = useState<ErrorState>('idle');

  return (
    <article className="craft-lab__experiment" data-experiment="error">
      <div className="craft-lab__experiment-header">
        <span className="craft-lab__number" aria-hidden="true">{content.error.number}</span>
        <div>
          <p className="craft-lab__synthetic">{content.syntheticLabel}</p>
          <h2>{content.error.title}</h2>
          <p>{content.error.summary}</p>
        </div>
      </div>

      <div className="craft-lab__window">
        <div className="craft-lab__window-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <b>REPORT / SAMPLE</b>
        </div>
        <dl className="craft-lab__facts">
          <div><dt>{content.error.workspaceLabel}</dt><dd>{content.error.workspaceValue}</dd></div>
          <div><dt>{content.error.dateLabel}</dt><dd>{content.error.dateValue}</dd></div>
        </dl>

        {state === 'failed' && (
          <div className="craft-lab__notice craft-lab__notice--error" role="alert">
            <strong>{content.error.alertTitle}</strong>
            <p>{content.error.alertBody}</p>
            <p className="craft-lab__preserved">{content.error.preserved}</p>
          </div>
        )}
        {state === 'recovered' && (
          <p className="craft-lab__notice craft-lab__notice--success" role="status">
            {content.error.recovered}
          </p>
        )}

        <div className="craft-lab__actions">
          {state === 'idle' && (
            <button className="craft-lab__button craft-lab__button--primary" type="button" onClick={() => setState('failed')}>
              {content.error.run}
            </button>
          )}
          {state === 'failed' && (
            <>
              <button className="craft-lab__button craft-lab__button--primary" type="button" onClick={() => setState('recovered')}>
                {content.error.retry}
              </button>
              <button className="craft-lab__button craft-lab__button--quiet" type="button" onClick={() => setState('recovered')}>
                {content.error.alternative}
              </button>
            </>
          )}
          {state !== 'idle' && (
            <button className="craft-lab__button craft-lab__button--text" type="button" onClick={() => setState('idle')}>
              {content.reset}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const uploadProgress: Record<UploadState, number> = {
  empty: 0,
  queued: 0,
  uploading: 48,
  processing: 100,
  ready: 100,
  failed: 48,
};

const MediaUploadExperiment = ({ language }: Pick<CraftLabProps, 'language'>) => {
  const content = craftLabContent[language];
  const [state, setState] = useState<UploadState>('empty');
  const progressId = useId();

  const advance = () => {
    setState((current) => {
      if (current === 'queued') return 'uploading';
      if (current === 'uploading') return 'processing';
      if (current === 'processing') return 'ready';
      return current;
    });
  };

  return (
    <article className="craft-lab__experiment" data-experiment="upload">
      <div className="craft-lab__experiment-header">
        <span className="craft-lab__number" aria-hidden="true">{content.upload.number}</span>
        <div>
          <p className="craft-lab__synthetic">{content.syntheticLabel}</p>
          <h2>{content.upload.title}</h2>
          <p>{content.upload.summary}</p>
        </div>
      </div>

      <div className="craft-lab__window">
        <div className="craft-lab__upload-topline">
          <span className={`craft-lab__state craft-lab__state--${state}`}>{content.upload.states[state]}</span>
          <span className="craft-lab__privacy">{content.upload.privacy}</span>
        </div>

        {state === 'empty' ? (
          <button
            className="craft-lab__dropzone"
            type="button"
            aria-label={content.upload.loadSample}
            onClick={() => setState('queued')}
          >
            <span aria-hidden="true">+</span>
            <strong>{content.upload.loadSample}</strong>
            <small>{content.upload.privacy}</small>
          </button>
        ) : (
          <div className="craft-lab__file">
            <div className="craft-lab__file-mark" aria-hidden="true">MP4</div>
            <div className="craft-lab__file-copy"><strong>{content.upload.fileName}</strong><span>{content.upload.fileMeta}</span></div>
            <span className="craft-lab__file-percent">{uploadProgress[state]}%</span>
          </div>
        )}

        {state !== 'empty' && (
          <>
            <label className="craft-lab__progress-label" id={progressId} htmlFor={`${progressId}-bar`}>
              {content.upload.progressLabel}
            </label>
            <progress id={`${progressId}-bar`} aria-labelledby={progressId} max="100" value={uploadProgress[state]} />
            <p className="craft-lab__upload-status" aria-live="polite">{content.upload.status[state]}</p>
          </>
        )}

        <div className="craft-lab__actions">
          {state === 'queued' && (
            <button className="craft-lab__button craft-lab__button--primary" type="button" onClick={() => setState('uploading')}>
              {content.upload.start}
            </button>
          )}
          {(state === 'uploading' || state === 'processing') && (
            <button className="craft-lab__button craft-lab__button--primary" type="button" onClick={advance}>
              {content.upload.advance}
            </button>
          )}
          {state === 'uploading' && (
            <button className="craft-lab__button craft-lab__button--quiet" type="button" onClick={() => setState('failed')}>
              {content.upload.fail}
            </button>
          )}
          {state === 'failed' && (
            <button className="craft-lab__button craft-lab__button--primary" type="button" onClick={() => setState('uploading')}>
              {content.upload.retry}
            </button>
          )}
          {state !== 'empty' && (
            <button className="craft-lab__button craft-lab__button--text" type="button" onClick={() => setState('empty')}>
              {content.upload.remove}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const InteractiveDiagramExperiment = ({ language }: Pick<CraftLabProps, 'language'>) => {
  const content = craftLabContent[language];
  const [selectedId, setSelectedId] = useState<DiagramNodeId>('request');
  const selected = content.diagram.nodes.find((node) => node.id === selectedId) ?? content.diagram.nodes[0];

  return (
    <article className="craft-lab__experiment craft-lab__experiment--wide" data-experiment="diagram">
      <div className="craft-lab__experiment-header">
        <span className="craft-lab__number" aria-hidden="true">{content.diagram.number}</span>
        <div>
          <p className="craft-lab__synthetic">{content.syntheticLabel}</p>
          <h2>{content.diagram.title}</h2>
          <p>{content.diagram.summary}</p>
        </div>
      </div>

      <div className="craft-lab__diagram-layout">
        <div className="craft-lab__diagram" role="group" aria-label={content.diagram.label}>
          {content.diagram.nodes.map((node, index) => (
            <div className="craft-lab__diagram-step" key={node.id}>
              <button
                type="button"
                aria-pressed={node.id === selectedId}
                className="craft-lab__diagram-node"
                onClick={() => setSelectedId(node.id)}
              >
                <span>{node.step}</span>
                <strong>{node.title}</strong>
                <small>{node.short}</small>
              </button>
              {index < content.diagram.nodes.length - 1 && <span className="craft-lab__connector" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>

        <aside className="craft-lab__diagram-detail" aria-live="polite">
          <p>{content.diagram.selectedLabel} / {selected.step}</p>
          <h3>{selected.title}</h3>
          <p>{selected.detail}</p>
          <strong>{selected.outcome}</strong>
        </aside>
      </div>
    </article>
  );
};

const CraftLab = ({ language, buildPath, className }: CraftLabProps) => {
  const content = craftLabContent[language];

  return (
    <div className={joinClassNames('craft-lab', className)}>
      <div className="craft-lab__grid" aria-hidden="true" />
      <header className="craft-lab__intro">
        <div>
          <p className="craft-lab__eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="craft-lab__lede">{content.introduction}</p>
        </div>
        <div className="craft-lab__disclosure" role="note">
          <span>EXPERIMENT / SYNTHETIC</span>
          <p>{content.disclosure}</p>
        </div>
      </header>

      <section className="craft-lab__experiments" aria-label={content.eyebrow}>
        <UsefulErrorExperiment language={language} />
        <MediaUploadExperiment language={language} />
        <InteractiveDiagramExperiment language={language} />
      </section>

      <div className="craft-lab__footer">
        <p>{content.disclosure}</p>
        <nav aria-label={language === 'he' ? 'המשך מהמעבדה' : 'Continue from the lab'}>
          <a className="craft-lab__button craft-lab__button--primary" href={buildPath(language, { route: 'projects' })}>{content.deliveredWork}</a>
          <a className="craft-lab__button craft-lab__button--quiet" href={buildPath(language, { route: 'contact' })}>{content.discussProject}</a>
        </nav>
      </div>
    </div>
  );
};

export default CraftLab;
