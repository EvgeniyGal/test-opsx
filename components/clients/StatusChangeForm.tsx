"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientStatus } from "@prisma/client";
import { getValidTransitions, isCriticalTransition } from "@/lib/client-status";
import { Loader2 } from "lucide-react";

interface StatusChangeFormProps {
  clientId: string;
  currentStatus: ClientStatus;
  onSuccess?: () => void;
}

export function StatusChangeForm({
  clientId,
  currentStatus,
  onSuccess,
}: StatusChangeFormProps) {
  const [toStatus, setToStatus] = useState<ClientStatus | "">("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validTargets = getValidTransitions(currentStatus);
  const needsComment = toStatus && isCriticalTransition(currentStatus, toStatus as ClientStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!toStatus) {
      setError("Please select a target status");
      return;
    }
    if (needsComment && !comment.trim()) {
      setError("A comment is required for this status transition");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/status/direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStatus, comment: comment.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change status");
        return;
      }
      setToStatus("");
      setComment("");
      onSuccess?.();
    } catch {
      setError("Failed to change status");
    } finally {
      setLoading(false);
    }
  };

  if (validTargets.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label>Current status: {currentStatus}</Label>
      </div>
      <div>
        <Label htmlFor="toStatus">Change to</Label>
        <Select value={toStatus} onValueChange={(v) => setToStatus(v as ClientStatus)}>
          <SelectTrigger id="toStatus" className="mt-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {validTargets.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {needsComment && (
        <div>
          <Label htmlFor="comment">Comment (required)</Label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            placeholder="Reason for this status change..."
          />
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Change Status
      </Button>
    </form>
  );
}
