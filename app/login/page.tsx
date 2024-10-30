
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { auth, signIn, signOut } from '@auth'
import { Import } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import {SignIn} from '@components/pub/sign-in'




const page = async() => {

  

  return (
    <main className='flex flex-col items-center justify-items-center p-24'>

      <SignIn />

      <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <button type="submit">Signin with Google</button>
      </form>
    </main>
    
      
    
  
  )
}

export default page