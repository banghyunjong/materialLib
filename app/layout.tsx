import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
