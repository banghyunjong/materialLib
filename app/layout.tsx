import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Fabric Master DB",
  description: "Fabric Swatch Master Data Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </body>
    </html>
  );
}
