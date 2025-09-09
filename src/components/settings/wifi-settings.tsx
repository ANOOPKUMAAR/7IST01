"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Trash } from "lucide-react";

type Inputs = {
  ssid: string;
};

export function WifiSettings() {
  const { wifiZones, addWifiZone, deleteWifiZone } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addWifiZone(data.ssid);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wi-Fi Zone Definition</CardTitle>
        <CardDescription>
          Define specific Wi-Fi networks (SSID) as attendance zones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            Automatic check-in/out based on Wi-Fi is not possible in web browsers due to security restrictions. This section is for record-keeping. Check-ins are a manual action.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex-grow space-y-2">
            <Label htmlFor="ssid" className="sr-only">SSID</Label>
            <Input id="ssid" placeholder="Enter Wi-Fi SSID (e.g., Campus-Guest)" {...register("ssid", { required: true })} />
            {errors.ssid && <p className="text-sm text-destructive">SSID is required.</p>}
          </div>
          <Button type="submit">Add Zone</Button>
        </form>
        <div className="space-y-2">
          {wifiZones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <p className="font-mono text-sm">{zone.ssid}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => deleteWifiZone(zone.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {wifiZones.length === 0 && <p className="text-center text-muted-foreground">No Wi-Fi zones defined.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
