"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  clientId: string;
  contactId?: string;
  initialData?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    isPrimary: boolean;
    notes?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContactForm({
  clientId,
  contactId,
  initialData,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [role, setRole] = useState(initialData?.role ?? "");
  const [isPrimary, setIsPrimary] = useState(initialData?.isPrimary ?? false);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!contactId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const url = isEdit
        ? `/api/clients/${clientId}/contacts/${contactId}`
        : `/api/clients/${clientId}/contacts`;
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? { name: name.trim(), email: email || undefined, phone: phone || undefined, role: role || undefined, isPrimary, notes: notes || undefined }
        : { name: name.trim(), email: email || undefined, phone: phone || undefined, role: role || undefined, isPrimary, notes: notes || undefined };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save contact");
        return;
      }
      onSuccess?.();
    } catch {
      setError("Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="contact-name">Name *</Label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-role">Role</Label>
        <Input
          id="contact-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact-notes">Notes</Label>
        <Input
          id="contact-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="contact-primary"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="contact-primary">Primary contact</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Add"} Contact
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
