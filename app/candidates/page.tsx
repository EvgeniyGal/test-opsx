import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CandidateList } from "@/components/candidates/CandidateList";
import { Button } from "@/components/ui/button";
import { Kanban } from "lucide-react";
import Link from "next/link";

export default async function CandidatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground mt-2">
            Manage candidate applications and track their progress through the recruitment pipeline.
          </p>
        </div>
        <Link href="/candidates/kanban">
          <Button variant="outline">
            <Kanban className="mr-2 h-4 w-4" />
            View Pipeline
          </Button>
        </Link>
      </div>
      <CandidateList />
    </div>
  );
}
