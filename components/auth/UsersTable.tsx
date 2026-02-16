"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, UserStatus } from "@prisma/client";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export function UsersTable() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (roleFilter !== "all") params.append("role", roleFilter);
      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError("Failed to update user role");
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to suspend user");
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError("Failed to suspend user");
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reactivate`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to reactivate user");
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError("Failed to reactivate user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRole = session?.user?.role;
  const canEditRole = (targetUserRole: Role) => {
    if (!userRole) return false;
    if (userRole === "OWNER") return true;
    if (userRole === "MANAGER" && targetUserRole !== "OWNER") return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {canEditRole(user.role) ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      handleRoleChange(user.id, value as Role)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      {userRole === "OWNER" && (
                        <SelectItem value="OWNER">Owner</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <span>{user.role}</span>
                )}
              </TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell className="text-right">
                {userRole === "OWNER" && user.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSuspend(user.id)}
                  >
                    Suspend
                  </Button>
                )}
                {userRole === "OWNER" && user.status === "SUSPENDED" && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleReactivate(user.id)}
                  >
                    Reactivate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
