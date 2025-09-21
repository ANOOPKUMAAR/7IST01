"use client";

import { cn } from "@/lib/utils";

export const Icons = {
  logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <g>
        <path d="M53.4,12.1H10.6c-3.2,0-5.8,2.6-5.8,5.8v28.2c0,3.2,2.6,5.8,5.8,5.8h42.7c3.2,0,5.8-2.6,5.8-5.8V17.9 C59.2,14.7,56.5,12.1,53.4,12.1z M56.2,46.1c0,1.5-1.2,2.8-2.8,2.8H10.6c-1.5,0-2.8-1.2-2.8-2.8V17.9c0-1.5,1.2-2.8,2.8-2.8h42.7 c1.5,0,2.8,1.2,2.8,2.8V46.1z" />
        <path d="M32,24.1l-11.3,9.5h7.6v8.4h7.5v-8.4h7.6L32,24.1z" />
      </g>
    </svg>
  ),
};
