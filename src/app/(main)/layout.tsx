
"use client";

import { SidebarProvider, SidebarInset, SidebarRail, Sidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";
import { useAppContext } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isLoggedIn } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      router.replace("/register");
    }
  }, [isLoaded, isLoggedIn, router]);

  if (!isLoaded || !isLoggedIn) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Icons.logo className="h-24 w-24 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
}
