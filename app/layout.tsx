import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@components/pub/navbar";
import {SessionProvider} from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My Big Brain",
  description: "Your super cool assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-start w-screen h-screen  text-slate-900 flex-col align-start justify-start`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
