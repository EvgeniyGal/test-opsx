import { ApprovalQueue } from "@/components/admin/ApprovalQueue";

export const dynamic = "force-dynamic";

export default function ApprovalsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Approval Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve status change requests
        </p>
      </div>
      <ApprovalQueue />
    </div>
  );
}
