import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { PWARegistration } from "../components/pwa-registration";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ambia | Sensory Soundscapes",
  description: "Immersive procedural white, pink, and brown noise for focus, sleep, and relaxation.",
  keywords: ["white noise", "pink noise", "brown noise", "focus", "sleep", "ambient", "sensory"],
  authors: [{ name: "Ambia Team" }],
  openGraph: {
    title: "Ambia | Sensory Soundscapes",
    description: "Your procedural sanctuary for focus and rest.",
    type: "website",
  },
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
    <html lang="en" className={`${manrope.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <PWARegistration />
      </body>
    </html>
  );
}
