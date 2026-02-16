import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all comments and status comments in chronological order
    const [comments, statusHistory] = await Promise.all([
      prisma.comment.findMany({
        where: { clientId: id },
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
          createdAt: "asc",
        },
      }),
      prisma.statusHistory.findMany({
        where: { clientId: id },
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
          changedAt: "asc",
        },
      }),
    ]);

    // Combine and sort chronologically
    const timeline = [
      ...comments.map((c) => ({
        type: "comment" as const,
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        createdBy: c.createdByUser,
      })),
      ...statusHistory.flatMap((sh) => [
        {
          type: "status_change" as const,
          id: sh.id,
          fromStatus: sh.fromStatus,
          toStatus: sh.toStatus,
          comment: sh.comment,
          createdAt: sh.changedAt,
          createdBy: sh.changedByUser,
        },
        ...sh.statusComments.map((sc) => ({
          type: "status_comment" as const,
          id: sc.id,
          content: sc.content,
          createdAt: sc.createdAt,
          createdBy: sc.createdByUser,
          statusHistoryId: sh.id,
        })),
      ]),
    ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    // Validate content
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        clientId: id,
        content: content.trim(),
        createdBy: session.user.id,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
