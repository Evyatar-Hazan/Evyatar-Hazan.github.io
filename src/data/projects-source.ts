import { getProjectById, projects as sourceProjects } from './profile';

const englishProjectTitles: Record<string, string> = {
  nis_boutique: 'Nis Boutique Catering',
  online_converter: 'Online Converter',
  emergency_protocol: 'Emergency Protocol Diagram',
  united_hatzalah: 'United Hatzalah Shoham Branch'
};

export const projects = sourceProjects
  .map((project) => {
    const fullProject = getProjectById(project.id);
    const caseStudy = fullProject?.caseStudy;

    if (!caseStudy) return null;

    return {
      id: project.id,
      caseStudyTitle: englishProjectTitles[project.id] ?? project.id,
      caseStudyDescription: caseStudy.seoDescription.en,
      caseStudySummary: caseStudy.overview.en[0] ?? '',
      seoTitle: caseStudy.seoTitle.en,
      seoDescription: caseStudy.seoDescription.en
    };
  })
  .filter((value): value is NonNullable<typeof value> => value !== null);
