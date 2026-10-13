import { useEffect } from 'react';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';
import { getPersonStructuredData, personStructuredDataId } from '../data/personStructuredData';

const PersonStructuredData = ({ language }: { language: PortfolioLanguage }) => {
  useEffect(() => {
    let script = document.getElementById(personStructuredDataId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = personStructuredDataId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(getPersonStructuredData(language));

    return () => script?.remove();
  }, [language]);

  return null;
};

export default PersonStructuredData;
