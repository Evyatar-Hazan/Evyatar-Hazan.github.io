import { useTranslation } from 'react-i18next';
import './ProjectCardFacts.css';

export type ProjectCardFactsProps = {
  role: string;
  problem: string;
  result: string;
  status: string;
  className?: string;
};

const ProjectCardFacts = ({
  role,
  problem,
  result,
  status,
  className = '',
}: ProjectCardFactsProps) => {
  const { t } = useTranslation();
  const facts = [
    { id: 'role', label: t('projects.role'), value: role },
    { id: 'problem', label: t('projects.problem'), value: problem },
    { id: 'result', label: t('projects.impact'), value: result },
    { id: 'status', label: t('projects.statusLabel'), value: status },
  ];

  return (
    <dl className={`project-card-facts ${className}`.trim()} data-project-card-facts>
      {facts.map((fact) => (
        <div key={fact.id} data-project-fact={fact.id}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default ProjectCardFacts;
