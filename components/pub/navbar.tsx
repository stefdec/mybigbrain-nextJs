import { Button } from '@components/ui/button'
import Image from 'next/image'
import {auth} from "@/auth";
import { signOut } from "@auth"

import { UserButtonsNonLogged } from "@components/pub/user-buttons-non-logged";
//import { UserButtonsLogged } from "@components/pub/user-buttons-logged";

const Navbar = async () => {

  const session = await auth();
  //const userName = session?.user?.name;
  const userId = session?.user?.id;
  let profilePicture = session?.user?.profilePic;
  if (profilePicture === null || profilePicture === undefined) {
    profilePicture = "/assets/users/profile.jpg";
  } 

  if (!profilePicture.startsWith("http")) {
      profilePicture = `/assets/users/${userId}/profile.png`;
  }

  return (
    <nav className="grid grid-cols-12 gap-4 w-full h-16 px-8 pt-2">
      <div className='col-span-3'>
        <Image src={'/assets/logo/mybigbrain-logo-only.svg'} width={50} height={50} alt='My Big Brain AI logo' />
      </div>
      <div className='col-span-6  flex flex-1 items-center justify-center'>
        <ul className='flex flex-row gap-6 text-center'>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Features</a></li>
            <li><a href="#contact">Pricing</a></li>
            <li><a href="#contact">Reviews</a></li>
            <li><a href="#contact">FAQ</a></li>
        </ul>
      </div>
      
      
      { session ? (
      <div className="col-span-3 flex items-end justify-end gap-5">
        <Image src={profilePicture} width={50} height={50} alt="bell" className=" rounded-full w-10 h-10" />
        <Button variant="outline">
          <a href="/chatbot">Dashboard</a>
        </Button>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <Button type="submit">Sign out</Button>
        </form>
      </div>
      ) :( 
        <UserButtonsNonLogged  />
      )}
      
    </nav>
  )
}

export default Navbar