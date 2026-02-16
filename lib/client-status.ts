import { ClientStatus } from "@prisma/client";

export const VALID_TRANSITIONS: Record<ClientStatus, ClientStatus[]> = {
  [ClientStatus.PROSPECT]: [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
  [ClientStatus.ACTIVE]: [ClientStatus.INACTIVE, ClientStatus.ARCHIVED],
  [ClientStatus.INACTIVE]: [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
  [ClientStatus.ARCHIVED]: [],
};

export const CRITICAL_TRANSITIONS: Array<[ClientStatus, ClientStatus]> = [
  [ClientStatus.PROSPECT, ClientStatus.ACTIVE],
  [ClientStatus.ACTIVE, ClientStatus.INACTIVE],
  [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
];

export function isCriticalTransition(from: ClientStatus, to: ClientStatus): boolean {
  return CRITICAL_TRANSITIONS.some(([f, t]) => f === from && t === to);
}

export function getValidTransitions(from: ClientStatus): ClientStatus[] {
  return VALID_TRANSITIONS[from] ?? [];
}
