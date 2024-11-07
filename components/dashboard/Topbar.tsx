
import { auth } from '@auth'
import Image from 'next/image'
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"


const Topbar = async () => {
    const session = await auth()

    const hasNotifications = true;
    const numNotifications = 3;
    const userName = session?.user?.name;
    let profilePicture = session?.user?.profilePic as string | undefined;
    const userId = session?.user?.id

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
                <Image src="/assets/icons/notification-bell.svg" width={40} height={40} alt="bell" className="pe-5" />
                {hasNotifications && (
                    <span className="notification-badge">
                    {numNotifications}
                    </span>
                )}
            </button>
            <button className="flex items-center justify-center w-10 h-10">
                <Image src={profilePicture}  width={50} height={50} alt={`${userName}'s profile picture`} className=" rounded-full" />
            </button>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <NavigationMenuTrigger className="!bg-slate-100 !text-[16px]">{userName}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[100px] lg:w-[150px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                        <NavigationMenuLink asChild>
                        <Link href="/" 
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        
                            <div className="mb-2 mt-4 text-lg font-medium">
                            shadcn/ui
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components built with Radix UI and
                            Tailwind CSS.
                            </p>
                        </Link>
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