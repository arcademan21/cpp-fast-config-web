import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cpp Fast Config",
  description:
    "Toolkit moderno para bootstrap, scaffolding y flujo CLI en C++.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "64x64" },
      { url: "/logo.svg", type: "image/svg+xml", sizes: "600x200" },
      { url: "/logo-only.png", type: "image/png", sizes: "669x373" },
      { url: "/favicon.svg" },
    ],
    shortcut: ["/icon.svg", "/logo.svg", "/logo-only.png"],
    apple: [{ url: "/logo-only.png" }],
  },
  openGraph: {
    title: "Cpp Fast Config",
    description:
      "Toolkit moderno para bootstrap, scaffolding y flujo CLI en C++.",
    images: [
      {
        url: "/logo-bg.png",
        width: 2816,
        height: 1536,
        alt: "Cpp Fast Config",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cpp Fast Config",
    description:
      "Toolkit moderno para bootstrap, scaffolding y flujo CLI en C++.",
    images: ["/logo-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
