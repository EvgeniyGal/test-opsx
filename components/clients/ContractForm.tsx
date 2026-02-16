"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractType } from "@prisma/client";
import { Loader2 } from "lucide-react";

const CONTRACT_TYPES: ContractType[] = [
  "RETAINER",
  "PROJECT_BASED",
  "HOURLY",
  "FIXED_PRICE",
  "OTHER",
];

interface ContractFormProps {
  clientId: string;
  contractId?: string;
  initialData?: {
    type: string;
    startDate?: string | null;
    endDate?: string | null;
    terms?: string | null;
    paymentTerms?: string | null;
    documentPath?: string | null;
    status?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContractForm({
  clientId,
  contractId,
  initialData,
  onSuccess,
  onCancel,
}: ContractFormProps) {
  const [type, setType] = useState<ContractType>(
    (initialData?.type as ContractType) ?? "RETAINER"
  );
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? String(initialData.startDate).slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? String(initialData.endDate).slice(0, 10) : ""
  );
  const [terms, setTerms] = useState(initialData?.terms ?? "");
  const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms ?? "");
  const [documentPath, setDocumentPath] = useState(initialData?.documentPath ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!contractId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isEdit
        ? `/api/clients/${clientId}/contracts/${contractId}`
        : `/api/clients/${clientId}/contracts`;
      const method = isEdit ? "PATCH" : "POST";
      const body = {
        type,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        terms: terms || undefined,
        paymentTerms: paymentTerms || undefined,
        documentPath: documentPath || undefined,
        status: status || undefined,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save contract");
        return;
      }
      onSuccess?.();
    } catch {
      setError("Failed to save contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label>Type *</Label>
        <Select value={type} onValueChange={(v) => setType(v as ContractType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTRACT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input
          id="paymentTerms"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="terms">Terms</Label>
        <Input
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="documentPath">Document Path / URL</Label>
        <Input
          id="documentPath"
          value={documentPath}
          onChange={(e) => setDocumentPath(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="e.g. Active, Expired"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Add"} Contract
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
