"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";

interface TimelineItem {
  type: "comment" | "status_change" | "status_comment";
  id: string;
  content?: string;
  fromStatus?: string;
  toStatus?: string;
  comment?: string | null;
  createdAt: string | Date;
  createdBy: { id: string; name: string; email: string };
  statusHistoryId?: string;
}

interface CommentTimelineProps {
  clientId: string;
  refreshTrigger?: number;
}

export function CommentTimeline({ clientId, refreshTrigger }: CommentTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = () => {
    fetch(`/api/clients/${clientId}/comments`)
      .then((res) => res.json())
      .then((data) => setTimeline(data.timeline ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimeline();
  }, [clientId, refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Activity & Comments
          </CardTitle>
          <CardDescription>No comments or status changes yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Activity & Comments
        </CardTitle>
        <CardDescription>Chronological timeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item) => {
            const date = new Date(item.createdAt).toLocaleString();
            const user = item.createdBy?.name ?? "Unknown";
            if (item.type === "comment") {
              return (
                <div key={item.id} className="border-l-2 border-muted pl-4 py-2">
                  <div className="text-sm text-muted-foreground">
                    {user} · {date}
                  </div>
                  <div className="font-medium text-sm mt-1">Comment</div>
                  <div className="text-sm mt-1">{item.content}</div>
                </div>
              );
            }
            if (item.type === "status_change") {
              return (
                <div key={item.id} className="border-l-2 border-primary pl-4 py-2">
                  <div className="text-sm text-muted-foreground">
                    {user} · {date}
                  </div>
                  <div className="font-medium text-sm mt-1">
                    Status: {item.fromStatus} → {item.toStatus}
                  </div>
                  {item.comment && (
                    <div className="text-sm mt-1 text-muted-foreground">{item.comment}</div>
                  )}
                </div>
              );
            }
            if (item.type === "status_comment") {
              return (
                <div key={item.id} className="border-l-2 border-muted pl-4 py-2 ml-4">
                  <div className="text-sm text-muted-foreground">
                    {user} · {date}
                  </div>
                  <div className="text-sm mt-1">{item.content}</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
