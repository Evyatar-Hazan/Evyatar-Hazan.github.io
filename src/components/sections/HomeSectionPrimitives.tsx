import type { ReactNode } from 'react';

type HomeSectionHeaderProps = {
  description: ReactNode;
  eyebrow: ReactNode;
  index: string;
  title: ReactNode;
  titleId?: string;
};

export const HomeSectionHeader = ({
  description,
  eyebrow,
  index,
  title,
  titleId,
}: HomeSectionHeaderProps) => (
  <header className="home-section-header">
    <div className="home-section-header__title">
      <p className="home-section-label">
        <span aria-hidden="true">{index}</span>
        <i aria-hidden="true" className="home-section-label__rule" />
        {eyebrow}
      </p>
      <h2 id={titleId}>{title}</h2>
    </div>
    <div className="home-section-header__description">{description}</div>
  </header>
);

