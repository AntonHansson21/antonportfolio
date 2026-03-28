import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anton Hansson — UX Designer",
  description: "UX Designer Portfolio by Anton Hansson",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
