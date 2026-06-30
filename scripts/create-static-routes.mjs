import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, 'dist');
const srcDir = path.join(repoRoot, 'src');

const rootHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');

const profileSource = await readFile(path.join(srcDir, 'data', 'profile.ts'), 'utf8');
const projectIds = [...profileSource.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);

const blogDir = path.join(srcDir, 'content', 'blog');
const blogFiles = await readdir(blogDir);
const blogSlugs = [...new Set(
  blogFiles
    .filter((file) => /\.(en|he)\.mdx$/.test(file))
    .map((file) => file.replace(/\.(en|he)\.mdx$/, ''))
)];

const publicRoutes = [
  'blog',
  ...projectIds.map((projectId) => `projects/${projectId}`),
  ...blogSlugs.map((slug) => `blog/${slug}`)
];

for (const route of publicRoutes) {
  const targetDir = path.join(distDir, route);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), rootHtml);
}

console.log(`Created static route entries for ${publicRoutes.length} SPA paths.`);
