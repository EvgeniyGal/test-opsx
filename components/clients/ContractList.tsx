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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Pencil, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { canManageContracts } from "@/lib/auth";
import { ContractForm } from "./ContractForm";

interface Contract {
  id: string;
  type: string;
  startDate?: string | null;
  endDate?: string | null;
  terms?: string | null;
  paymentTerms?: string | null;
  documentPath?: string | null;
  status?: string | null;
}

interface ContractListProps {
  clientId: string;
  initialContracts?: Contract[];
  onUpdate?: () => void;
}

export function ContractList({ clientId, initialContracts, onUpdate }: ContractListProps) {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<Contract[]>(initialContracts ?? []);
  const [loading, setLoading] = useState(!initialContracts?.length);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const canManage = session?.user?.role ? canManageContracts(session.user.role) : false;

  const fetchContracts = () => {
    fetch(`/api/clients/${clientId}/contracts`)
      .then((res) => res.json())
      .then((data) => setContracts(data.contracts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialContracts?.length) fetchContracts();
    else setContracts(initialContracts);
  }, [clientId, initialContracts]);

  const handleSaved = () => {
    setAdding(false);
    setEditingId(null);
    fetchContracts();
    onUpdate?.();
  };

  const columns = useMemo<ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{row.original.type}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.status ? (
            <Badge variant="outline">{row.original.status}</Badge>
          ) : (
            "—"
          ),
      },
      {
        accessorKey: "startDate",
        header: "Start",
        accessorFn: (row) => (row.startDate ? new Date(row.startDate).getTime() : 0),
        cell: ({ row }) =>
          row.original.startDate
            ? new Date(row.original.startDate).toLocaleDateString()
            : "—",
      },
      {
        accessorKey: "endDate",
        header: "End",
        accessorFn: (row) => (row.endDate ? new Date(row.endDate).getTime() : 0),
        cell: ({ row }) =>
          row.original.endDate
            ? new Date(row.original.endDate).toLocaleDateString()
            : "—",
      },
      {
        accessorKey: "paymentTerms",
        header: "Payment Terms",
        cell: ({ row }) => row.original.paymentTerms ?? "—",
      },
      ...(canManage
        ? [
            {
              id: "actions",
              header: "",
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(row.original.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ),
            } as ColumnDef<Contract>,
          ]
        : []),
    ],
    [canManage]
  );

  const table = useReactTable({
    data: contracts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contracts
            </CardTitle>
            <CardDescription>{contracts.length} contract(s)</CardDescription>
          </div>
          {canManage && !adding && (
            <Button
              size="icon"
              onClick={() => setAdding(true)}
              title="Add Contract"
              className="shrink-0 sm:w-auto sm:h-8 sm:px-3"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Contract</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <ContractForm
              clientId={clientId}
              onSuccess={handleSaved}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}
        {editingId && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <ContractForm
              clientId={clientId}
              contractId={editingId}
              initialData={contracts.find((c) => c.id === editingId)}
              onSuccess={handleSaved}
              onCancel={() => setEditingId(null)}
            />
          </div>
        )}
        {contracts.length > 0 && !editingId && (
          <>
            {/* Mobile: card per contract (column - value) */}
            <div className="space-y-3 md:hidden">
              {table.getRowModel().rows.map((row) => {
                const c = row.original;
                return (
                  <div
                    key={c.id}
                    className="rounded-lg border bg-card p-4 space-y-3"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Type</span>
                        <span className="font-medium text-right flex items-center gap-1.5 justify-end">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          {c.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Status</span>
                        <span className="text-right">
                          {c.status ? (
                            <Badge variant="outline">{c.status}</Badge>
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Start</span>
                        <span className="text-right truncate">
                          {c.startDate
                            ? new Date(c.startDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">End</span>
                        <span className="text-right truncate">
                          {c.endDate
                            ? new Date(c.endDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-muted-foreground shrink-0">Payment Terms</span>
                        <span className="text-right truncate">{c.paymentTerms ?? "—"}</span>
                      </div>
                    </div>
                    {canManage && (
                      <div className="pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(c.id)}
                        >
                          <Pencil className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
