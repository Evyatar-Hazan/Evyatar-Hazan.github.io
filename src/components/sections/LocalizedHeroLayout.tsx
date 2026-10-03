import type {
  MouseEventHandler,
  ReactNode,
} from 'react';
import { motion, type MotionStyle } from 'framer-motion';
import type {
  LocalizedPathBuilder,
  PortfolioRouteTarget,
} from '../../contracts/portfolio';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import styles from './LocalizedHeroLayout.module.css';

export type LocalizedHeroCopy = {
  availability: string;
  prelude: string;
  headline: string;
  description: string;
  signature?: string;
};

type LocalizedHeroActionBase = {
  label: string;
  ariaLabel?: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type LocalizedHeroAction = LocalizedHeroActionBase & (
  | {
      target: PortfolioRouteTarget;
      href?: never;
      external?: false;
    }
  | {
      href: string;
      target?: never;
      external?: boolean;
    }
);

export type LocalizedHeroLayoutProps = {
  language: PortfolioLanguage;
  buildPath: LocalizedPathBuilder;
  copy: LocalizedHeroCopy;
  primaryAction: LocalizedHeroAction;
  secondaryAction: LocalizedHeroAction;
  visual?: ReactNode;
  className?: string;
  copyStyle?: MotionStyle;
};

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

const resolveHref = (
  action: LocalizedHeroAction,
  language: PortfolioLanguage,
  buildPath: LocalizedPathBuilder,
) => ('target' in action && action.target
  ? buildPath(language, action.target)
  : action.href);

const HeroAction = ({
  action,
  buildPath,
  language,
  variant,
}: {
  action: LocalizedHeroAction;
  buildPath: LocalizedPathBuilder;
  language: PortfolioLanguage;
  variant: 'primary' | 'secondary';
}) => {
  const externalProps = action.external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      href={resolveHref(action, language, buildPath)}
      aria-label={action.ariaLabel}
      onClick={action.onClick}
      className={variant === 'primary' ? styles.primaryAction : styles.secondaryAction}
      {...externalProps}
    >
      <span>{action.label}</span>
      {action.icon && <span className={styles.actionIcon} aria-hidden="true">{action.icon}</span>}
    </a>
  );
};

/**
 * Content-aware hero copy and action layout for the canonical Product Compiler.
 * The integration owner supplies localized copy, route construction and the
 * existing animated visual so this feature does not own shared routing or Home.
 */
export const LocalizedHeroLayout = ({
  language,
  buildPath,
  copy,
  primaryAction,
  secondaryAction,
  visual,
  className,
  copyStyle,
}: LocalizedHeroLayoutProps) => (
  <div
    className={joinClassNames(styles.layout, className)}
    data-language={language}
    data-testid="localized-hero-layout"
  >
    <motion.div className={styles.copy} style={copyStyle}>
      <p className={styles.availability}>
        <span className={styles.availabilityIndicator} aria-hidden="true" />
        <span>{copy.availability}</span>
      </p>

      <h1 className={styles.heading}>
        <span className={styles.prelude}>{copy.prelude}</span>
        {' '}
        <span className={styles.headline}>{copy.headline}</span>
      </h1>

      <p className={styles.description}>{copy.description}</p>

      <div className={styles.actions} data-testid="localized-hero-actions">
        <HeroAction
          action={primaryAction}
          buildPath={buildPath}
          language={language}
          variant="primary"
        />
        <HeroAction
          action={secondaryAction}
          buildPath={buildPath}
          language={language}
          variant="secondary"
        />
      </div>

      {copy.signature && (
        <p className={styles.signature} translate="no">
          <span aria-hidden="true" />
          {copy.signature}
        </p>
      )}
    </motion.div>

    {visual && <div className={styles.visual}>{visual}</div>}
  </div>
);

export default LocalizedHeroLayout;
