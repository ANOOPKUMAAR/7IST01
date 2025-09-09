
import { Icons } from "@/components/icons";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
       <div className="absolute top-8 flex items-center gap-2 text-lg font-semibold">
          <Icons.logo />
          <span>WiTrack</span>
        </div>
      <div className="w-full max-w-sm p-4">
        {children}
      </div>
    </div>
  );
}
