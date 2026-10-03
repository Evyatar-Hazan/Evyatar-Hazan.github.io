import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import ContactBriefFeature from '../features/contact/ContactBriefFeature';
import { localizedPath } from '../routing/portfolioRoutes';

const ContactPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';

  usePageSeo({
    title: isHebrew ? 'יצירת קשר | אביתר חזן' : 'Contact | Evyatar Hazan',
    description: isHebrew
      ? 'דרכי יצירת קשר ישירות עם אביתר חזן דרך WhatsApp, אימייל ו-LinkedIn עבור פרויקטים, ייעוץ ושיתופי פעולה.'
      : 'Direct contact options for Evyatar Hazan through WhatsApp, email, and LinkedIn for projects, consulting, and collaboration.',
    path: '/contact/'
  });

  return (
    <main className="min-h-screen pt-20">
      <ContactBriefFeature
        language={language}
        buildLocalizedPath={localizedPath}
        titleAs="h1"
      />
    </main>
  );
};

export default ContactPage;
