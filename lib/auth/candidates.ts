import { Role } from "@prisma/client";

/**
 * Check if user can create candidates
 * Only Owners and Managers can create candidates
 * @param role User's role
 * @returns True if user can create candidates
 */
export function canCreateCandidate(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can update candidates
 * Owners and Managers can update all fields, Admins can only update notes and status
 * @param role User's role
 * @returns True if user can update candidates
 */
export function canUpdateCandidate(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER" || role === "ADMIN";
}

/**
 * Check if user can update candidate core fields (name, email, contact info)
 * Only Owners and Managers can update core fields
 * @param role User's role
 * @returns True if user can update core candidate fields
 */
export function canUpdateCandidateCoreFields(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can delete candidates
 * Only Owners and Managers can delete candidates
 * @param role User's role
 * @returns True if user can delete candidates
 */
export function canDeleteCandidate(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can assign candidates
 * Only Owners and Managers can assign candidates
 * @param role User's role
 * @returns True if user can assign candidates
 */
export function canAssignCandidate(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can update candidate status
 * All authenticated users can update candidate status
 * @param role User's role
 * @returns True if user can update candidate status
 */
export function canUpdateCandidateStatus(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER" || role === "ADMIN";
}
