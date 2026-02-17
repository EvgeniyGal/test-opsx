import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Agency CRM",
  description: "A premium, feature-rich CRM for HR agencies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  // Don't show navigation on auth pages
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          {isAuthPage ? (
            children
          ) : (
            <AppLayout>{children}</AppLayout>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
