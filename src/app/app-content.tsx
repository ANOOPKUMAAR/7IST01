"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";
import { BottomNav } from "@/components/bottom-nav";

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, mode } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!mode) {
        if (pathname !== '/select-role') {
          router.replace('/select-role');
        }
      } else {
        if (pathname === '/select-role' || pathname === '/') {
          router.replace('/dashboard');
        }
      }
    }
  }, [isLoaded, mode, pathname, router]);
  
  const isAuthPage = pathname === '/select-role';
  const showLoading = !isLoaded || (!mode && !isAuthPage);

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <Icons.logo className="h-24 w-24 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
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
