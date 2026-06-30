import { projects } from './projects-source';

export const featuredProjects = projects.map((project) => ({
  id: project.id,
  title: project.caseStudyTitle,
  description: project.caseStudyDescription,
  summary: project.caseStudySummary,
  seoTitle: project.seoTitle,
  seoDescription: project.seoDescription
}));
