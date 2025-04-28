import React from "react";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
// Create a proper React component wrapper

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Ultraviolet Web Proxy",
    template: "%s | Ultraviolet Web Proxy"
  },
  description: "An advanced web unblocker using the Ultraviolet proxy system.",
  applicationName: "Ultraviolet Web Proxy",
  keywords: ["web proxy", "ultraviolet", "unblocker", "anonymous browsing", "privacy"],
  authors: [{
    name: "Ultraviolet Team"
  }],
  creator: "Ultraviolet Team",
  publisher: "Ultraviolet Team",
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    }, {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon"
    }],
    apple: [{
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Creatr"
  },
  formatDetection: {
    telephone: false
  }
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} data-unique-id="32897764-46af-47ea-b33b-4f6a9a9d7be4" data-loc="60:9-60:61" data-file-name="app/layout.tsx">
      <body data-unique-id="97aade60-5702-4442-9955-ecc768d73910" data-loc="61:6-61:12" data-file-name="app/layout.tsx">
        
        {children}
      </body>
    </html>;
}