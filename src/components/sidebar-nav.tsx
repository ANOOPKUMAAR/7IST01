"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAppContext } from "@/contexts/app-context";
import { BookCopy, Home, Settings, LogOut, BarChart3 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function SidebarNav() {
  const pathname = usePathname();
  const { subjects, isLoaded, adminMode, setAdminMode } = useAppContext();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Icons.logo />
            <span className="text-lg font-bold">WiTrack</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
              tooltip={{ children: "Dashboard" }}
            >
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/attendance-visuals")}
              tooltip={{ children: "Visuals" }}
            >
              <Link href="/attendance-visuals">
                <BarChart3 />
                <span>Visuals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Subjects</SidebarGroupLabel>
          <SidebarMenu>
            {isLoaded ? (
              subjects.map((subject) => (
                <SidebarMenuItem key={subject.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(`/subjects/${subject.id}`)}
                    tooltip={{ children: subject.name }}
                  >
                    <Link href={`/subjects/${subject.id}`}>
                      <BookCopy />
                      <span>{subject.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
             {isLoaded && subjects.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">No subjects yet. Add one in settings.</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         {adminMode && (
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setAdminMode(false)}>
            <LogOut className="text-destructive" />
            <span className="text-destructive">Exit Admin Mode</span>
          </Button>
         )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              tooltip={{ children: "Settings" }}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
