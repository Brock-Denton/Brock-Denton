import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Posting Engine",
  description: "Generate, review, and post in your voice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
