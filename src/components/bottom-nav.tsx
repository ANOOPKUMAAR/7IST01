"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { navLinks, type NavLink } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { mode } = useAppContext();
  const pathname = usePathname();
  const links = mode ? navLinks[mode] : [];

  if (!mode || links.length === 0) {
    return null;
  }

  const numLinks = links.length;
  const gridColsClass = `grid-cols-${numLinks}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className={cn("grid h-16 items-center justify-center text-xs", `grid-cols-${numLinks}`)}>
        {links.map((link: NavLink) => {
          const isActive = pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors h-full",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
