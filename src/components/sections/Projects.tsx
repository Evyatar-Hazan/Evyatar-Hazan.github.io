import Card from '../Card';
import { Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      id: "online_converter",
      tags: ["React", "TypeScript", "Vite", "js-yaml"],
      githubUrl: "https://github.com/Evyatar-Hazan/online-converter"
    },
    {
      id: "emergency_protocol",
      tags: ["React", "Express", "Prisma", "Google OAuth", "CI"],
      githubUrl: "https://github.com/Evyatar-Hazan/emergency-protocol-diagram"
    },
    {
      id: "lev_chedva",
      tags: ["Monorepo", "React", "Node.js", "TypeScript", "CI"],
      githubUrl: "https://github.com/Evyatar-Hazan/lev-hedva"
    },
    {
      id: "password_gen",
      tags: ["React Native", "TypeScript", "Core package", "Privacy-first"],
      githubUrl: "https://github.com/Evyatar-Hazan/password-generator"
    },
    {
      id: "test_yourself",
      tags: ["React", "Express", "TypeScript", "Monorepo", "CI"],
      githubUrl: "https://github.com/Evyatar-Hazan/test-yourself"
    },
    {
      id: "united_hatzalah",
      tags: ["React", "Express", "Prisma", "Cloudinary", "Render"],
      githubUrl: "https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch"
    }
  ];

  return (
    <section id="projects" className="py-24 px-6 min-h-screen relative flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-neutral-900 dark:text-white transition-colors duration-500">
          {t('projects.title1')} <span className="text-primary-500">{t('projects.title2')}</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col h-full group">
              <div className="mb-6 flex-grow">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {t(`projects.items.${project.id}.title`)}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors duration-500">
                  {t(`projects.items.${project.id}.description`)}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-600 dark:text-neutral-300 transition-colors duration-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50"
                >
                  <Github className="w-4 h-4" /> {t('projects.code')}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
