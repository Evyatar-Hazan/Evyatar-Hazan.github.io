function RegistryMechanism() {
  return (
    <div className="world-mechanism registry-mechanism" aria-hidden="true">
      <div className="registry-source"><strong>124</strong><span>ONE REGISTRY</span></div>
      <div className="registry-routes">
        {['TOOLS', 'CATEGORIES', 'METADATA', 'LINKS', 'TESTS'].map((label, index) => (
          <span className={`registry-route registry-route-${index + 1}`} key={label}>{label}</span>
        ))}
      </div>
      <span className="registry-scan" />
    </div>
  );
}
function ProtocolMechanism() {
  return (
    <div className="world-mechanism protocol-mechanism" aria-hidden="true">
      <svg viewBox="0 0 760 520">
        <path className="protocol-branch protocol-branch-a" d="M50 90 C210 90 205 260 380 260" />
        <path className="protocol-branch protocol-branch-b" d="M50 260 C210 260 215 260 380 260" />
        <path className="protocol-branch protocol-branch-c" d="M50 430 C210 430 205 260 380 260" />
        <path className="protocol-guide" d="M380 260 C520 260 585 260 710 260" />
        <circle cx="50" cy="90" r="7" />
        <circle cx="50" cy="260" r="7" />
        <circle cx="50" cy="430" r="7" />
        <circle className="protocol-decision" cx="380" cy="260" r="10" />
        <circle className="protocol-outcome" cx="710" cy="260" r="7" />
      </svg>
      <span className="protocol-focus">ONE DECISION</span>
    </div>
  );
}

export function WorldMechanism({ type }) {
  return type === 'growth' ? <RegistryMechanism /> : <ProtocolMechanism />;
}
