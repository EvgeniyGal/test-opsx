"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ClientStatus, StatusChangeRequestStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ApprovalRequest {
  id: string;
  clientId: string;
  fromStatus: ClientStatus;
  toStatus: ClientStatus;
  comment: string | null;
  status: StatusChangeRequestStatus;
  requestedAt: string;
  client: {
    id: string;
    name: string;
    status: ClientStatus;
  };
  requestedByUser: {
    id: string;
    name: string;
    email: string;
  };
}

export function ApprovalQueue() {
  const router = useRouter();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "requestedAt", desc: false }]);

  const fetchRequests = () => {
    setLoading(true);
    fetch("/api/admin/approvals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch approvals");
        return res.json();
      })
      .then((data) => {
        setRequests(data.requests);
      })
      .catch(() => {
        setError("Failed to load approval requests");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string, clientId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/clients/${clientId}/status/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to approve request");
        return;
      }
      fetchRequests();
    } catch (err) {
      alert("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string, clientId: string) => {
    const reviewComment = prompt("Rejection reason (optional):");
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/clients/${clientId}/status/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, reviewComment }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to reject request");
        return;
      }
      fetchRequests();
    } catch (err) {
      alert("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const columns = useMemo<ColumnDef<ApprovalRequest>[]>(
    () => [
      {
        accessorKey: "client",
        accessorFn: (row) => row.client.name,
        header: "Client",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.client.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.client.status}
            </div>
          </div>
        ),
      },
      {
        id: "requestedBy",
        accessorFn: (row) => row.requestedByUser.name,
        header: "Requested by",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.requestedByUser.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.requestedByUser.email}
            </div>
          </div>
        ),
      },
      {
        id: "statusChange",
        accessorFn: (row) => `${row.fromStatus}→${row.toStatus}`,
        header: "Status change",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.fromStatus} → {row.original.toStatus}
          </span>
        ),
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
            {row.original.comment ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "requestedAt",
        header: "Requested",
        accessorFn: (row) => new Date(row.requestedAt).getTime(),
        cell: ({ row }) =>
          new Date(row.original.requestedAt).toLocaleString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const r = row.original;
          const busy = actionLoading === r.id;
          return (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                onClick={() => handleApprove(r.id, r.clientId)}
                disabled={busy}
                className="bg-green-600 hover:bg-green-700"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                )}
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(r.id, r.clientId)}
                disabled={busy}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/clients/${r.clientId}`)}
              >
                View
              </Button>
            </div>
          );
        },
      },
    ],
    [actionLoading]
  );

  const table = useReactTable({
    data: requests,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pending approval requests
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <div
                    className={
                      header.column.getCanSort()
                        ? "flex items-center gap-1 cursor-pointer select-none"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span className="text-muted-foreground">
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
