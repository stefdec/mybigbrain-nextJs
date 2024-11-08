import "../globals.css";
import type { Metadata } from "next";
import Topbar from "@components/dashboard/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar" 
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import {Inter} from "next/font/google"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Big Brain",
  description: "Your super cool assistant",
};

export default async function Layout({ children } : Readonly<{ children: React.ReactNode }>) {

    const session = await auth();
    console.log(session);

  return (
    <SessionProvider>
    <html lang="en">
        <body
            className={`${inter.className} antialiased flex items-start w-screen h-screen  text-slate-900 flex-col align-start justify-start`}
        >
        <SidebarProvider>
        <div className="main-container">
            <div>
                <AppSidebar />
            </div>
            <div className="flex flex-col w-full min-h-screen bg-slate-100">
                <div className="top-bar flex-0">
                    <Topbar 
                    numNotifications={1}
                    hasNotifications={true}
                    userName={session?.user?.name ?? "Guest"}
                    profilePicture={session?.user?.image ?? "/assets/users/profile.png"}
                    userId={session?.user?.id ?? '0'}
                    />
                </div>
                <div className="flex flex-1  px-10 pb-10">
                    <div className="bg-white rounded-xl flex-1">{children}</div>
                </div>
            </div>
        </div>
        </SidebarProvider>
        </body>
      </html>
    </SessionProvider>
  );
}