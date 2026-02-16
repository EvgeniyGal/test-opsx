import { ClientDetail } from "@/components/clients/ClientDetail";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8 px-4">
      <ClientDetail clientId={id} />
    </div>
  );
}
