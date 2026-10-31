import { BadgeCheck, BriefcaseBusiness, Code2, PanelsTopLeft } from 'lucide-react';

type ProductCompilerVisualProps = {
  isHebrew: boolean;
  labels: {
    business: string;
    experience: string;
    engineering: string;
    ready: string;
  };
};

const ProductCompilerVisual = ({
  isHebrew,
  labels,
}: ProductCompilerVisualProps) => {
  const layers = [
    { id: 'business', number: '01', label: labels.business, Icon: BriefcaseBusiness },
    { id: 'experience', number: '02', label: labels.experience, Icon: PanelsTopLeft },
    { id: 'engineering', number: '03', label: labels.engineering, Icon: Code2 },
  ] as const;

  return (
    <div
      className={`product-compiler-scene ${isHebrew ? 'product-compiler-scene-rtl' : ''}`}
      aria-hidden="true"
      data-testid="product-compiler-visual"
    >
      <div className="product-compiler-flow">
        <div className="product-compiler-inputs">
          {layers.map(({ id, number, label, Icon }) => (
            <div
              key={id}
              className={`product-compiler-input product-compiler-input-${id}`}
              data-compiler-layer={id}
            >
              <div className="product-compiler-input-heading">
                <span className="product-compiler-input-number">{number}</span>
                <span className="product-compiler-input-icon"><Icon /></span>
              </div>
              <strong>{label}</strong>
              <span className="product-compiler-signal" aria-hidden="true">
                <i /><i /><i />
              </span>
            </div>
          ))}
        </div>

        <svg
          aria-hidden="true"
          focusable="false"
          className="product-compiler-connectors product-compiler-connectors-desktop"
          viewBox="0 0 96 360"
          fill="none"
        >
          <path d="M0 58 H24 C42 58 42 180 72 180 H96" />
          <path d="M0 180 H96" />
          <path d="M0 302 H24 C42 302 42 180 72 180 H96" />
          <circle cx="72" cy="180" r="4" />
        </svg>

        <svg
          aria-hidden="true"
          focusable="false"
          className="product-compiler-connectors product-compiler-connectors-mobile"
          viewBox="0 0 360 52"
          fill="none"
        >
          <path d="M60 0 V14 C60 30 180 24 180 48" />
          <path d="M180 0 V48" />
          <path d="M300 0 V14 C300 30 180 24 180 48" />
          <circle cx="180" cy="48" r="4" />
        </svg>

        <div
          className="product-compiler-output"
          data-compiler-output="true"
        >
          <div className="product-compiler-output-header">
            <div className="product-compiler-output-status">
              <BadgeCheck />
              <strong>{labels.ready}</strong>
            </div>
            <span className="product-compiler-output-code">BUILD / 01</span>
          </div>

          <div className="product-compiler-output-body">
            <div className="product-compiler-output-sidebar">
              <span className="is-active" />
              <span />
              <span />
              <span />
            </div>
            <div className="product-compiler-output-interface">
              <div className="product-compiler-output-toolbar">
                <span />
                <i /><i />
              </div>
              <div className="product-compiler-output-content">
                <div className="product-compiler-output-copy">
                  <strong />
                  <span />
                  <span />
                  <i />
                </div>
                <div className="product-compiler-output-panel">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>

          <div className="product-compiler-output-footer">
            {layers.map(({ id, number }) => (
              <span key={id} className={`product-compiler-output-indicator is-${id}`}>
                <i /> {number}
              </span>
            ))}
            <span className="product-compiler-output-verified"><BadgeCheck /> VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCompilerVisual;
