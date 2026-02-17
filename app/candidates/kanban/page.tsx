import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { CandidateStatus } from "@prisma/client";
import { CandidateKanban } from "@/components/candidates/CandidateKanban";

export default async function CandidateKanbanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch all candidates grouped by status
  const candidates = await prisma.candidate.findMany({
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
  });

  // Group candidates by status
  const candidatesByStatus = Object.values(CandidateStatus).reduce(
    (acc, status) => {
      acc[status] = candidates.filter((c) => c.status === status);
      return acc;
    },
    {} as Record<CandidateStatus, typeof candidates>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Pipeline</h1>
        <p className="text-muted-foreground mt-2">
          Visualize and manage candidate progression through the recruitment pipeline with drag-and-drop.
        </p>
      </div>
      <CandidateKanban initialCandidates={candidatesByStatus} />
    </div>
  );
}
