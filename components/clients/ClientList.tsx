"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ClientStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { canCreateClient } from "@/lib/auth";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  assignedTo: string | null;
  assignedUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  contacts: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  }>;
  updatedAt: string;
}

const statusBadgeClass: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PROSPECT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  INACTIVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function ClientList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedToFilter, setAssignedToFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (assignedToFilter !== "all") params.append("assignedTo", assignedToFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", page.toString());
      params.append("limit", "20");

      const response = await fetch(`/api/clients?${params.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || `Failed to fetch clients (${response.status})`);
        return;
      }
      setClients(data.clients);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [statusFilter, assignedToFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) fetchClients();
      else setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              statusBadgeClass[row.original.status] ?? statusBadgeClass.ARCHIVED
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "assignedTo",
        accessorFn: (row) => row.assignedUser?.name ?? "Unassigned",
        header: "Assigned To",
        cell: ({ row }) => row.original.assignedUser?.name ?? "Unassigned",
      },
      {
        id: "primaryContact",
        accessorFn: (row) => {
          const c = row.contacts.find((x) => x.email) || row.contacts[0];
          return c ? `${c.name} ${c.email ?? ""}`.trim() : "";
        },
        header: "Primary Contact",
        cell: ({ row }) => {
          const primary = row.original.contacts.find((c) => c.email) || row.original.contacts[0];
          if (!primary) return "No contact";
          return (
            <div>
              <div className="font-medium">{primary.name}</div>
              {primary.email && (
                <div className="text-sm text-muted-foreground">{primary.email}</div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: ({ row }) =>
          new Date(row.original.updatedAt).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: clients,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const canCreate = session?.user?.role ? canCreateClient(session.user.role) : false;

  if (loading && clients.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PROSPECT">Prospect</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignments</SelectItem>
              {session?.user?.id && (
                <SelectItem value={session.user.id}>Assigned to me</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {canCreate && (
          <Button onClick={() => router.push("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No clients found
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {table.getRowModel().rows.map((row) => {
              const client = row.original;
              const primary = client.contacts.find((c) => c.email) || client.contacts[0];
              return (
                <Card
                  key={client.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate">
                          {client.name}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              statusBadgeClass[client.status] ?? statusBadgeClass.ARCHIVED
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span>{client.assignedUser?.name ?? "Unassigned"}</span>
                          </div>
                          {primary && (
                            <div className="truncate">
                              {primary.name}
                              {primary.email && (
                                <span className="text-muted-foreground/80">
                                  {" · "}
                                  {primary.email}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {new Date(client.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block rounded-md border">
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
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/clients/${row.original.id}`)}
                  >
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
