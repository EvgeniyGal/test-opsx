import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { CandidateStatus } from "@prisma/client";
import { canCreateCandidate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as CandidateStatus | null;
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
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { currentPosition: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query candidates with relations
    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
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
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return NextResponse.json({
      candidates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
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
    if (!canCreateCandidate(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      location,
      linkedInUrl,
      portfolioUrl,
      currentPosition,
      yearsOfExperience,
      skills,
      notes,
      assignedTo,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Create candidate
    const candidate = await prisma.$transaction(async (tx) => {
      const newCandidate = await tx.candidate.create({
        data: {
          name,
          email,
          phone: phone || null,
          location: location || null,
          linkedInUrl: linkedInUrl || null,
          portfolioUrl: portfolioUrl || null,
          currentPosition: currentPosition || null,
          yearsOfExperience: yearsOfExperience || null,
          skills: skills || null,
          notes: notes || null,
          status: CandidateStatus.APPLIED,
          assignedTo: assignedTo || session.user.id,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });

      // Create initial status history
      await tx.candidateStatusHistory.create({
        data: {
          candidateId: newCandidate.id,
          fromStatus: CandidateStatus.APPLIED,
          toStatus: CandidateStatus.APPLIED,
          comment: "Candidate created",
          changedBy: session.user.id,
        },
      });

      // Create assignment history if assigned
      if (assignedTo || session.user.id) {
        await tx.candidateAssignmentHistory.create({
          data: {
            candidateId: newCandidate.id,
            assignedTo: assignedTo || session.user.id,
            assignedBy: session.user.id,
          },
        });
      }

      // Return candidate with relations
      return await tx.candidate.findUnique({
        where: { id: newCandidate.id },
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
    });

    return NextResponse.json({ candidate }, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}
