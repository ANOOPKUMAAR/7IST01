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
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M211.4,118.6,136.2,148.4a16.2,16.2,0,0,1-16.4,0L44.6,118.6,120,70.2a15.9,15.9,0,0,1,16,0ZM128,168a16,16,0,1,0-16,16,16,16,0,0,0,16-16Zm56.2-19.8a80,80,0,0,0-112.4,0,16,16,0,1,0,22.6,22.6,48,48,0,0,1,67.2,0,16,16,0,0,0,22.6-22.6Zm45.2-22.8a144,144,0,0,0-202.8,0,16,16,0,0,0,22.6,22.6,112,112,0,0,1,157.6,0,16,16,0,0,0,22.6-22.6Z" /></svg>`;
  const iconDataUrl = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={iconDataUrl} />
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
