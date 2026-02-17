"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CandidateStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  canUpdateCandidate,
  canUpdateCandidateCoreFields,
  canAssignCandidate,
  canDeleteCandidate,
} from "@/lib/auth";
import { Edit, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, User, Calendar, FileText, Download } from "lucide-react";
import { CandidateForm } from "./CandidateForm";
import { CVUpload } from "./CVUpload";
import { NoteForm } from "./NoteForm";
import { CommentForm } from "./CommentForm";

interface CandidateDetailData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  currentPosition: string | null;
  yearsOfExperience: number | null;
  skills: any;
  notes: string | null;
  status: CandidateStatus;
  assignedTo: string | null;
  assignedUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  cvStoragePath: string | null;
  cvFileName: string | null;
  cvFileSize: number | null;
  cvMimeType: string | null;
  statusHistory: Array<{
    id: string;
    fromStatus: CandidateStatus;
    toStatus: CandidateStatus;
    comment: string | null;
    changedAt: string;
    changedByUser: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  candidateNotes: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdByUser: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  candidateComments: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdByUser: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CandidateDetailProps {
  candidate: CandidateDetailData;
}

const statusBadgeClass: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SCREENING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  INTERVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  OFFER: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  HIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function CandidateDetail({ candidate: initialCandidate }: CandidateDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [candidate, setCandidate] = useState(initialCandidate);
  const [isEditing, setIsEditing] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);

  const handleRefresh = async () => {
    // Fetch updated candidate data
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`);
      if (response.ok) {
        const data = await response.json();
        setCandidate(data.candidate);
      }
    } catch (error) {
      console.error("Error refreshing candidate data:", error);
      // Fallback to router refresh
      router.refresh();
    }
  };

  const canEdit = session?.user?.role
    ? canUpdateCandidate(session.user.role)
    : false;
  const canEditCore = session?.user?.role
    ? canUpdateCandidateCoreFields(session.user.role)
    : false;
  const canAssign = session?.user?.role
    ? canAssignCandidate(session.user.role)
    : false;
  const canDelete = session?.user?.role
    ? canDeleteCandidate(session.user.role)
    : false;

  const handleDownloadCV = async () => {
    if (!candidate.cvStoragePath) return;

    try {
      setDownloadingCV(true);
      const response = await fetch(`/api/candidates/${candidate.id}/cv`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate download URL");
      }

      // Open download URL in new tab
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please try again.");
    } finally {
      setDownloadingCV(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete candidate");
      }

      router.push("/candidates");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Failed to delete candidate. Please try again.");
    }
  };

  if (isEditing) {
    return (
      <CandidateForm
        candidate={candidate}
        onCancel={() => setIsEditing(false)}
        onSuccess={(updatedCandidate) => {
          setCandidate(updatedCandidate);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{candidate.name}</h1>
          <p className="text-muted-foreground mt-2">{candidate.email}</p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email:</span>
              <span>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <span>{candidate.location}</span>
              </div>
            )}
            {candidate.currentPosition && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Position:</span>
                <span>{candidate.currentPosition}</span>
              </div>
            )}
            {candidate.yearsOfExperience !== null && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Experience:</span>
                <span>{candidate.yearsOfExperience} years</span>
              </div>
            )}
            {candidate.linkedInUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a
                  href={candidate.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {candidate.portfolioUrl && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>
          {candidate.skills && (
            <div>
              <span className="text-sm text-muted-foreground">Skills: </span>
              <span>{Array.isArray(candidate.skills) ? candidate.skills.join(", ") : JSON.stringify(candidate.skills)}</span>
            </div>
          )}
          {candidate.notes && (
            <div>
              <span className="text-sm text-muted-foreground">Notes: </span>
              <p className="mt-1">{candidate.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status and Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={`${statusBadgeClass[candidate.status] ?? statusBadgeClass.APPLIED}`}
            >
              {candidate.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle>Assigned To</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.assignedUser?.name ?? "Unassigned"}</span>
            </div>
            {candidate.assignedUser && (
              <p className="text-sm text-muted-foreground mt-1">
                {candidate.assignedUser.email}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV Section */}
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Resume / CV</CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.cvStoragePath ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.cvFileName}</span>
                {candidate.cvFileSize && (
                  <span className="text-sm text-muted-foreground">
                    ({(candidate.cvFileSize / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
              <Button onClick={handleDownloadCV} disabled={downloadingCV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {downloadingCV ? "Downloading..." : "Download"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">No CV uploaded</p>
          )}
          <div className="mt-4">
            <CVUpload candidateId={candidate.id} onUploadSuccess={() => {
              // Refresh candidate data
              router.refresh();
            }} />
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      {candidate.statusHistory.length > 0 && (
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidate.statusHistory.map((history) => (
                <div key={history.id} className="border-l-2 border-primary pl-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {history.fromStatus} → {history.toStatus}
                      </span>
                      {history.comment && (
                        <p className="text-sm text-muted-foreground mt-1">{history.comment}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{history.changedByUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(history.changedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes and Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Internal notes about this candidate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NoteForm candidateId={candidate.id} onSuccess={handleRefresh} />
            <div className="space-y-4 pt-4 border-t">
              {candidate.candidateNotes.length > 0 ? (
                candidate.candidateNotes.map((note) => (
                  <div key={note.id} className="border-l-2 border-primary pl-4">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {note.createdByUser.name} · {new Date(note.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No notes yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Comments and discussions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommentForm candidateId={candidate.id} onSuccess={handleRefresh} />
            <div className="space-y-4 pt-4 border-t">
              {candidate.candidateComments.length > 0 ? (
                candidate.candidateComments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-primary pl-4">
                    <p>{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.createdByUser.name} · {new Date(comment.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No comments yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
