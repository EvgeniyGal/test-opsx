import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // Show public landing page for unauthenticated users
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">HR Agency CRM</h1>
      <p className="mt-4 text-lg text-gray-600">Welcome to the HR Agency CRM</p>
      <div className="mt-6 flex gap-4">
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </main>
  );
}
