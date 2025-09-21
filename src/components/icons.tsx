"use client";

import { cn } from "@/lib/utils";

export const Icons = {
  logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M4.27 10.73A12.5 12.5 0 0 1 12 4.5a12.5 12.5 0 0 1 7.73 6.23L12 14Z" />
      <path d="M12 15.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
      <path d="M19.07 12.94a8.5 8.5 0 0 0-14.14 0" />
      <path d="M16.24 15.76a4.5 4.5 0 0 0-8.48 0" />
      <path d="M22 10v2.36a.64.64 0 0 1-1.2.4L18 11l-6 3.5-6-3.5-2.8 1.76a.64.64 0 0 1-1.2-.4V10l10-5Z" />
      <path d="M17.5 10.5V14l.5.5.5-.5V11" />
    </svg>
  ),
};