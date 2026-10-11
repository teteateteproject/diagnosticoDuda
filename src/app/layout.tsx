import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CONFIG } from "@/lib/config";
import "./globals.css";

/**
 * Plus Jakarta Sans (variável, 200–800) self-hosted — SIL OFL 1.1 (src/fonts/LICENSE-OFL.txt).
 * Sem request pro Google Fonts: mais rápido e sem dependência externa.
 */
const jakarta = localFont({
  src: [
    { path: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/plus-jakarta-sans-latin-wght-italic.woff2", style: "italic", weight: "200 800" },
    { path: "../fonts/plus-jakarta-sans-latin-ext-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/plus-jakarta-sans-latin-ext-wght-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: `${CONFIG.siteName} — Maturidade em IA para agências de viagens`,
    template: `%s · ${CONFIG.siteName}`,
  },
  description: CONFIG.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: CONFIG.siteName,
    title: `${CONFIG.siteName} — Maturidade em IA para agências de viagens`,
    description: CONFIG.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
