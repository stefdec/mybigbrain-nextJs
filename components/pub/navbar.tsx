import { Button } from '@components/ui/button'
import {auth} from "@/auth";
import { signOut } from "@auth"

const Navbar = async () => {

  const session = await auth();
  console.log(session);

  return (
    <header className="flex items-center justify-between w-full h-16 px-4 bg-slate-100">
      public nav bar logo
      {session ? (
        <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out....</button>
      </form>
      ) :( 
        <Button>Sign In</Button>
      )}
      
    </header>
  )
}

export default Navbar