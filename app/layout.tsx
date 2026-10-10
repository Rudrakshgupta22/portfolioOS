import type { Metadata } from "next";
import "./globals.css"; // THIS RESTORES YOUR CSS

export const metadata: Metadata = {
  title: "Rudraksh | AI/ML Architect",
  description: "Mission Control OS Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#EBE9E1]">
        {children}
      </body>
    </html>
  );
}