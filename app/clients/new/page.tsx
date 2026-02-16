import { ClientForm } from "@/components/clients/ClientForm";

export const dynamic = "force-dynamic";

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Client</h1>
        <p className="text-muted-foreground mt-2">
          Create a new client record
        </p>
      </div>
      <div className="max-w-4xl">
        <ClientForm />
      </div>
    </div>
  );
}
