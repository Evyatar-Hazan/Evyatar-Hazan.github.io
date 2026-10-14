import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);
const shaPattern = /^[0-9a-f]{40}$/u;
const publicAssetPattern = /(?:^assets\/|\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$)/iu;

const sha256 = (content) => createHash('sha256').update(content).digest('hex');

const walkFiles = async (directory, relativeDirectory = '') => {
  const entries = await readdir(path.join(directory, relativeDirectory), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(directory, relativePath));
    else if (entry.isFile()) files.push(relativePath);
  }

  return files;
};

export const normalizeSourceSha = (candidate) => {
  const normalized = candidate?.trim().toLowerCase();
  if (!normalized || !shaPattern.test(normalized)) {
    throw new Error(`Deployment source SHA must be a full 40-character Git SHA; received ${candidate || 'nothing'}.`);
  }
  return normalized;
};

export const createDeploymentManifest = ({ sourceSha, assets }) => ({
  schemaVersion: 1,
  sourceSha: normalizeSourceSha(sourceSha),
  assets: [...assets]
    .map(({ assetPath, bytes, hash }) => ({
      path: assetPath.startsWith('/') ? assetPath : `/${assetPath}`,
      bytes,
      sha256: hash,
    }))
    .sort((left, right) => left.path.localeCompare(right.path)),
});

const resolveSourceSha = async (repositoryRoot) => {
  const suppliedSha = process.env.GITHUB_SHA || process.env.SOURCE_SHA;
  if (suppliedSha) return normalizeSourceSha(suppliedSha);

  const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot });
  return normalizeSourceSha(stdout);
};

const main = async () => {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(scriptDirectory, '..');
  const distDirectory = path.join(repositoryRoot, 'dist');
  const sourceSha = await resolveSourceSha(repositoryRoot);
  const assetPaths = (await walkFiles(distDirectory))
    .filter((relativePath) => relativePath !== 'deployment.json' && publicAssetPattern.test(relativePath));
  const assets = await Promise.all(assetPaths.map(async (relativePath) => {
    const absolutePath = path.join(distDirectory, relativePath);
    const [content, metadata] = await Promise.all([readFile(absolutePath), stat(absolutePath)]);
    return { assetPath: relativePath, bytes: metadata.size, hash: sha256(content) };
  }));
  const manifest = createDeploymentManifest({ sourceSha, assets });

  await writeFile(
    path.join(distDirectory, 'deployment.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(`Created deployment manifest for ${sourceSha} with ${manifest.assets.length} public assets.`);
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) await main();
