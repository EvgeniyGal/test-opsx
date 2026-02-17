export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>
            © {currentYear} HR Agency CRM. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
