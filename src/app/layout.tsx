import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Audiowide } from "next/font/google";
import Script from 'next/script'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdelhamid Ezzerg website",
  description: "Personal academic website of Abdelhamid Ezzerg",
  icons: {
    icon: '/ae_logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://unpkg.com/typewriter-effect@latest/dist/core.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${audiowide.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
