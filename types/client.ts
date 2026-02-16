import { ClientStatus, ContractType, StatusChangeRequestStatus } from "@prisma/client";

// Re-export enums for convenience
export type { ClientStatus, ContractType, StatusChangeRequestStatus };

// Client type (matches Prisma model)
export interface Client {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  taxId: string | null;
  registrationNumber: string | null;
  logo: string | null;
  status: ClientStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ContactPerson type
export interface ContactPerson {
  id: string;
  clientId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isPrimary: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Contract type
export interface Contract {
  id: string;
  clientId: string;
  type: ContractType;
  startDate: Date | null;
  endDate: Date | null;
  terms: string | null;
  paymentTerms: string | null;
  documentPath: string | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// StatusChangeRequest type
export interface StatusChangeRequest {
  id: string;
  clientId: string;
  fromStatus: ClientStatus;
  toStatus: ClientStatus;
  comment: string | null;
  status: StatusChangeRequestStatus;
  requestedBy: string;
  requestedAt: Date;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewComment: string | null;
}

// StatusHistory type
export interface StatusHistory {
  id: string;
  clientId: string;
  fromStatus: ClientStatus;
  toStatus: ClientStatus;
  comment: string | null;
  changedAt: Date;
  changedBy: string;
}

// StatusComment type
export interface StatusComment {
  id: string;
  statusHistoryId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

// Comment type
export interface Comment {
  id: string;
  clientId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

// ClientAssignmentHistory type
export interface ClientAssignmentHistory {
  id: string;
  clientId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
}
