import type { ImgHTMLAttributes } from 'react';
import { getResponsiveImage, type ResponsiveImageSource } from '../data/responsiveImages';
import './ResponsiveImage.css';

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'height' | 'sizes' | 'src' | 'srcSet' | 'width'
> & {
  source: ResponsiveImageSource;
  sizes: string;
};

const ResponsiveImage = ({ source, sizes, ...imageProps }: ResponsiveImageProps) => {
  const image = getResponsiveImage(source);

  return (
    <picture className="responsive-picture">
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <img
        {...imageProps}
        src={image.src}
        srcSet={image.webpSrcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
      />
    </picture>
  );
};

export default ResponsiveImage;
