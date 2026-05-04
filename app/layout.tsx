import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { SerwistProvider } from "./serwist";
import { safeJsonLd } from "../utils/safe-json";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const APP_NAME = "Ambia";
const APP_DEFAULT_TITLE = "Ambia | Immersive Procedural Noise Generator for Focus & Sleep";
const APP_TITLE_TEMPLATE = "%s - Ambia";
const APP_DESCRIPTION =
  "Discover Ambia, a minimalist procedural noise generator. Experience pure white, natural pink, and deep brown soundscapes to mask distractions, enhance focus, and improve your sleep and relaxation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ambia.meinard.dev"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/icon",
    apple: "/apple-icon",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    url: "/",
    locale: "en_US",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: "@znarfm",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: "https://ambia.meinard.dev",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    abstract: APP_DESCRIPTION,
  };

  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SerwistProvider swUrl="/serwist/sw.js">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
