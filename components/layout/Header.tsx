import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header({ mobileMenuTrigger }: { mobileMenuTrigger?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-lg">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Hamburger menu button - only visible on mobile */}
        {mobileMenuTrigger}

        {/* Application branding */}
        <div className="ml-2 md:ml-0">
          <h1 className="text-xl font-semibold">HR Agency CRM</h1>
        </div>

        {/* Theme toggle */}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
