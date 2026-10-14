import { describe, expect, it } from 'vitest';
import { validateChangeBudget } from './check-change-budget.mjs';

const body = ({ checked = true, scope, outOfScope }) => `
<!-- change-budget:v1 -->
## Change budget

- [${checked ? 'x' : ' '}] I documented this change budget before editing implementation code.

### Scope
<!-- change-budget:scope -->
${scope}
<!-- /change-budget:scope -->

### Out of scope
<!-- change-budget:out-of-scope -->
${outOfScope}
<!-- /change-budget:out-of-scope -->
`;

describe('change budget validation', () => {
  it('accepts concrete scope boundaries documented before code', () => {
    const result = validateChangeBudget(body({
      scope: 'Add the pull request change-budget gate and its focused tests.',
      outOfScope: 'Do not change portfolio UI, content, routes, or deployment behavior.',
    }));

    expect(result.errors).toEqual([]);
  });

  it('rejects an unchecked pre-code confirmation', () => {
    const result = validateChangeBudget(body({
      checked: false,
      scope: 'Add the pull request change-budget gate and its focused tests.',
      outOfScope: 'Do not change portfolio UI, content, routes, or deployment behavior.',
    }));

    expect(result.errors).toContain(
      'Confirm that the change budget was documented before implementation code was edited.',
    );
  });

  it('rejects unchanged template placeholders', () => {
    const result = validateChangeBudget(body({
      scope: 'Describe the smallest complete change this PR is allowed to make.',
      outOfScope: 'List adjacent changes that this PR intentionally will not make.',
    }));

    expect(result.errors).toEqual([
      'Scope must replace the template placeholder with a concrete change boundary.',
      'Out of scope must replace the template placeholder with concrete exclusions.',
    ]);
  });

  it('rejects missing markers and duplicated boundaries', () => {
    expect(validateChangeBudget('No template here.').errors).toHaveLength(4);

    const duplicated = validateChangeBudget(body({
      scope: 'Only update the repository change-budget contract.',
      outOfScope: 'Only update the repository change-budget contract.',
    }));

    expect(duplicated.errors).toContain('Scope and out of scope must define different boundaries.');
  });
});
