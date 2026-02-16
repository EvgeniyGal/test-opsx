import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canManageContacts } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    if (!canManageContacts(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, contactId } = await params;
    const body = await request.json();
    const { name, email, phone, role, isPrimary, notes } = body;

    // Verify contact belongs to client
    const contact = await prisma.contactPerson.findUnique({
      where: { id: contactId },
      select: { clientId: true },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.clientId !== id) {
      return NextResponse.json(
        { error: "Contact does not belong to this client" },
        { status: 400 }
      );
    }

    // Update contact and handle isPrimary flag
    const updatedContact = await prisma.$transaction(async (tx) => {
      // If setting as primary, unset others
      if (isPrimary) {
        await tx.contactPerson.updateMany({
          where: { clientId: id, isPrimary: true, id: { not: contactId } },
          data: { isPrimary: false },
        });
      }

      // Update contact
      return await tx.contactPerson.update({
        where: { id: contactId },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(role !== undefined && { role }),
          ...(isPrimary !== undefined && { isPrimary }),
          ...(notes !== undefined && { notes }),
        },
      });
    });

    return NextResponse.json({ contact: updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    if (!canManageContacts(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, contactId } = await params;

    // Verify contact belongs to client
    const contact = await prisma.contactPerson.findUnique({
      where: { id: contactId },
      select: { clientId: true },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.clientId !== id) {
      return NextResponse.json(
        { error: "Contact does not belong to this client" },
        { status: 400 }
      );
    }

    // Check if client has at least one remaining contact
    const contactCount = await prisma.contactPerson.count({
      where: { clientId: id },
    });

    if (contactCount <= 1) {
      return NextResponse.json(
        { error: "Client must have at least one contact" },
        { status: 400 }
      );
    }

    // Delete contact
    await prisma.contactPerson.delete({
      where: { id: contactId },
    });

    return NextResponse.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
