"use client";

import { usePathname } from "next/navigation";
import { capitalize } from "@/lib/utils";
import { Icons } from "./icons";
import { useAppContext } from "@/contexts/app-context";
import { SidebarTrigger } from "./sidebar";

export function Header() {
  const pathname = usePathname();
  const { subjects, mode } = useAppContext();
  const segments = pathname.split("/").filter(Boolean);
  
  let title;

  if (segments[0] === 'subjects' && segments[1]) {
    const subject = subjects.find(s => s.id === segments[1]);
    title = subject ? subject.name : "Subject Details";
  } else if (segments[0] === 'dashboard') {
     title = mode === 'student' ? 'Student Dashboard' : mode === 'faculty' ? 'Faculty Dashboard' : 'Admin Dashboard';
  } else {
    title = segments.length > 0 ? capitalize(segments[segments.length - 1].replace(/-/g, ' ')) : "Dashboard";
  }
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
       <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Icons.logo className="h-6 w-6 text-primary hidden md:block"/>
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
    </header>
  );
}
