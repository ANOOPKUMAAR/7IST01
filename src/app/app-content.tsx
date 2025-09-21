"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { Icons } from "@/components/icons";
import { MainLayout } from "@/components/sidebar";

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, mode } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (mode) {
        if (pathname === '/select-role' || pathname === '/') {
            router.replace('/dashboard');
        }
      } else if (pathname !== '/select-role') {
          router.replace('/select-role');
      }
    }
  }, [isLoaded, mode, pathname, router]);

  if (!isLoaded && pathname !== '/select-role') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-2">
            <Icons.logo className="h-16 w-16 text-primary mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!mode || pathname === '/select-role') {
    return <>{children}</>;
  }
  
  return (
    <MainLayout>
        {children}
    </MainLayout>
  );
}
