import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ClientStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as ClientStatus | null;
    const assignedTo = searchParams.get("assignedTo");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { contacts: { some: { email: { contains: search, mode: "insensitive" } } } },
      ];
    }

    // Query clients with relations
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          contacts: {
            where: { isPrimary: true },
            take: 1,
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    const { canCreateClient } = await import("@/lib/auth");
    if (!canCreateClient(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, industry, website, taxId, registrationNumber, logo, contacts } = body;

    // Validate required fields
    if (!name || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one contact are required" },
        { status: 400 }
      );
    }

    // Validate contacts
    for (const contact of contacts) {
      if (!contact.name) {
        return NextResponse.json(
          { error: "All contacts must have a name" },
          { status: 400 }
        );
      }
    }

    // Create client with contacts in a transaction
    const client = await prisma.$transaction(async (tx) => {
      // Create client
      const newClient = await tx.client.create({
        data: {
          name,
          industry,
          website,
          taxId,
          registrationNumber,
          logo,
          status: ClientStatus.PROSPECT,
          assignedTo: session.user.id,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });

      // Create contacts
      const contactData = contacts.map((contact: any, index: number) => ({
        clientId: newClient.id,
        name: contact.name,
        email: contact.email || null,
        phone: contact.phone || null,
        role: contact.role || null,
        isPrimary: index === 0 || contact.isPrimary || false,
        notes: contact.notes || null,
      }));

      // Ensure at least one is primary
      if (!contactData.some((c) => c.isPrimary)) {
        contactData[0].isPrimary = true;
      }

      await tx.contactPerson.createMany({
        data: contactData,
      });

      // Create initial status history
      await tx.statusHistory.create({
        data: {
          clientId: newClient.id,
          fromStatus: ClientStatus.PROSPECT,
          toStatus: ClientStatus.PROSPECT,
          comment: "Client created",
          changedBy: session.user.id,
        },
      });

      // Create assignment history
      await tx.clientAssignmentHistory.create({
        data: {
          clientId: newClient.id,
          assignedTo: session.user.id,
          assignedBy: session.user.id,
        },
      });

      // Return client with relations
      return await tx.client.findUnique({
        where: { id: newClient.id },
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
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
