"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { filterMenuItemsByRole, isRouteActive } from "@/lib/menu-config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignOutButton } from "./SignOutButton";

interface SidebarProps {
  userRole: Role;
  userName: string;
  userEmail: string;
  onNavigate?: () => void; // Optional callback for mobile menu to close on navigation
}

export function Sidebar({
  userRole,
  userName,
  userEmail,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const menuItems = filterMenuItemsByRole(userRole);

  // Sort menu items by specificity (longest href first) to prioritize more specific matches
  const sortedMenuItems = [...menuItems].sort((a, b) => b.href.length - a.href.length);

  // Find the active menu item (most specific match)
  const activeMenuItem = sortedMenuItems.find((item) => isRouteActive(pathname, item.href));

  // Get user initials for avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background shadow-lg">
      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = activeMenuItem?.href === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
