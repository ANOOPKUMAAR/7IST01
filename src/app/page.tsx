import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Icons.logo className="h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
          WiTrack
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
          Seamlessly track your class attendance.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
