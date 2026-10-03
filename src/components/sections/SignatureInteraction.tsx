import { useState } from 'react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { getSignatureInteractionCopy } from '../../data/signatureInteraction';
import styles from './SignatureInteraction.module.css';

export type SignatureInteractionStableIds = {
  section: string;
  heading: string;
  detail: string;
  status: string;
};

export type SignatureInteractionProps = PortfolioSlotProps & {
  localizedPath: LocalizedPathBuilder;
  stableIds: SignatureInteractionStableIds;
};

const SignatureInteraction = ({
  className = '',
  language,
  localizedPath,
  stableIds,
}: SignatureInteractionProps) => {
  const copy = getSignatureInteractionCopy(language);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = copy.steps[activeIndex] ?? copy.steps[0];
  const isLastStep = activeIndex === copy.steps.length - 1;
  const projectsPath = localizedPath(language, { route: 'projects' });

  const selectStep = (index: number) => {
    setActiveIndex(index);
  };

  const advance = () => {
    setActiveIndex((currentIndex) => (
      currentIndex === copy.steps.length - 1 ? 0 : currentIndex + 1
    ));
  };

  return (
    <section
      id={stableIds.section}
      aria-labelledby={stableIds.heading}
      className={`${styles.section} ${className}`.trim()}
      dir={language === 'he' ? 'rtl' : 'ltr'}
      data-portfolio-slot="shell.signatureInteraction"
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h2 id={stableIds.heading} className={styles.title}>{copy.title}</h2>
          <p className={styles.introduction}>{copy.introduction}</p>
          <p className={styles.disclosure}>{copy.disclosure}</p>
        </header>

        <div className={styles.workspace}>
          <ol className={styles.steps}>
            {copy.steps.map((step, index) => {
              const stepDomId = `${stableIds.section}-${step.id}`;
              const isActive = activeIndex === index;

              return (
                <li
                  key={step.id}
                  className={styles.stepItem}
                  data-connected={index < activeIndex ? 'true' : 'false'}
                >
                  <button
                    id={stepDomId}
                    type="button"
                    className={styles.stepButton}
                    data-active={isActive ? 'true' : 'false'}
                    aria-pressed={isActive}
                    aria-controls={stableIds.detail}
                    onClick={() => selectStep(index)}
                  >
                    <span className={styles.stepIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepSummary}>{step.summary}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={styles.readout}>
            <div
              id={stableIds.detail}
              className={styles.detail}
              aria-live="polite"
              aria-atomic="true"
            >
              <p id={stableIds.status} className={styles.activeLabel}>
                {copy.controls.stepAnnouncement}: {activeStep.label}
              </p>
              <p className={styles.detailText}>{activeStep.detail}</p>
            </div>

            <div className={styles.outcome}>
              <span className={styles.outcomeLabel}>{copy.outcomeLabel}</span>
              <p className={styles.outcomeText}>{copy.outcome}</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.nextButton} onClick={advance}>
              {isLastStep ? copy.controls.restart : copy.controls.next}
            </button>
            <a className={styles.evidenceLink} href={projectsPath}>
              {copy.controls.explore}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureInteraction;
