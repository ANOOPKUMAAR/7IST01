import { Home, BarChart3, Settings, User, GraduationCap, Briefcase, Building, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserMode } from './types';

export interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
}

export const studentNavLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/attendance-visuals", label: "Visuals", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/profile", label: "Profile", icon: User },
];

export const facultyNavLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/profile", label: "Profile", icon: Briefcase },
];

export const adminNavLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/schools", label: "Schools", icon: Building },
    { href: "/students", label: "Students", icon: GraduationCap },
    { href: "/profile", label: "Profile", icon: User },
];

export const navLinks: Record<UserMode, NavLink[]> = {
    student: studentNavLinks,
    faculty: facultyNavLinks,
    admin: adminNavLinks,
};
