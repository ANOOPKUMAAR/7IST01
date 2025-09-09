
"use client";

import type { ReactNode } from "react";
import { AppProvider, useAppContext } from "@/contexts/app-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";


function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <Icons.logo className="h-24 w-24 text-primary animate-spin" />
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
            WiTrack
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>WiTrack</title>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AppProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
