import { createElement } from 'react';
import type {
  LocalizedPathBuilder,
  PortfolioSlotRegistration,
} from '../../contracts/portfolio';
import CapabilityProof from './CapabilityProof';

export const createCapabilityProofRegistration = (
  buildPath: LocalizedPathBuilder,
): PortfolioSlotRegistration => ({
  taskId: 't04',
  slot: 'projects.capabilityProof',
  Component: (props) => createElement(CapabilityProof, { ...props, buildPath }),
});
