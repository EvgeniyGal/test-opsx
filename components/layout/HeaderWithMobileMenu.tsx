"use client";

import { MobileMenu } from "./MobileMenu";
import { MobileMenuButton } from "./MobileMenuButton";
import { Header } from "./Header";

interface HeaderWithMobileMenuProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

export function HeaderWithMobileMenu({
  userRole,
  userName,
  userEmail,
}: HeaderWithMobileMenuProps) {
  return (
    <Header
      mobileMenuTrigger={
        <MobileMenu
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
        >
          <MobileMenuButton onClick={() => {}} />
        </MobileMenu>
      }
    />
  );
}
