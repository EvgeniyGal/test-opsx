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
import { UserStatus } from "@prisma/client";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  status: UserStatus;
}

export function PendingUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users?status=PENDING");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to approve user");
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError("Failed to approve user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to reject user");
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError("Failed to reject user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  if (users.length === 0) {
    return <div>No pending users</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    {actionLoading === user.id ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    {actionLoading === user.id ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
