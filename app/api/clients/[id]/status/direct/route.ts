import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ClientStatus } from "@prisma/client";

// Critical transitions that require comments
const CRITICAL_TRANSITIONS: Array<[ClientStatus, ClientStatus]> = [
  [ClientStatus.PROSPECT, ClientStatus.ACTIVE],
  [ClientStatus.ACTIVE, ClientStatus.INACTIVE],
  [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
];

function isCriticalTransition(from: ClientStatus, to: ClientStatus): boolean {
  return CRITICAL_TRANSITIONS.some(
    ([f, t]) => f === from && t === to
  );
}

function isValidTransition(from: ClientStatus, to: ClientStatus): boolean {
  // Define valid transitions
  const validTransitions: Record<ClientStatus, ClientStatus[]> = {
    [ClientStatus.PROSPECT]: [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
    [ClientStatus.ACTIVE]: [ClientStatus.INACTIVE, ClientStatus.ARCHIVED],
    [ClientStatus.INACTIVE]: [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
    [ClientStatus.ARCHIVED]: [], // Cannot transition from archived
  };

  return validTransitions[from]?.includes(to) ?? false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC (Owner only)
    if (session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { toStatus, comment } = body;

    // Get current client
    const client = await prisma.client.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const fromStatus = client.status;

    // Validate status transition
    if (!isValidTransition(fromStatus, toStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${fromStatus} to ${toStatus}` },
        { status: 400 }
      );
    }

    // Require comment for critical transitions
    if (isCriticalTransition(fromStatus, toStatus) && !comment) {
      return NextResponse.json(
        { error: "Comment is required for this status transition" },
        { status: 400 }
      );
    }

    // Update client status and create history in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update client status
      const updatedClient = await tx.client.update({
        where: { id },
        data: {
          status: toStatus,
          updatedBy: session.user.id,
        },
      });

      // Create status history record
      await tx.statusHistory.create({
        data: {
          clientId: id,
          fromStatus,
          toStatus,
          comment: comment || null,
          changedBy: session.user.id,
        },
      });

      return updatedClient;
    });

    return NextResponse.json({
      message: "Status changed successfully",
      client: result,
    });
  } catch (error) {
    console.error("Error changing status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
