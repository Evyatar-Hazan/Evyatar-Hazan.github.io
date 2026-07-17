import { Children } from 'react';

export function CaseJourneyLayout({ children, className = '', mediaStage, route, theme }) {
  const [intro, ...acts] = Children.toArray(children);

  return (
    <main
      id="main-content"
      className={`route-main case-study case-cinema-layout ${className}`.trim()}
      tabIndex="-1"
      data-focus-target
      data-cinema-route={route}
      data-cinema-theme={theme}
    >
      <div className="case-cinema-tracks case-cinema-tracks-before">
        {intro}
      </div>

      <div className="case-cinema-stage" data-cinema-persistent-stage>
        <div className="case-cinema-stage-pin">
          <div className="case-cinema-stage-window" data-cinema-window="0,1">
            {mediaStage}
          </div>
        </div>
      </div>

      <div className="case-cinema-tracks case-cinema-tracks-after">
        {acts}
      </div>
    </main>
  );
}

export function CaseCinemaTrack({
  act,
  as: Tag = 'section',
  children,
  className = '',
  index,
  windowClassName = '',
  ...props
}) {
  const holdsFinalFrame = act === 'close';
  const atmosphereWindow = holdsFinalFrame ? '0,1' : '0,0.72';
  const contentWindow = holdsFinalFrame ? '0,1' : '0,0.9';
  const railWindow = holdsFinalFrame ? '0.28,1' : '0.28,0.92';

  return (
    <Tag
      {...props}
      className={`case-cinema-track ${className}`.trim()}
      data-cinema-track={act}
      data-cinema-act={act}
      data-cinema-id={act}
      data-cinema-phase={props['data-journey-phase'] || act}
      data-cinema-theme={props['data-journey-theme'] || 'case'}
      data-cinema-title={props['data-journey-label'] || act}
    >
      <div className="case-cinema-pin" data-cinema-pin>
        <div className="case-cinema-atmosphere" data-cinema-window={atmosphereWindow} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div
          className={`case-cinema-window case-cinema-readable ${windowClassName}`.trim()}
          data-cinema-window={contentWindow}
        >
          {children}
        </div>

        <div className="case-cinema-rail" data-cinema-window={railWindow} aria-hidden="true">
          <span>{index}</span>
          <i />
        </div>
      </div>
    </Tag>
  );
}
