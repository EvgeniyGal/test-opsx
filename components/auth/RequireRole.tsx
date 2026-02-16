"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@prisma/client";
import { hasRoleOrHigher } from "@/lib/auth";

interface RequireRoleProps {
  children: React.ReactNode;
  requiredRole: Role;
}

export function RequireRole({ children, requiredRole }: RequireRoleProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!hasRoleOrHigher(session.user.role, requiredRole)) {
        router.push("/");
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session, requiredRole, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (
    status === "unauthenticated" ||
    (session?.user && !hasRoleOrHigher(session.user.role, requiredRole))
  ) {
    return null;
  }

  return <>{children}</>;
}
