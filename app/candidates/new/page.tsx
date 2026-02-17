import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { canCreateCandidate } from "@/lib/auth";
import { CandidateForm } from "@/components/candidates/CandidateForm";

export default async function NewCandidatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check RBAC
  if (!canCreateCandidate(session.user.role)) {
    redirect("/candidates");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Candidate</h1>
        <p className="text-muted-foreground mt-2">
          Add a new candidate to the recruitment pipeline.
        </p>
      </div>
      <CandidateForm />
    </div>
  );
}
