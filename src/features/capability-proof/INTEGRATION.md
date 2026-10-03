# Capability proof integration

Task `t04` owns the `projects.capabilityProof` slot.

The integrator should import `createCapabilityProofRegistration` from this directory and pass the shared `LocalizedPathBuilder`:

```ts
const capabilityProof = createCapabilityProofRegistration(buildLocalizedPath);
```

Mount `capabilityProof.Component` at the approved capability-proof slot. Do not copy project titles, article metadata, routes, or task72 evidence into the shell: the feature resolves all of them from canonical sources.

Measured outcomes are intentionally empty while the referenced case studies retain task72's `evidenceStatus: 'unknown'`. When an existing case study becomes `verified`, the feature will surface its date and public evidence links without a second evidence schema.
