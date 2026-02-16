"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { ClientStatus } from "@prisma/client";

interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

interface ClientFormData {
  name: string;
  industry: string;
  website: string;
  taxId: string;
  registrationNumber: string;
  logo: string;
  contacts: Contact[];
}

interface ClientFormProps {
  clientId?: string;
  initialData?: Partial<ClientFormData>;
}

export function ClientForm({ clientId, initialData }: ClientFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || "",
    industry: initialData?.industry || "",
    website: initialData?.website || "",
    taxId: initialData?.taxId || "",
    registrationNumber: initialData?.registrationNumber || "",
    logo: initialData?.logo || "",
    contacts: initialData?.contacts || [{ name: "", email: "", phone: "", role: "", isPrimary: true }],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (clientId && !initialData) {
      // Load client data for edit mode
      fetch(`/api/clients/${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.client) {
            setFormData({
              name: data.client.name || "",
              industry: data.client.industry || "",
              website: data.client.website || "",
              taxId: data.client.taxId || "",
              registrationNumber: data.client.registrationNumber || "",
              logo: data.client.logo || "",
              contacts: data.client.contacts?.length
                ? data.client.contacts.map((c: any) => ({
                    name: c.name || "",
                    email: c.email || "",
                    phone: c.phone || "",
                    role: c.role || "",
                    isPrimary: c.isPrimary || false,
                  }))
                : [{ name: "", email: "", phone: "", role: "", isPrimary: true }],
            });
          }
        })
        .catch(() => setError("Failed to load client data"));
    }
  }, [clientId, initialData]);

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: "", email: "", phone: "", role: "", isPrimary: false }],
    });
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length <= 1) {
      setError("At least one contact is required");
      return;
    }
    const newContacts = formData.contacts.filter((_, i) => i !== index);
    // Ensure at least one is primary
    if (!newContacts.some((c) => c.isPrimary) && newContacts.length > 0) {
      newContacts[0].isPrimary = true;
    }
    setFormData({ ...formData, contacts: newContacts });
  };

  const updateContact = (index: number, field: keyof Contact, value: string | boolean) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    // If setting as primary, unset others
    if (field === "isPrimary" && value === true) {
      newContacts.forEach((c, i) => {
        if (i !== index) c.isPrimary = false;
      });
    }
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Client name is required");
      return;
    }

    if (formData.contacts.length === 0) {
      setError("At least one contact is required");
      return;
    }

    const validContacts = formData.contacts.filter((c) => c.name.trim());
    if (validContacts.length === 0) {
      setError("At least one contact with a name is required");
      return;
    }

    // Ensure at least one is primary
    if (!validContacts.some((c) => c.isPrimary)) {
      validContacts[0].isPrimary = true;
    }

    setIsLoading(true);

    try {
      const url = clientId ? `/api/clients/${clientId}` : "/api/clients";
      const method = clientId ? "PATCH" : "POST";
      const body = clientId
        ? {
            name: formData.name,
            industry: formData.industry || undefined,
            website: formData.website || undefined,
            taxId: formData.taxId || undefined,
            registrationNumber: formData.registrationNumber || undefined,
            logo: formData.logo || undefined,
          }
        : {
            name: formData.name,
            industry: formData.industry || undefined,
            website: formData.website || undefined,
            taxId: formData.taxId || undefined,
            registrationNumber: formData.registrationNumber || undefined,
            logo: formData.logo || undefined,
            contacts: validContacts.map((c) => ({
              name: c.name,
              email: c.email || undefined,
              phone: c.phone || undefined,
              role: c.role || undefined,
              isPrimary: c.isPrimary,
            })),
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save client");
        return;
      }

      // Redirect to client detail page
      router.push(`/clients/${clientId || data.client?.id}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Client Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          />
        </div>
      </div>

      {!clientId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Contacts *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addContact}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {formData.contacts.map((contact, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Contact {index + 1}</Label>
                {formData.contacts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`contact-name-${index}`}>Name *</Label>
                  <Input
                    id={`contact-name-${index}`}
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`contact-email-${index}`}>Email</Label>
                  <Input
                    id={`contact-email-${index}`}
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact(index, "email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`contact-phone-${index}`}>Phone</Label>
                  <Input
                    id={`contact-phone-${index}`}
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact-role-${index}`}>Role</Label>
                  <Input
                    id={`contact-role-${index}`}
                    value={contact.role}
                    onChange={(e) => updateContact(index, "role", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`contact-primary-${index}`}
                  checked={contact.isPrimary}
                  onChange={(e) => updateContact(index, "isPrimary", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`contact-primary-${index}`} className="cursor-pointer">
                  Primary Contact
                </Label>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {clientId ? "Update Client" : "Create Client"}
        </Button>
      </div>
    </form>
  );
}
