import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brightloop — Subscription & Billing Management Platform",
    template: "%s | Brightloop Billing",
  },
  description:
    "Indian enterprise subscription lifecycle management, recurring billing engine, GST e-invoicing, receivables aging, and self-serve customer portal.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Brightloop — Subscription & Billing Platform",
    description: "Automated recurring billing, GST tax invoices, and contract lifecycles.",
    siteName: "Brightloop",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body className="bg-surface text-on-surface antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
