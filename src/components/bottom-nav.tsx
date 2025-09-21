"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, User, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/app-context";

const studentNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/attendance-visuals", label: "Visuals", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { mode } = useAppContext();

  // For now, only show nav for students
  if (mode !== 'student') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
      <div className={cn("grid items-center justify-items-center h-16")} style={{gridTemplateColumns: `repeat(${studentNavItems.length}, 1fr)`}}>
        {studentNavItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" || pathname.startsWith('/subjects') || pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
