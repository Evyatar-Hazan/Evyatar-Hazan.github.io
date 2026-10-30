import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const workflowUrl = new URL('../.github/workflows/ci.yml', import.meta.url);
const workflow = readFileSync(workflowUrl, 'utf8');

const expectedGroup = "group: ${{ github.event_name == 'pull_request' && format('pr-{0}', github.event.pull_request.number) || 'pages' }}";

if (!workflow.includes(expectedGroup)) {
  throw new Error('CI concurrency must isolate each pull request while keeping main deployments in the pages group.');
}

if (!/concurrency:\s*\n(?:\s*#.*\n)*\s*group:.*\n\s*cancel-in-progress:\s*false/u.test(workflow)) {
  throw new Error('CI concurrency must preserve active validation and deployment runs.');
}

console.log(`CI concurrency contract verified in ${fileURLToPath(workflowUrl)}.`);
