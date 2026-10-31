import imageConfig from '../../config/responsive-images.json';

export type ResponsiveImageSource = (typeof imageConfig)[number]['src'];

type ResponsiveImageConfig = {
  src: string;
  width: number;
  height: number;
  widths: number[];
};

const configs = new Map<string, ResponsiveImageConfig>(
  imageConfig.map((entry) => [entry.src, entry]),
);

const assetKey = (sourcePath: string) => sourcePath
  .replace(/^\//, '')
  .replace(/\.[^.]+$/, '')
  .replaceAll('/', '--');

const variantPath = (sourcePath: string, width: number, format: 'avif' | 'webp') => (
  `/responsive/${assetKey(sourcePath)}-${width}w.${format}`
);

export const getResponsiveImage = (sourcePath: ResponsiveImageSource) => {
  const config = configs.get(sourcePath);
  if (!config) throw new Error(`Missing responsive image config for ${sourcePath}`);

  const widths = [...config.widths].sort((left, right) => left - right);
  const buildSrcSet = (format: 'avif' | 'webp') => widths
    .map((width) => `${variantPath(sourcePath, width, format)} ${width}w`)
    .join(', ');

  return {
    ...config,
    avifSrcSet: buildSrcSet('avif'),
    webpSrcSet: buildSrcSet('webp'),
  };
};
