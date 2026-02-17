"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface MobileMenuProps {
  children: React.ReactNode; // Trigger button
  userRole: string;
  userName: string;
  userEmail: string;
}

export function MobileMenu({
  children,
  userRole,
  userName,
  userEmail,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[256px] p-0">
        <Sidebar
          userRole={userRole as any}
          userName={userName}
          userEmail={userEmail}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
