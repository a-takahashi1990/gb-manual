import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "案件進捗管理システム | gb-manual",
  description: "kintone ライクな社内向け案件進捗管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-muted/30 antialiased">{children}</body>
    </html>
  );
}
