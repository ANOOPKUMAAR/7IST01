import { cn } from "@/lib/utils";
import { Wifi } from "lucide-react";

export const Icons = {
  logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Wifi className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold">WiTrack</span>
    </div>
  ),
};
