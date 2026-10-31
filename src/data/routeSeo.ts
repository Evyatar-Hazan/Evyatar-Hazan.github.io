import routeSeo from './routeSeo.json';
import type { PortfolioLanguage } from './portfolioCapabilities';

export type StaticRouteSeoId = keyof typeof routeSeo;

export const getStaticRouteSeo = (routeId: StaticRouteSeoId, language: PortfolioLanguage) => ({
  ...routeSeo[routeId][language],
  path: routeSeo[routeId].path,
});

export { routeSeo };
