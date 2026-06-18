import { useEffect } from 'react';

type PageSeo = {
  title: string;
  description: string;
};

const upsertMeta = (name: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
};

export const usePageSeo = ({ title, description }: PageSeo) => {
  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
  }, [description, title]);
};
