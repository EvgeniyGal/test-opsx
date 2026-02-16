import { PendingUsersTable } from "@/components/auth/PendingUsersTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function PendingUsersPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending User Approvals</CardTitle>
          <CardDescription>Review and approve user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <PendingUsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
