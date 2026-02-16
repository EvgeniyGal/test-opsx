"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Edit, AlertCircle, Mail, Phone, Building2, Globe } from "lucide-react";
import { ClientStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { canUpdateClient, canAssignClient, canRequestStatusChange } from "@/lib/auth";
import { CommentTimeline } from "./CommentTimeline";
import { CommentForm } from "./CommentForm";
import { StatusHistory } from "./StatusHistory";
import { StatusChangeRequestForm } from "./StatusChangeRequestForm";
import { StatusChangeForm } from "./StatusChangeForm";
import { AssignSection } from "./AssignSection";
import { ContactList } from "./ContactList";
import { ContractList } from "./ContractList";

interface ClientDetailData {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  taxId: string | null;
  registrationNumber: string | null;
  logo: string | null;
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
    role: string | null;
    isPrimary: boolean;
  }>;
  contracts: Array<{
    id: string;
    type: string;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [client, setClient] = useState<ClientDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentRefresh, setCommentRefresh] = useState(0);

  const fetchClient = useCallback(() => {
    fetch(`/api/clients/${clientId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch client");
        return res.json();
      })
      .then((data) => {
        setClient(data.client);
      })
      .catch(() => {
        setError("Failed to load client details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || "Client not found"}</AlertDescription>
      </Alert>
    );
  }

  const canEdit = session?.user?.role ? canUpdateClient(session.user.role) : false;
  const canAssign = session?.user?.role ? canAssignClient(session.user.role) : false;
  const canRequestStatus = session?.user?.role ? canRequestStatusChange(session.user.role) : false;
  const isOwner = session?.user?.role === "OWNER";
  const primaryContact = client.contacts.find((c) => c.isPrimary) || client.contacts[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              className={
                client.status === "ACTIVE"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : client.status === "PROSPECT"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : client.status === "INACTIVE"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }
            >
              {client.status}
            </Badge>
            {client.assignedUser && (
              <span className="text-sm text-muted-foreground">
                Assigned to: {client.assignedUser.name}
              </span>
            )}
          </div>
        </div>
        {canEdit && (
          <Button
            onClick={() => router.push(`/clients/${clientId}/edit`)}
            title="Edit Client"
            size="icon"
            className="shrink-0 sm:w-auto sm:px-4"
          >
            <Edit className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Client</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.industry && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Industry</div>
                <div>{client.industry}</div>
              </div>
            )}
            {client.website && (
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Website
                </div>
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {client.website}
                </a>
              </div>
            )}
            {client.taxId && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Tax ID</div>
                <div>{client.taxId}</div>
              </div>
            )}
            {client.registrationNumber && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Registration Number</div>
                <div>{client.registrationNumber}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {primaryContact ? (
              <div className="space-y-2">
                <div className="font-medium">{primaryContact.name}</div>
                {primaryContact.role && (
                  <div className="text-sm text-muted-foreground">{primaryContact.role}</div>
                )}
                {primaryContact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    {primaryContact.email}
                  </div>
                )}
                {primaryContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {primaryContact.phone}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">No contact information</div>
            )}
          </CardContent>
        </Card>
      </div>

      {canAssign && (
        <AssignSection
          clientId={clientId}
          currentAssignedTo={client.assignedTo}
          onSuccess={fetchClient}
        />
      )}

      {canRequestStatus && !isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Request Status Change</CardTitle>
            <CardDescription>Request will be sent to Owner for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChangeRequestForm
              clientId={clientId}
              currentStatus={client.status}
              onSuccess={fetchClient}
            />
          </CardContent>
        </Card>
      )}

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Change Status (Owner)</CardTitle>
            <CardDescription>Apply status change directly</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChangeForm
              clientId={clientId}
              currentStatus={client.status}
              onSuccess={fetchClient}
            />
          </CardContent>
        </Card>
      )}

      <ContactList
        clientId={clientId}
        initialContacts={client.contacts}
        onUpdate={fetchClient}
      />

      <ContractList
        clientId={clientId}
        initialContracts={client.contracts}
        onUpdate={fetchClient}
      />

      <StatusHistory clientId={clientId} />

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Add a comment or view activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CommentForm clientId={clientId} onSuccess={() => setCommentRefresh((c) => c + 1)} />
        </CardContent>
      </Card>

      <CommentTimeline clientId={clientId} refreshTrigger={commentRefresh} />
    </div>
  );
}
