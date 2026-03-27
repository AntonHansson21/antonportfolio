import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADAM — UX Designer",
  description: "Portfolio of Adam — UX Designer. Retro-digital aesthetic.",
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
