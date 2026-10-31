import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import imageConfig from '../config/responsive-images.json' with { type: 'json' };

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(publicDir, 'responsive');

const assetKey = (sourcePath) => sourcePath
  .replace(/^\//, '')
  .replace(/\.[^.]+$/, '')
  .replaceAll('/', '--');

const assertValidEntry = async (entry) => {
  if (!entry.src.startsWith('/') || !entry.src.endsWith('.webp')) {
    throw new Error(`Responsive image source must be a public WebP path: ${entry.src}`);
  }

  if (!entry.widths.length || entry.widths.some((width) => width <= 0 || width > entry.width)) {
    throw new Error(`Responsive widths must be positive and must not upscale ${entry.src}`);
  }

  if (new Set(entry.widths).size !== entry.widths.length) {
    throw new Error(`Responsive widths must be unique for ${entry.src}`);
  }

  const inputPath = path.join(publicDir, entry.src.slice(1));
  const metadata = await sharp(await readFile(inputPath)).metadata();
  if (metadata.width !== entry.width || metadata.height !== entry.height) {
    throw new Error(
      `Source dimensions changed for ${entry.src}: expected ${entry.width}x${entry.height}, got ${metadata.width}x${metadata.height}`,
    );
  }

  return inputPath;
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

let generatedCount = 0;
for (const entry of imageConfig) {
  const inputPath = await assertValidEntry(entry);
  const key = assetKey(entry.src);

  for (const width of [...entry.widths].sort((left, right) => left - right)) {
    const pipeline = sharp(inputPath).resize({
      width,
      withoutEnlargement: true,
      fit: 'inside',
    });

    await Promise.all([
      pipeline.clone().avif({ quality: 58, effort: 4 }).toFile(path.join(outputDir, `${key}-${width}w.avif`)),
      pipeline.clone().webp({ quality: 78, effort: 4 }).toFile(path.join(outputDir, `${key}-${width}w.webp`)),
    ]);
    generatedCount += 2;
  }
}

console.log(`Generated ${generatedCount} responsive image variants without enlarging source assets.`);
