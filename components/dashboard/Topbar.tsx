
import { auth } from '@auth'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import {Button} from '@components/ui/button'
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
                        <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                        >
                        <Button type="submit">Sign out</Button>
                        </form>
  
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