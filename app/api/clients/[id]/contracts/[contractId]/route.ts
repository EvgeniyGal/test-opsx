import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canManageContracts } from "@/lib/auth";
import { ContractType } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; contractId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check RBAC
    if (!canManageContracts(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, contractId } = await params;
    const body = await request.json();
    const { type, startDate, endDate, terms, paymentTerms, documentPath, status } = body;

    // Verify contract belongs to client
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { clientId: true },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (contract.clientId !== id) {
      return NextResponse.json(
        { error: "Contract does not belong to this client" },
        { status: 400 }
      );
    }

    // Update contract
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...(type !== undefined && { type: type as ContractType }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(terms !== undefined && { terms }),
        ...(paymentTerms !== undefined && { paymentTerms }),
        ...(documentPath !== undefined && { documentPath }),
        ...(status !== undefined && { status }),
        updatedBy: session.user.id,
      },
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ contract: updatedContract });
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
