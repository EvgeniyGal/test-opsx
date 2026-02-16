"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Loader2 } from "lucide-react";

interface StatusHistoryItem {
  id: string;
  fromStatus: string;
  toStatus: string;
  comment: string | null;
  changedAt: string;
  changedByUser: { id: string; name: string; email: string };
  statusComments: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdByUser: { id: string; name: string; email: string };
  }>;
}

interface StatusHistoryProps {
  clientId: string;
}

export function StatusHistory({ clientId }: StatusHistoryProps) {
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/clients/${clientId}/status-history`)
      .then((res) => res.json())
      .then((data) => setHistory(data.statusHistory ?? []))
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Status History
          </CardTitle>
          <CardDescription>No status changes yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Status History
        </CardTitle>
        <CardDescription>Audit trail of status changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="border-l-2 border-primary pl-4 py-2">
              <div className="text-sm text-muted-foreground">
                {item.changedByUser?.name ?? "Unknown"} · {new Date(item.changedAt).toLocaleString()}
              </div>
              <div className="font-medium text-sm mt-1">
                {item.fromStatus} → {item.toStatus}
              </div>
              {item.comment && (
                <div className="text-sm text-muted-foreground mt-1">{item.comment}</div>
              )}
              {item.statusComments?.length > 0 && (
                <div className="mt-2 ml-2 space-y-1">
                  {item.statusComments.map((sc) => (
                    <div key={sc.id} className="text-sm border-l border-muted pl-2">
                      <span className="text-muted-foreground">{sc.createdByUser?.name}: </span>
                      {sc.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
