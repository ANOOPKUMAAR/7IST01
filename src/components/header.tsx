
"use client";

import { usePathname } from "next/navigation";
import { capitalize } from "@/lib/utils";
import { Icons } from "./icons";

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const title = segments.length > 0 ? capitalize(segments[segments.length - 1]) : "Dashboard";
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="flex items-center gap-2">
        <Icons.logo className="h-6 w-6 text-primary"/>
        <h1 className="text-lg font-semibold md:text-xl">{title.replace(/-/g, ' ')}</h1>
      </div>
    </header>
  );
}
