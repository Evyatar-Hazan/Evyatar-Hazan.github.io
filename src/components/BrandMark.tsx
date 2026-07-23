type BrandMarkProps = {
  className?: string;
};

const BrandMark = ({ className = '' }: BrandMarkProps) => (
  <span className={`brand-mark ${className}`.trim()} aria-hidden="true" />
);

export default BrandMark;
