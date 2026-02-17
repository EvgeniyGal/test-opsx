// Export password utilities
export { hashPassword, verifyPassword } from "./auth/password";

// Export RBAC utilities
export {
  hasRoleOrHigher,
  canApproveRegistrations,
  canManageUsers,
} from "./auth/rbac";

// Export client management RBAC utilities
export {
  canCreateClient,
  canUpdateClient,
  canDeleteClient,
  canAssignClient,
  canApproveStatusChange,
  canRequestStatusChange,
  canManageContacts,
  canManageContracts,
} from "./auth/clients";

// Export candidate management RBAC utilities
export {
  canCreateCandidate,
  canUpdateCandidate,
  canUpdateCandidateCoreFields,
  canDeleteCandidate,
  canAssignCandidate,
  canUpdateCandidateStatus,
} from "./auth/candidates";
