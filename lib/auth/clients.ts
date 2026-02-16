import { Role } from "@prisma/client";

/**
 * Check if user can create clients
 * Only Owners and Managers can create clients
 * @param role User's role
 * @returns True if user can create clients
 */
export function canCreateClient(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can update clients
 * Only Owners and Managers can update clients
 * @param role User's role
 * @returns True if user can update clients
 */
export function canUpdateClient(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can delete (archive) clients
 * Only Owners can delete clients
 * @param role User's role
 * @returns True if user can delete clients
 */
export function canDeleteClient(role: Role): boolean {
  return role === "OWNER";
}

/**
 * Check if user can assign clients
 * Only Owners and Managers can assign clients
 * @param role User's role
 * @returns True if user can assign clients
 */
export function canAssignClient(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can approve status changes
 * Only Owners can approve status change requests
 * @param role User's role
 * @returns True if user can approve status changes
 */
export function canApproveStatusChange(role: Role): boolean {
  return role === "OWNER";
}

/**
 * Check if user can request status changes
 * Only Managers can request status changes (Owners can change directly)
 * @param role User's role
 * @returns True if user can request status changes
 */
export function canRequestStatusChange(role: Role): boolean {
  return role === "MANAGER";
}

/**
 * Check if user can manage contacts
 * Only Owners and Managers can manage contacts
 * @param role User's role
 * @returns True if user can manage contacts
 */
export function canManageContacts(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can manage contracts
 * Only Owners and Managers can manage contracts
 * @param role User's role
 * @returns True if user can manage contracts
 */
export function canManageContracts(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}
