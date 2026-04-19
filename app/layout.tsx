import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { PWARegistration } from "./pwa-registration";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ambia",
  description: "Ambient Soundscapes.",
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PWARegistration />
      </body>
    </html>
  );
}
