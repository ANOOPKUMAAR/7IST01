"use client";

import type { ReactNode } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";
import { BottomNav } from "@/components/bottom-nav";

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <Icons.logo className="h-24 w-24 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 mb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
