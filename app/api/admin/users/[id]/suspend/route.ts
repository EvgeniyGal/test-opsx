import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER can suspend users
    if (session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await params;

    // Update user status to SUSPENDED
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDED },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: "User suspended successfully",
      user,
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
