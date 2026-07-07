import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from './providers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Backyard Brew Cafe | Powered by CafeOS",
  description:
    "A premium cafe website foundation for CafeOS, ready for reservations, QR menus, analytics, and operations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
