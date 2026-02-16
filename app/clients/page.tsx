import { ClientList } from "@/components/clients/ClientList";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground mt-2">
          Manage your client relationships and track their status
        </p>
      </div>
      <ClientList />
    </div>
  );
}
