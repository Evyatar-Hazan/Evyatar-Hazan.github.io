import { useTranslation } from 'react-i18next';
import { CraftLab } from '../features/craft-lab';
import { DatePresentationDemo } from '../features/date-presentation/DatePresentationDemo';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';
import { getStaticRouteSeo } from '../data/routeSeo';

const LabPage = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  usePageSeo(getStaticRouteSeo('lab', language));

  return (
    <main id="main-content" tabIndex={-1}>
      <CraftLab language={language} buildPath={localizedPath} />
      <div className="content-container pb-24">
        <DatePresentationDemo language={language} buildLocalizedPath={localizedPath} />
      </div>
    </main>
  );
};

export default LabPage;
