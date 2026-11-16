import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
import "./atelier.css";
import "./journey.css";
import "./orders.css";

export const metadata: Metadata = {
  title:
    "WedInvite.pk | Luxury Digital Wedding & Event Invitations in Pakistan",
  description:
    "Beautiful digital wedding invitations, personally created by WedInvite’s studio in Pakistan. Explore ten interactive designs, discover your favourite, and start your invitation on WhatsApp.",
  icons: {
    icon: "/wedinvite-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/outfit-normal-300-600-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/playfair-display-normal-500-700-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9F4EE] text-[#2B211D] antialiased">
        {children}
      </body>
    </html>
  );
}
