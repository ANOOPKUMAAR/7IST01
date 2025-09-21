"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, BookUser, ShieldCheck, Nfc, Camera } from "lucide-react";
import { SubjectsSettings } from "@/components/settings/subjects-settings";
import { WifiSettings } from "@/components/settings/wifi-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { NfcSettings } from "@/components/settings/nfc-settings";
import { CameraSettings } from "@/components/settings/camera-settings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your subjects, app settings, and security.
        </p>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subjects">
            <BookUser className="mr-2 h-4 w-4" /> Subjects
          </TabsTrigger>
          <TabsTrigger value="wifi">
            <Wifi className="mr-2 h-4 w-4" /> Wi-Fi Zones
          </TabsTrigger>
           <TabsTrigger value="nfc">
            <Nfc className="mr-2 h-4 w-4" /> NFC
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2 h-4 w-4" /> Camera
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-4">
          <SubjectsSettings />
        </TabsContent>

        <TabsContent value="wifi" className="mt-4">
          <WifiSettings />
        </TabsContent>

        <TabsContent value="nfc" className="mt-4">
          <NfcSettings />
        </TabsContent>

        <TabsContent value="camera" className="mt-4">
          <CameraSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
