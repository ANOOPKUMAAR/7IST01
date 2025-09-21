"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar as SidebarPrimitive,
  SidebarTrigger as SidebarTriggerPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarBrand,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/contexts/app-context";
import { navLinks, type NavLink } from "@/lib/nav-links";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";

function MainSidebar({ side }: { side: "left" | "right" }) {
  const { mode, userDetails, logout } = useAppContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  
  const links = mode ? navLinks[mode] : [];

  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  return (
    <SidebarPrimitive collapsible="icon" side={side}>
      <SidebarHeader>
        <SidebarBrand>
          <Icons.logo />
          <span className="font-bold">NetAttend</span>
        </SidebarBrand>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link: NavLink) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard");
            return (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} onClick={handleLinkClick}>
                  <SidebarMenuButton isActive={isActive} tooltip={{content: link.label, side: side === 'left' ? 'right' : 'left'}}>
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="mb-2" />
        <div className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-10 w-10">
                <AvatarImage src={userDetails.avatar} />
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm overflow-hidden transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                <p className="font-semibold truncate">{userDetails.name}</p>
                <p className="text-muted-foreground capitalize truncate">{mode}</p>
            </div>
        </div>
        <Button variant="ghost" className="justify-start gap-2" onClick={logout}>
            <LogOut />
            <span className="transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">Logout</span>
        </Button>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

export function SidebarTrigger() {
    const isMobile = useIsMobile();
    if(isMobile) return null;
    return <SidebarTriggerPrimitive className="hidden" />;
}

export function MainLayout({children}: {children: ReactNode}) {
    return <>{children}</>;
}
