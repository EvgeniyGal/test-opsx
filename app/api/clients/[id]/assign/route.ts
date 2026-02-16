import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canAssignClient } from "@/lib/auth";
import { Role } from "@prisma/client";

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
    if (!canAssignClient(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { assignedTo } = body;

    if (!assignedTo) {
      return NextResponse.json(
        { error: "assignedTo is required" },
        { status: 400 }
      );
    }

    // Validate assigned user exists and is Owner or Manager
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedTo },
      select: { id: true, role: true },
    });

    if (!assignedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (assignedUser.role !== Role.OWNER && assignedUser.role !== Role.MANAGER) {
      return NextResponse.json(
        { error: "Can only assign to Owner or Manager" },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update assignment and create history in transaction
    const updatedClient = await prisma.$transaction(async (tx) => {
      // Update client assignment
      const updated = await tx.client.update({
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
      await tx.clientAssignmentHistory.create({
        data: {
          clientId: id,
          assignedTo,
          assignedBy: session.user.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Client assigned successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error assigning client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
