
"use client";

import { useAppContext } from "@/contexts/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AppSettings() {
  const { maintenanceMode, setMaintenanceMode } = useAppContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Manage global application settings like maintenance mode.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <Label htmlFor="maintenance-mode" className="font-semibold">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                    If enabled, the app will be inaccessible to all users.
                </p>
            </div>
            <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
            />
        </div>
      </CardContent>
    </Card>
  );
}
