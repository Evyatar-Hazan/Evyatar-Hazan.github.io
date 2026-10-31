import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const publicRoot = path.join(root, 'public');
const runtimeEntries = [
  path.join(sourceRoot, 'main.tsx'),
  // This module is an executable QA contract consumed by Vitest, not site code.
  path.join(sourceRoot, 'routing/routeQaMatrix.ts'),
  // Experience V2 imports shared production data without being part of the legacy app graph.
  path.join(root, 'experiments/portfolio-experience-v2/src/App.jsx'),
];
const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.mdx'];
const implicitPublicFiles = new Set(['_redirects', '_worker.js', 'ads.txt', 'robots.txt']);

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolutePath = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
});

const normalize = (filePath) => path.relative(root, filePath).split(path.sep).join('/');

const resolveImport = (importer, specifier) => {
  if (!specifier.startsWith('.')) return null;

  const withoutQuery = specifier.split('?')[0];
  const basePath = path.resolve(path.dirname(importer), withoutQuery);
  const candidates = [
    basePath,
    ...sourceExtensions.map((extension) => `${basePath}${extension}`),
    ...sourceExtensions.map((extension) => path.join(basePath, `index${extension}`)),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
};

const collectSpecifiers = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const kind = filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
    ? ts.ScriptKind.TSX
    : filePath.endsWith('.ts')
      ? ts.ScriptKind.TS
      : ts.ScriptKind.JS;
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
  const specifiers = [];

  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      && node.moduleSpecifier
      && ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }

    if (
      ts.isCallExpression(node)
      && node.expression.kind === ts.SyntaxKind.ImportKeyword
      && node.arguments.length === 1
      && ts.isStringLiteralLike(node.arguments[0])
    ) {
      specifiers.push(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return specifiers;
};

const reachableFiles = new Set();
const pendingFiles = [...runtimeEntries];

while (pendingFiles.length > 0) {
  const filePath = pendingFiles.pop();
  if (!filePath || reachableFiles.has(filePath)) continue;
  reachableFiles.add(filePath);

  if (!/\.(?:[cm]?[jt]sx?|mdx)$/u.test(filePath)) continue;
  for (const specifier of collectSpecifiers(filePath)) {
    const resolved = resolveImport(filePath, specifier);
    if (resolved && !reachableFiles.has(resolved)) pendingFiles.push(resolved);
  }
}

const productionCodeFiles = walk(sourceRoot).filter((filePath) => (
  /\.(?:ts|tsx|css)$/u.test(filePath)
  && !filePath.includes('.test.')
  && !filePath.endsWith('.d.ts')
  && !filePath.includes(`${path.sep}test${path.sep}`)
));
const orphanCode = productionCodeFiles
  .filter((filePath) => !reachableFiles.has(filePath))
  .map(normalize)
  .sort();

const referenceFiles = [
  ...reachableFiles,
  path.join(root, 'index.html'),
  path.join(root, 'vite.config.ts'),
  path.join(root, 'wrangler.jsonc'),
  ...walk(path.join(root, 'scripts')),
].filter((filePath) => fs.existsSync(filePath));
const referenceText = referenceFiles.map((filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}).join('\n');

const publicFiles = walk(publicRoot);
const orphanAssets = publicFiles.filter((filePath) => {
  const relativePath = path.relative(publicRoot, filePath).split(path.sep).join('/');
  if (implicitPublicFiles.has(relativePath)) return false;
  return !referenceText.includes(relativePath) && !referenceText.includes(path.basename(relativePath));
}).map(normalize).sort();

if (orphanCode.length > 0 || orphanAssets.length > 0) {
  if (orphanCode.length > 0) {
    console.error(`Unused production files (${orphanCode.length}):`);
    orphanCode.forEach((filePath) => console.error(`- ${filePath}`));
  }
  if (orphanAssets.length > 0) {
    console.error(`Orphan public assets (${orphanAssets.length}):`);
    orphanAssets.forEach((filePath) => console.error(`- ${filePath}`));
  }
  process.exit(1);
}

const publicBytes = publicFiles.reduce((total, filePath) => total + fs.statSync(filePath).size, 0);
console.log(
  `Unused-code audit passed: ${productionCodeFiles.length} production files are reachable; `
  + `${publicFiles.length} public files (${publicBytes} bytes) are referenced or platform-owned.`,
);
