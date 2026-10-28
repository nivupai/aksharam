import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Aksharam · Malayalam alphabet",
    template: "%s · Aksharam",
  },
  description:
    "Study the Malayalam alphabet with flashcards, lessons, tests, and a searchable reference.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
