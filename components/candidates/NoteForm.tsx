"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NoteFormProps {
  candidateId: string;
  onSuccess?: () => void;
}

export function NoteForm({ candidateId, onSuccess }: NoteFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Note cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add note");
        return;
      }
      setContent("");
      onSuccess?.();
    } catch {
      setError("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Label htmlFor="note-content">Add a note</Label>
      <Textarea
        id="note-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a note..."
        className="border-2 focus:border-primary transition-colors"
        disabled={loading}
        rows={3}
      />
      <Button type="submit" size="sm" disabled={loading} variant="gradient">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Note
      </Button>
    </form>
  );
}
