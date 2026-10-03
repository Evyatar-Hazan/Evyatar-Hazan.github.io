import { useTranslation } from 'react-i18next';
import { CraftLab } from '../features/craft-lab';
import { DatePresentationDemo } from '../features/date-presentation/DatePresentationDemo';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';

const LabPage = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';

  usePageSeo({
    title: language === 'he' ? 'מעבדת ממשק | אביתר חזן' : 'Interface Craft Lab | Evyatar Hazan',
    description: language === 'he'
      ? 'ניסויי ממשק סינתטיים ורכיב תאריך רב־שימושי, עם הבחנה מפורשת מעבודת לקוח וממדדי מוצר.'
      : 'Synthetic interface experiments and a reusable date presenter, clearly separated from client delivery and product metrics.',
    path: '/lab/',
  });

  return (
    <main>
      <CraftLab language={language} buildPath={localizedPath} />
      <div className="mx-auto max-w-[92.5rem] px-5 pb-24 sm:px-8 lg:px-12">
        <DatePresentationDemo language={language} buildLocalizedPath={localizedPath} />
      </div>
    </main>
  );
};

export default LabPage;
