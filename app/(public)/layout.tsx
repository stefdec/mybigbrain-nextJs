import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "../globals.css";
import Navbar from "@components/pub/navbar";
import {SessionProvider} from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

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
          className={`${inter.className} antialiased flex items-start w-screen h-screen  text-slate-900 flex-col align-middle justify-cen`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
