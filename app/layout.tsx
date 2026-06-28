import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REALTOREPROS CRM",
  description: "Enterprise real estate CRM and realtor management system for RealtyPros Investment Global Ltd.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
