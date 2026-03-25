import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANTON — UX Designer",
  description: "Portfolio of Anton — UX Designer. Retro-digital aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0f]">
        {children}
      </body>
    </html>
  );
}
