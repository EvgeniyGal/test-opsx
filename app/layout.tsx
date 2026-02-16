import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Agency CRM",
  description: "A premium, feature-rich CRM for HR agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
