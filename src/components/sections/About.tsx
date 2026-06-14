import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  const categories = [
    { key: 'webMobile', skills: ['React Native', 'React', 'Next.js', 'Node.js', 'NestJS', 'Redux', 'REST APIs'] },
    { key: 'languages', skills: ['TypeScript', 'JavaScript', 'Java', 'Python'] },
    { key: 'aiCv', skills: ['YOLOv5', 'ONNX', 'TFLite', 'Image Processing & Mapping'] },
    { key: 'devops', skills: ['AWS', 'Docker', 'Linux', 'Jenkins CI/CD', 'Git'] },
    { key: 'databases', skills: ['PostgreSQL', 'SQL', 'PgAdmin'] },
    { key: 'automation', skills: ['Appium', 'Selenium', 'Perfecto', 'XCUITest', 'Allure'] },
    { key: 'methodologies', skills: ['Technical Mentoring', 'Development Leadership', 'Product/QA Collaboration', 'Jira'] }
  ];

  return (
    <section id="about" className="py-24 px-6 min-h-screen flex items-center justify-center relative bg-neutral-100 dark:bg-neutral-950 border-t border-b border-neutral-200/50 dark:border-neutral-900/50 transition-colors duration-500">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-neutral-900 dark:text-white transition-colors duration-500">
            {t('about.title1')} <span className="text-primary-500">{t('about.title2')}</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-6 text-lg transition-colors duration-500">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </div>
            
            <div className="space-y-8 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white transition-colors duration-500">{t('about.techStack')}</h3>
              
              <div className="space-y-6">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <h4 className="text-sm font-bold tracking-wider text-primary-500 mb-3 uppercase">{t(`about.categories.${cat.key}`)}</h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 font-medium hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm dark:shadow-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
