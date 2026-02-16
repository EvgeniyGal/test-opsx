import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canApproveStatusChange } from "@/lib/auth";
import { StatusChangeRequestStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC (Owner only)
    if (!canApproveStatusChange(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all pending status change requests
    const requests = await prisma.statusChangeRequest.findMany({
      where: {
        status: StatusChangeRequestStatus.PENDING,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        requestedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        requestedAt: "asc", // Oldest first
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching approval requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
