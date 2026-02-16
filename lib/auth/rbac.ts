import { Role } from "@prisma/client";

/**
 * Role hierarchy levels
 * Higher number = more privileges
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 3,
  MANAGER: 2,
  ADMIN: 1,
};

/**
 * Check if user has required role or higher in hierarchy
 * @param userRole User's current role
 * @param requiredRole Minimum role required
 * @returns True if user has required role or higher
 */
export function hasRoleOrHigher(
  userRole: Role,
  requiredRole: Role
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user can approve user registrations
 * Only Owners and Managers can approve
 * @param role User's role
 * @returns True if user can approve registrations
 */
export function canApproveRegistrations(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Check if user can manage another user
 * - Owner can manage anyone
 * - Manager can manage Manager and Admin (not Owner)
 * - Admin cannot manage anyone
 * @param userRole Role of the user attempting to manage
 * @param targetRole Role of the user being managed
 * @returns True if user can manage target user
 */
export function canManageUsers(userRole: Role, targetRole: Role): boolean {
  if (userRole === "OWNER") return true; // Owner can manage anyone
  if (userRole === "MANAGER") return targetRole !== "OWNER"; // Manager can't manage Owner
  return false; // Admin can't manage anyone
}
