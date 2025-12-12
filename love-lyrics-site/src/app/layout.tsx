import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Love Lyrics Atlas",
  description:
    "Explore a hand-curated collection of romantic lyrics across languages and eras. Search by mood, uncover hidden verses, and fall in love with words all over again.",
  openGraph: {
    title: "Love Lyrics Atlas",
    description:
      "Discover dreamy verses, passionate ballads, and timeless serenades in one beautifully curated library.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-rose-50 antialiased text-rose-950`}
      >
        {children}
      </body>
    </html>
  );
}
