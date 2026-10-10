"use client";

import { useRouter } from "next/navigation";
import PremiumIntro from "@/components/PremiumIntro";

export default function GatewayPage() {
  const router = useRouter();

  return <PremiumIntro onEnter={() => router.push("/hub")} />;
}
