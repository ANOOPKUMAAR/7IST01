
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarBrand,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAppContext } from "@/contexts/app-context";
import { BookCopy, Home, Settings, BarChart3, ChevronDown, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function SidebarNav() {
  const pathname = usePathname();
  const { subjects, isLoaded } = useAppContext();
  const [isSubjectsOpen, setSubjectsOpen] = React.useState(true);
  const { state: sidebarState } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (sidebarState === "collapsed") {
      setSubjectsOpen(false);
    }
  }, [sidebarState]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };
  
  const isSubjectsActive = pathname.startsWith('/subjects');

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarBrand>
          <Icons.logo />
          <span className="text-lg font-bold">WiTrack</span>
        </SidebarBrand>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              tooltip={{ children: "Dashboard" }}
            >
              <Link href="/">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/attendance-visuals")}
              tooltip={{ children: "Attendance" }}
            >
              <Link href="/attendance-visuals">
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
