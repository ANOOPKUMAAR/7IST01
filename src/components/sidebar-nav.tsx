
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
  SidebarSeparator,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAppContext } from "@/contexts/app-context";
import { BookCopy, Home, Settings, LogOut, BarChart3, ChevronDown, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import * as React from "react";

export function SidebarNav() {
  const pathname = usePathname();
  const { subjects, isLoaded, adminMode, setAdminMode } = useAppContext();
  const [isSubjectsOpen, setSubjectsOpen] = React.useState(true);
  const { state: sidebarState } = useSidebar();

  React.useEffect(() => {
    if (sidebarState === "collapsed") {
      setSubjectsOpen(false);
    }
  }, [sidebarState]);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === path;
    return pathname.startsWith(path);
  };
  
  const isSubjectsActive = isActive('/subjects');

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
              isActive={isActive("/attendance")}
              tooltip={{ children: "Attendance" }}
            >
              <Link href="/attendance">
                <BarChart3 />
                <span>Attendance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={() => setSubjectsOpen(!isSubjectsOpen)} 
                    className="justify-between"
                    isActive={isSubjectsActive && sidebarState === 'expanded'}
                    tooltip={{ children: "Subjects" }}
                >
                    <div className="flex items-center gap-2">
                        <BookCopy />
                        <span>Subjects</span>
                    </div>
                    <ChevronDown className={`transition-transform duration-200 ${isSubjectsOpen ? 'rotate-180' : ''}`} />
                </SidebarMenuButton>
                {isSubjectsOpen && sidebarState === 'expanded' && (
                    <SidebarMenuSub>
                        {isLoaded ? (
                            subjects.length > 0 ? (
                                subjects.map((subject) => (
                                <SidebarMenuItem key={subject.id}>
                                    <SidebarMenuSubButton asChild isActive={isActive(`/subjects/${subject.id}`)}>
                                        <Link href={`/subjects/${subject.id}`}>
                                            <span>{subject.name}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuItem>
                                ))
                            ) : (
                                <p className="px-2 text-xs text-muted-foreground">No subjects yet.</p>
                            )
                        ) : (
                            <>
                                <Skeleton className="h-7 w-full" />
                                <Skeleton className="h-7 w-full" />
                            </>
                        )}
                    </SidebarMenuSub>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
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
              isActive={isActive("/profile")}
              tooltip={{ children: "Profile" }}
            >
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
