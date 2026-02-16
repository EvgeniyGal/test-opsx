"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { Role } from "@prisma/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
}

interface AssignSectionProps {
  clientId: string;
  currentAssignedTo: string | null;
  onSuccess?: () => void;
}

export function AssignSection({ clientId, currentAssignedTo, onSuccess }: AssignSectionProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState(currentAssignedTo ?? "");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        const list = data.users ?? [];
        setUsers(list.filter((u: User) => (u.role === "OWNER" || u.role === "MANAGER") && u.status === "ACTIVE"));
      })
      .finally(() => setFetchingUsers(false));
  }, []);

  useEffect(() => {
    setSelectedId(currentAssignedTo ?? "");
  }, [currentAssignedTo]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to assign");
        return;
      }
      onSuccess?.();
    } catch {
      alert("Failed to assign");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUsers || users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssign} className="flex flex-wrap items-end gap-2">
          <div className="min-w-[200px]">
            <Label>Assign to</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
