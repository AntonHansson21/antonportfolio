import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anton Hansson — Portfolio",
  description: "UX Designer Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
