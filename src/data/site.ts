import { blogPosts } from './blogPosts-data';
import { featuredProjects } from './siteProjects-data';

export const siteUrl = 'https://evyatarhazan.com';
export const legacySiteUrl = 'https://evyatar-hazan.github.io';

export type RoutePreview = {
  heading: string;
  body: string[];
  links?: Array<{ href: string; label: string }>;
};

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  preview: RoutePreview;
};

export const normalizePath = (path: string) => {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
};

const homePreview: RoutePreview = {
  heading: 'Evyatar Hazan | Full Stack Developer',
  body: [
    'Portfolio for Evyatar Hazan with case studies, live product work, bilingual converter growth work, and practical frontend and full-stack delivery.',
    'Includes project pages, short technical writing, contact paths, and production-facing examples of SEO, React, TypeScript, and workflow ownership.'
  ],
  links: [
    { href: '/blog/', label: 'Writing' },
    { href: '/contact/', label: 'Contact' },
    { href: '/privacy/', label: 'Privacy' }
  ]
};

const privacyPreview: RoutePreview = {
  heading: 'Privacy',
  body: [
    'This portfolio does not ask visitors to create accounts or upload personal documents. Contact happens through direct channels chosen by the visitor, such as email, LinkedIn, or WhatsApp.',
    'Analytics and operational checks are kept minimal and are meant to measure site usage and stability rather than collect sensitive visitor content.'
  ],
  links: [
    { href: '/', label: 'Home' },
    { href: '/contact/', label: 'Contact' }
  ]
};

const contactPreview: RoutePreview = {
  heading: 'Contact Evyatar Hazan',
  body: [
    'The best way to start is a direct message with the project goal, current state, and the kind of help you need.',
    'This page points to WhatsApp, email, and LinkedIn so there is a clear and human contact path instead of an anonymous lead form.'
  ],
  links: [
    { href: '/', label: 'Home' },
    { href: '/blog/', label: 'Writing' }
  ]
};

export const staticRoutes: RouteSeo[] = [
  {
    path: '/',
    title: 'Evyatar Hazan | Full Stack Developer',
    description: 'Portfolio of Evyatar Hazan, a full stack developer building business websites, structured tools, automation workflows, and maintainable product systems.',
    preview: homePreview
  },
  {
    path: '/blog/',
    title: 'Writing | Evyatar Hazan',
    description: 'Short articles about product engineering, frontend work, live websites, SEO, validation, and deployment.',
    preview: {
      heading: 'Writing by Evyatar Hazan',
      body: [
        'A growing set of short articles about product work, SEO, frontend systems, deployment, and real delivery tradeoffs.',
        'The writing is meant to show how projects are reasoned about, not only what stack was used.'
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/contact/', label: 'Contact' }
      ]
    }
  },
  {
    path: '/privacy/',
    title: 'Privacy | Evyatar Hazan',
    description: 'Privacy information for Evyatar Hazan portfolio visitors, including contact paths, analytics boundaries, and basic data handling expectations.',
    preview: privacyPreview
  },
  {
    path: '/contact/',
    title: 'Contact | Evyatar Hazan',
    description: 'Direct contact options for Evyatar Hazan, including WhatsApp, email, and LinkedIn for project inquiries and collaboration.',
    preview: contactPreview
  }
];

for (const post of blogPosts.filter((post) => post.language === 'en')) {
  staticRoutes.push({
    path: `/blog/${post.slug}/`,
    title: `${post.title} | Writing | Evyatar Hazan`,
    description: post.excerpt,
    preview: {
      heading: post.title,
      body: [
        post.excerpt,
        `Published ${post.date}. Tags: ${post.tags.join(', ')}.`
      ],
      links: [
        { href: '/blog/', label: 'All writing' },
        { href: '/contact/', label: 'Contact' }
      ]
    }
  });
}

for (const project of featuredProjects) {
  staticRoutes.push({
    path: `/projects/${project.id}/`,
    title: project.seoTitle,
    description: project.seoDescription,
    preview: {
      heading: project.title,
      body: [
        project.description,
        project.summary
      ],
      links: [
        { href: '/', label: 'Home' },
        { href: '/blog/', label: 'Writing' }
      ]
    }
  });
}

export const routeSeoByPath = new Map(
  staticRoutes.map((route) => [normalizePath(route.path), route] as const)
);

export const getRouteSeo = (path: string) => (
  routeSeoByPath.get(normalizePath(path)) ?? staticRoutes[0]
);

export const absoluteUrl = (path: string) => `${siteUrl}${normalizePath(path) === '/' ? '/' : normalizePath(path)}`;
