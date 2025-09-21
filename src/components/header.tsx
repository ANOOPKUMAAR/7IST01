"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "./icons";
import { useAppContext } from "@/contexts/app-context";
import { navLinks, type NavLink } from "@/lib/nav-links";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function MainNav({ links, onLinkClick }: { links: NavLink[], onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ links }: { links: NavLink[] }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setOpen(false)}
                >
                    <Icons.logo className="h-6 w-6" />
                    <span className="sr-only">NetAttend</span>
                </Link>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
    )
}

function UserMenu() {
    const { userDetails, logout, mode } = useAppContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src={userDetails.avatar} />
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userDetails.name}</p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">{mode}</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export function Header() {
    const { mode } = useAppContext();
    const links = mode ? navLinks[mode] : [];

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="">NetAttend</span>
            </Link>
            <div className="hidden md:flex flex-1 items-center gap-4">
                <div className="w-full flex-1">
                     <div className="ml-12">
                        <MainNav links={links} />
                     </div>
                </div>
            </div>
            <div className="flex md:hidden flex-1 justify-end">
                <UserMenu />
            </div>
            <div className="hidden md:block">
                 <UserMenu />
            </div>

            <MobileNav links={links} />
      </header>
    );
}
