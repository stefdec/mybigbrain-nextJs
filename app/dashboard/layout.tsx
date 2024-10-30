import Navbar from "@components/dashboard/Navbar";
import Topbar from "@components/dashboard/Topbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar" 
import {auth} from "@/auth";
import { signOut } from "@auth"

export default async function Layout({ children } : Readonly<{ children: React.ReactNode }>) {

    const session = await auth();
    console.log(session);

  return (
    <SidebarProvider>
    <div className="main-container">
        <div>
            <AppSidebar />
        </div>
        <div className="flex flex-col w-full min-h-screen bg-slate-100">
            <div className="top-bar flex-0">
                <Topbar />
            </div>
            <div className="flex flex-1  px-10 pb-10">
                <div className="bg-white rounded-xl flex-1">{children}</div>
            </div>
        </div>
    </div>
    </SidebarProvider>
  );
}