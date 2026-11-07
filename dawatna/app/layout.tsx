import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WedInvite.pk | Luxury Digital Wedding & Event Invitations in Pakistan',
  description: 'Pakistan’s premier digital wedding invitation platform. Living, bilingual wedding websites with interactive entrance gestures, private guest headcount RSVP, venue maps, and instant WhatsApp delivery.',
  icons: {
    icon: '/img/mark.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9F4EE] text-[#2B211D] antialiased">
        {children}
      </body>
    </html>
  );
}
