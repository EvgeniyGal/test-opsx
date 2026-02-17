import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { name: userName, role: userRole } = session.user;

  return (
    <div className="relative space-y-6">
      {/* Decorative blurred shapes */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white blur-3xl opacity-10 dark:bg-blue-500" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500 blur-3xl opacity-10 dark:bg-indigo-700" />
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your CRM dashboard.
        </p>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/clients" className="text-primary hover:underline">
                View Clients
              </a>
            </li>
            {(userRole === "OWNER" || userRole === "MANAGER") && (
              <li>
                <a href="/clients/new" className="text-primary hover:underline">
                  Add New Client
                </a>
              </li>
            )}
            {userRole === "OWNER" && (
              <li>
                <a
                  href="/admin/approvals"
                  className="text-primary hover:underline"
                >
                  Approval Queue
                </a>
              </li>
            )}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Your Role</h2>
          <p className="text-sm text-muted-foreground">
            You are logged in as <strong>{userRole}</strong>
          </p>
        </Card>
      </div>
    </div>
  );
}
