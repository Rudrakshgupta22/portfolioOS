"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function GlobalCursorLayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

  return (
    <div className={isStudio ? "contents" : "global-cursor-active contents"}>
      {children}
      {!isStudio && <CustomCursor />}
    </div>
  );
}
