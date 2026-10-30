declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { BlogMdxComponents } from './content/blog/types';

  const MDXComponent: ComponentType<{ components?: BlogMdxComponents }>;
  export default MDXComponent;
}
