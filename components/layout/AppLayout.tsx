import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { HeaderWithMobileMenu } from "./HeaderWithMobileMenu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export async function AppLayout({ children }: AppLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <>{children}</>;
  }

  // Get pathname from headers
  // Note: We'll need middleware to set x-pathname header, or use alternative approach
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  const { name: userName, email: userEmail, role: userRole } = session.user;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with Mobile Menu */}
      <HeaderWithMobileMenu
        userRole={userRole}
        userName={userName || ""}
        userEmail={userEmail || ""}
      />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar - hidden on mobile */}
        <aside className="hidden md:block">
          <Sidebar
            userRole={userRole as any}
            userName={userName || ""}
            userEmail={userEmail || ""}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
