import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageSeo } from '../hooks/usePageSeo';
import { getStaticRouteSeo } from '../data/routeSeo';
import ContactBriefFeature from '../features/contact/ContactBriefFeature';
import { localizedPath } from '../routing/portfolioRoutes';
import {
  buildContactUrl,
  parseContactContext,
  sanitizeContactSearch,
  type ContactContext,
} from '../features/contact/contactIntent';

const ContactPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';
  const location = useLocation();
  const navigate = useNavigate();
  const context = useMemo(() => parseContactContext(location.search), [location.search]);
  const sanitizedSearch = useMemo(() => sanitizeContactSearch(location.search), [location.search]);

  useEffect(() => {
    if (location.search === sanitizedSearch) return;
    navigate({ pathname: location.pathname, search: sanitizedSearch }, { replace: true });
  }, [location.pathname, location.search, navigate, sanitizedSearch]);

  const updateContext = (nextContext: ContactContext) => {
    navigate(buildContactUrl(language, nextContext));
  };

  usePageSeo(getStaticRouteSeo('contact', language));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen pt-20">
      <ContactBriefFeature
        language={language}
        buildLocalizedPath={localizedPath}
        context={context}
        onContextChange={updateContext}
        titleAs="h1"
      />
    </main>
  );
};

export default ContactPage;
