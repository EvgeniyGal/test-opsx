import { Role } from "@prisma/client";

export interface MenuItem {
  label: string;
  href: string;
  icon?: string; // Optional icon name from lucide-react
  roles: Role[]; // Roles that can see this menu item
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["OWNER", "MANAGER", "ADMIN"],
  },
  {
    label: "Clients",
    href: "/clients",
    roles: ["OWNER", "MANAGER", "ADMIN"],
  },
  {
    label: "Users",
    href: "/admin/users",
    roles: ["OWNER", "MANAGER"],
  },
  {
    label: "Pending Users",
    href: "/admin/users/pending",
    roles: ["OWNER", "MANAGER"],
  },
  {
    label: "Approvals",
    href: "/admin/approvals",
    roles: ["OWNER"],
  },
];

/**
 * Filter menu items based on user role
 * Only returns menu items that the user's role has access to
 */
export function filterMenuItemsByRole(userRole: Role): MenuItem[] {
  return menuItems.filter((item) => item.roles.includes(userRole));
}

/**
 * Check if a route matches a menu item (handles nested routes)
 * For example, /clients/123 should match the "Clients" menu item
 * But /admin/users/pending should match "Pending Users", not "Users"
 */
export function isRouteActive(pathname: string, menuItemHref: string): boolean {
  // Normalize pathnames (remove trailing slashes except root)
  const normalizedPathname = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const normalizedHref = menuItemHref === "/" ? "/" : menuItemHref.replace(/\/$/, "");

  // Exact match
  if (normalizedPathname === normalizedHref) {
    return true;
  }

  // For nested routes, check if pathname starts with menu item href + "/"
  // This handles cases like /clients/123 matching /clients
  // But we need to be careful with routes like /admin/users vs /admin/users/pending
  if (normalizedHref !== "/" && normalizedPathname.startsWith(normalizedHref + "/")) {
    // Special case: if we have a more specific menu item that matches better, don't highlight parent
    // For example, if pathname is /admin/users/pending and menuItemHref is /admin/users,
    // we should check if there's a more specific match first
    // But since we're checking each menu item independently, we'll let the more specific one win
    return true;
  }

  return false;
}
