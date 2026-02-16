import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canApproveStatusChange } from "@/lib/auth";
import { StatusChangeRequestStatus } from "@prisma/client";

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
    if (!canApproveStatusChange(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { requestId, reviewComment } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    // Get and validate request
    const statusChangeRequest = await prisma.statusChangeRequest.findUnique({
      where: { id: requestId },
    });

    if (!statusChangeRequest) {
      return NextResponse.json(
        { error: "Status change request not found" },
        { status: 404 }
      );
    }

    if (statusChangeRequest.clientId !== id) {
      return NextResponse.json(
        { error: "Request does not belong to this client" },
        { status: 400 }
      );
    }

    if (statusChangeRequest.status !== StatusChangeRequestStatus.PENDING) {
      return NextResponse.json(
        { error: "Request is not pending" },
        { status: 400 }
      );
    }

    // Update request to REJECTED
    const updatedRequest = await prisma.statusChangeRequest.update({
      where: { id: requestId },
      data: {
        status: StatusChangeRequestStatus.REJECTED,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewComment: reviewComment || null,
      },
    });

    return NextResponse.json({
      message: "Status change rejected",
      statusChangeRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting status change:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
