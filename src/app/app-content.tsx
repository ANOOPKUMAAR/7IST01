
"use client";

import type { ReactNode } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Header } from "@/components/header";
import { Icons } from "@/components/icons";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

function FacultyView() {
  return (
    <div className="flex-1 flex items-center justify-center">
        <Card className="m-4 text-center">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <Briefcase className="h-12 w-12 text-primary"/>
                </div>
                <CardTitle>Faculty Mode</CardTitle>
                <CardDescription>This is the faculty dashboard view. More features coming soon!</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">You can manage your courses and view student attendance here.</p>
            </CardContent>
        </Card>
    </div>
  )
}

export function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, mode } = useAppContext();

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
        {mode === 'faculty' ? <FacultyView /> : children}
      </main>
      <BottomNav />
    </div>
  );
}

    