import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">HR Agency CRM</h1>
      <p className="mt-4 text-lg text-gray-600">Welcome to the HR Agency CRM</p>
      <Button className="mt-6">Test Button</Button>
    </main>
  );
}
