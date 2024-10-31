import { Button } from '@components/ui/button'
import Image from 'next/image'
import {auth} from "@/auth";
import { signOut } from "@auth"

const Navbar = async () => {

  const session = await auth();
  const userName = session?.user?.name;
  const userId = session?.user?.id;
  let profilePicture = session?.user?.profilePic;
  if (profilePicture === null || profilePicture === undefined) {
    profilePicture = "/assets/users/profile.jpg";
  } 

  if (!profilePicture.startsWith("http")) {
      profilePicture = `/assets/users/${userId}/profile.png`;
  }

  return (
    <header className="flex items-center justify-between w-full h-16 px-8 bg-slate-100">
      <Image src={'/assets/logo/mybigbrain-logo-only.svg'} width={50} height={50} alt='My Big Brain AI logo' />
      { session ? (
      <div className="flex gap-4">
        <img src={profilePicture} alt="bell" className=" rounded-full w-10 h-10" />
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
        <Button>
          <a href="/login">Sign in</a>
        </Button>
      )}
      
    </header>
  )
}

export default Navbar