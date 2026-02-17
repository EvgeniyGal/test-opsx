import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canAssignCandidate } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    if (!canAssignCandidate(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { assignedTo } = body;

    if (!assignedTo) {
      return NextResponse.json({ error: "assignedTo is required" }, { status: 400 });
    }

    // Validate assigned user exists
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedTo },
      select: { id: true, name: true, email: true },
    });

    if (!assignedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Update assignment and create history in transaction
    const updatedCandidate = await prisma.$transaction(async (tx) => {
      // Update candidate assignment
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          assignedTo,
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

      // Create assignment history
      await tx.candidateAssignmentHistory.create({
        data: {
          candidateId: id,
          assignedTo,
          assignedBy: session.user.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Candidate assigned successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error assigning candidate:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}
