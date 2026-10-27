import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Aksharam · A little Malayalam, every day",
    template: "%s · Aksharam",
  },
  description:
    "Find your way into the Malayalam alphabet with thoughtful flashcards, guided lessons, and a little practice every day.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
