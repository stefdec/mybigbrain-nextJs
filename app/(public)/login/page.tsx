//import { login } from "@/action/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/actions/users";


const Login = async () => {
  const session = await auth();
  const user = session?.user;
  if (user) redirect("/chatbot");

  return (
    <div className="mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white border border-[#7D50FF]  dark:bg-black">
      <form
          action={async (formData) => {
            "use server"
            const tt = await login(formData)
            console.log("PRINT xxxxxformData", tt);
            if (tt) redirect(tt)
          }}
        >
        <input type="hidden" name="redirectTo" value="/chatbot" />
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          placeholder="Your email address"
          type="email"
          name="email"
        />

        <Label htmlFor="email">Password</Label>
        <Input
          id="password"
          placeholder="*************"
          type="password"
          name="password"
          className="mb-6"
        />

        <button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] shadow-[-10px_0_15px_3px_rgba(107,217,251,0.3),0_0_15px_3px_rgba(99,145,255,0.3),10px_0_15px_3px_rgba(125,80,255,0.3)]">
          Login &rarr;
        </button>


        <p className="text-right text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
          Don't have account? <Link href="/register">Register</Link>
        </p>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/chatbot" })
          }}
        >
        <button
          className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#f2f2f2] dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
        >
          <Image src="/assets/logo/google_signin-sq.png" alt="Google" width="173" height="40" />
        </button>
      </form>
      
    </div>
  );
};

export default Login;