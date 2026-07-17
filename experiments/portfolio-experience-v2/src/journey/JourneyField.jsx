const phaseNumbers = {
  about: '05',
  archive: '04',
  capabilities: '06',
  contact: '08',
  conversion: '01',
  forge: '00',
  growth: '02',
  lab: '07',
  complexity: '03',
};

export function JourneyField({ journey, progressRef }) {
  const explicitNumber = journey.label.match(/^(\d{2})\s*\//)?.[1];
  const number = explicitNumber || phaseNumbers[journey.phase] || String(journey.index + 1).padStart(2, '0');
  const label = journey.label.replace(/^\d{2}\s*\/\s*/, '');
  const beatLabel = journey.beat.startsWith('beat-')
    ? ''
    : journey.beat.replaceAll('-', ' ');

  return (
    <div className="journey-field" aria-hidden="true">
      <div className="journey-ambient">
        <span className="journey-lens journey-lens-outer" />
        <span className="journey-lens journey-lens-inner" />
        <span className="journey-core" />
      </div>

      <svg className="journey-map" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path className="journey-path journey-path-a" d="M-80 840 C210 820 250 610 485 560 C720 510 720 210 1080 170" />
        <path className="journey-path journey-path-b" d="M-80 180 C220 220 280 430 500 500 C710 568 780 800 1080 830" />
        <path className="journey-path journey-path-c" d="M500 -80 C510 210 480 330 500 500 C520 670 490 790 500 1080" />
        <circle className="journey-map-node" cx="500" cy="500" r="7" />
      </svg>

      <div className="journey-rail">
        <div className="journey-rail-copy">
          <span>{number}</span>
          <strong>{label}</strong>
        </div>
        <div className="journey-rail-track"><i ref={progressRef} /></div>
        {beatLabel && <span className="journey-rail-beat">{beatLabel}</span>}
      </div>
    </div>
  );
}
