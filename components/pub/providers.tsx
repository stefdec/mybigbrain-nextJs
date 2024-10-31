import { signIn } from "@auth"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Button } from "@components/ui/button"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
 
export function Providers() {
  return (

      <Card className="w-[350px]">
        <CardHeader className="text-center">OR</CardHeader>
       
        <CardContent className="text-center">
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/chatbot" })
          }}
        >
          <button type="submit">
            <Image src="/assets/logo/google_signin.png" alt="Google" width="173" height="40" />
          </button>
      </form>
        </CardContent>
        
      </Card>

  )
}