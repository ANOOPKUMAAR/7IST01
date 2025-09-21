import type { ReactNode } from "react";
import { AppProvider } from "@/contexts/app-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AppContent } from "./app-content";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>NetAttend</title>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AppProvider>
            <AppContent>
                {children}
            </AppContent>
            <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
