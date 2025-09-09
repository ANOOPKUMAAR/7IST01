"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000); // 1 second delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-pulse">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Icons.logo className="h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
          WiTrack
        </h1>
      </div>
    </div>
  );
}
