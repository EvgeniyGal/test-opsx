import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canUpdateClient, canDeleteClient } from "@/lib/auth";
import { ClientStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: {
          orderBy: [
            { isPrimary: "desc" },
            { createdAt: "asc" },
          ],
        },
        contracts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        statusHistory: {
          include: {
            changedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            statusComments: {
              include: {
                createdByUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            changedAt: "desc",
          },
        },
        comments: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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
    if (!canUpdateClient(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, industry, website, taxId, registrationNumber, logo } = body;

    // Validate data
    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Update client
    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(industry !== undefined && { industry }),
        ...(website !== undefined && { website }),
        ...(taxId !== undefined && { taxId }),
        ...(registrationNumber !== undefined && { registrationNumber }),
        ...(logo !== undefined && { logo }),
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
        contacts: true,
      },
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error updating client:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC (Owner only)
    if (!canDeleteClient(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Get current client status
    const client = await prisma.client.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update status to ARCHIVED (soft delete) and create status history
    const updatedClient = await prisma.$transaction(async (tx) => {
      const updated = await tx.client.update({
        where: { id },
        data: {
          status: ClientStatus.ARCHIVED,
          updatedBy: session.user.id,
        },
      });

      // Create status history record
      await tx.statusHistory.create({
        data: {
          clientId: id,
          fromStatus: client.status,
          toStatus: ClientStatus.ARCHIVED,
          comment: "Client archived",
          changedBy: session.user.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message: "Client archived successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error archiving client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
