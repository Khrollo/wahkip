import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wahkip",
  description: "AI-powered local discovery & 1-day itineraries",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
