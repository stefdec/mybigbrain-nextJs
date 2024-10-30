
import Link from "next/link"
import { auth, signIn, signOut } from '@auth'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"


const Topbar = async () => {
    const session = await auth()

    const hasNotifications = true;
    const numNotifications = 3;
    const userId = 2;
    const userName = session?.user?.name;
    let profilePicture = session?.user?.profilePic;

    if (profilePicture === null || profilePicture === undefined) {
        profilePicture = "/assets/users/profile.jpg";
    } 
    
    if (!profilePicture.startsWith("http")) {
        profilePicture = `/assets/users/${userId}/profile.png`;
    }
        

  return (
    <div className="flex flex-row justify-end p-3 pe-10 align-middle">
        <div className="flex flex-row items-center gap-4">
            <button className="relative">
                <img src="/assets/icons/notification-bell.svg" alt="bell" className="pe-5" />
                {hasNotifications && (
                    <span className="notification-badge">
                    {numNotifications}
                    </span>
                )}
            </button>
            <button className="flex items-center justify-center w-10 h-10">
                <img src={profilePicture} alt="bell" className=" rounded-full" />
            </button>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger className="!bg-slate-100 !text-[16px]">{userName}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[100px] lg:w-[150px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                        <NavigationMenuLink asChild>
                        <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                        >
                            <div className="mb-2 mt-4 text-lg font-medium">
                            shadcn/ui
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components built with Radix UI and
                            Tailwind CSS.
                            </p>
                        </a>
                        </NavigationMenuLink>
                    </li>
                    
                    </ul>
                    </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    </div>
  )
}

export default Topbar