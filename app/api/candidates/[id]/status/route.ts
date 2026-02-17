import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { CandidateStatus } from "@prisma/client";
import { canUpdateCandidateStatus } from "@/lib/auth";

// Define valid status transitions (forward-only workflow)
const VALID_TRANSITIONS: Record<CandidateStatus, CandidateStatus[]> = {
  [CandidateStatus.APPLIED]: [CandidateStatus.SCREENING, CandidateStatus.REJECTED],
  [CandidateStatus.SCREENING]: [CandidateStatus.INTERVIEW, CandidateStatus.REJECTED],
  [CandidateStatus.INTERVIEW]: [CandidateStatus.OFFER, CandidateStatus.REJECTED],
  [CandidateStatus.OFFER]: [CandidateStatus.HIRED, CandidateStatus.REJECTED],
  [CandidateStatus.HIRED]: [], // Terminal state
  [CandidateStatus.REJECTED]: [], // Terminal state
};

function isValidTransition(from: CandidateStatus, to: CandidateStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    if (!canUpdateCandidateStatus(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, comment } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    // Validate status enum
    if (!Object.values(CandidateStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get current candidate with current status
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Check if status is changing
    if (candidate.status === status) {
      return NextResponse.json({ error: "Status is already set to this value" }, { status: 400 });
    }

    // Validate transition
    if (!isValidTransition(candidate.status, status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${candidate.status} to ${status}`,
          validTransitions: VALID_TRANSITIONS[candidate.status],
        },
        { status: 400 }
      );
    }

    // Update status and create history in transaction
    const updatedCandidate = await prisma.$transaction(async (tx) => {
      // Update candidate status
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          status,
          updatedBy: session.user.id,
        },
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create status history
      await tx.candidateStatusHistory.create({
        data: {
          candidateId: id,
          fromStatus: candidate.status,
          toStatus: status,
          comment: comment || null,
          changedBy: session.user.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Candidate status updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}
