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
import { Mail, Plus, Pencil, Trash2, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { canManageContacts } from "@/lib/auth";
import { ContactForm } from "./ContactForm";

interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  isPrimary: boolean;
  notes?: string | null;
}

interface ContactListProps {
  clientId: string;
  initialContacts?: Contact[];
  onUpdate?: () => void;
}

export function ContactList({ clientId, initialContacts, onUpdate }: ContactListProps) {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts ?? []);
  const [loading, setLoading] = useState(!initialContacts?.length);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const canManage = session?.user?.role ? canManageContacts(session.user.role) : false;

  const fetchContacts = () => {
    fetch(`/api/clients/${clientId}/contacts`)
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialContacts?.length) fetchContacts();
    else setContacts(initialContacts);
  }, [clientId, initialContacts]);

  const handleDelete = async (contactId: string) => {
    if (!confirm("Remove this contact? Client must have at least one contact.")) return;
    const res = await fetch(`/api/clients/${clientId}/contacts/${contactId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete");
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    setEditingId(null);
    onUpdate?.();
  };

  const handleSaved = () => {
    setAdding(false);
    setEditingId(null);
    fetchContacts();
    onUpdate?.();
  };

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.name}</span>
            {row.original.isPrimary && (
              <Badge variant="secondary">Primary</Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => row.original.role ?? "—",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="flex items-center gap-2 text-sm">
            {row.original.email ? (
              <>
                <Mail className="h-4 w-4 shrink-0" />
                {row.original.email}
              </>
            ) : (
              "—"
            )}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone ?? "—",
      },
      ...(canManage
        ? [
            {
              id: "actions",
              header: "",
              cell: ({ row }) => (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(row.original.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row.original.id)}
                    disabled={contacts.length <= 1}
                    title={
                      contacts.length <= 1
                        ? "At least one contact required"
                        : "Remove contact"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            } as ColumnDef<Contact>,
          ]
        : []),
    ],
    [canManage, contacts.length]
  );

  const table = useReactTable({
    data: contacts,
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
              <Mail className="h-5 w-5" />
              Contacts
            </CardTitle>
            <CardDescription>{contacts.length} contact(s)</CardDescription>
          </div>
          {canManage && !adding && (
            <Button
              size="icon"
              onClick={() => setAdding(true)}
              title="Add Contact"
              className="shrink-0 sm:w-auto sm:h-8 sm:px-3"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <ContactForm
              clientId={clientId}
              onSuccess={handleSaved}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}
        {editingId && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <ContactForm
              clientId={clientId}
              contactId={editingId}
              initialData={contacts.find((c) => c.id === editingId)}
              onSuccess={handleSaved}
              onCancel={() => setEditingId(null)}
            />
          </div>
        )}
        {contacts.length > 0 && !editingId && (
          <>
            {/* Mobile: card per contact (column - value) */}
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
                        <span className="text-muted-foreground shrink-0">Name</span>
                        <span className="font-medium text-right truncate">
                          {c.name}
                          {c.isPrimary && (
                            <Badge variant="secondary" className="ml-1.5 text-xs">
                              Primary
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Role</span>
                        <span className="text-right truncate">{c.role ?? "—"}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Email</span>
                        <span className="text-right truncate">{c.email ?? "—"}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground shrink-0">Phone</span>
                        <span className="text-right truncate">{c.phone ?? "—"}</span>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingId(c.id)}
                        >
                          <Pencil className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(c.id)}
                          disabled={contacts.length <= 1}
                          title={contacts.length <= 1 ? "At least one contact required" : "Remove contact"}
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Remove
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
