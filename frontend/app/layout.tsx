import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChessMentor AI",
  description: "Play chess with AI coaching, evaluation, and move guidance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
