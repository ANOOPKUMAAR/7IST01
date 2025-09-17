
import { HardHat } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
            <HardHat className="h-24 w-24 text-primary" />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Under Maintenance
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We are currently performing scheduled maintenance. The app will be back online shortly. We apologize for any inconvenience.
                </p>
            </div>
        </div>
    </div>
  );
}
