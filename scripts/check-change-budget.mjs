import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import process from 'node:process';

const SECTION_MARKERS = {
  scope: ['<!-- change-budget:scope -->', '<!-- /change-budget:scope -->'],
  outOfScope: ['<!-- change-budget:out-of-scope -->', '<!-- /change-budget:out-of-scope -->'],
};

const PLACEHOLDER_PATTERNS = [
  /^describe\b/iu,
  /^list\b/iu,
  /^todo\b/iu,
  /^tbd\b/iu,
  /^n\/?a$/iu,
  /^none$/iu,
  /^-$/u,
];

const extractSection = (body, [startMarker, endMarker]) => {
  const start = body.indexOf(startMarker);
  const end = body.indexOf(endMarker, start + startMarker.length);

  if (start === -1 || end === -1 || end < start) return null;

  return body.slice(start + startMarker.length, end).trim();
};

const isMeaningful = (value) => Boolean(
  value
  && value.length >= 12
  && !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value)),
);

export const validateChangeBudget = (body) => {
  const errors = [];
  const normalizedBody = typeof body === 'string' ? body : '';

  if (!normalizedBody.includes('<!-- change-budget:v1 -->')) {
    errors.push('PR body must use the repository change-budget template.');
  }

  if (!/- \[[xX]\] I documented this change budget before editing implementation code\./u.test(normalizedBody)) {
    errors.push('Confirm that the change budget was documented before implementation code was edited.');
  }

  const scope = extractSection(normalizedBody, SECTION_MARKERS.scope);
  const outOfScope = extractSection(normalizedBody, SECTION_MARKERS.outOfScope);

  if (!isMeaningful(scope)) {
    errors.push('Scope must replace the template placeholder with a concrete change boundary.');
  }

  if (!isMeaningful(outOfScope)) {
    errors.push('Out of scope must replace the template placeholder with concrete exclusions.');
  }

  if (scope && outOfScope && scope === outOfScope) {
    errors.push('Scope and out of scope must define different boundaries.');
  }

  return { errors, outOfScope, scope };
};

const run = () => {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH is required. Run this check from a pull_request workflow.');
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8'));
  const result = validateChangeBudget(event.pull_request?.body);

  if (result.errors.length > 0) {
    for (const error of result.errors) console.error(`::error title=Invalid change budget::${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('Change budget is complete: scope and out-of-scope were documented before code.');
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();
