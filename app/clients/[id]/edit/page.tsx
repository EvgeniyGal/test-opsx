import { ClientForm } from "@/components/clients/ClientForm";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Client</h1>
        <p className="text-muted-foreground mt-2">
          Update client information
        </p>
      </div>
      <div className="max-w-4xl">
        <ClientForm clientId={id} />
      </div>
    </div>
  );
}
