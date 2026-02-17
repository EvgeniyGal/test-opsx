"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuButtonProps {
  onClick?: () => void;
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={onClick}
      aria-label="Open menu"
      type="button"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
