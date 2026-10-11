import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css"; // THIS RESTORES YOUR CSS
import GlobalCursorLayer from "@/components/GlobalCursorLayer";

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
        <Suspense fallback={children}>
          <GlobalCursorLayer>{children}</GlobalCursorLayer>
        </Suspense>
      </body>
    </html>
  );
}