import { FaRegUserCircle } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@components/ui/button";


export const UserButtonsNonLogged = () => {
  return (
    <div className="col-span-3 flex flex-row flex-1 gap-5 items-center justify-end">
      <FaRegUserCircle className="pe-2 w-7 h-7" />
      <Link
        href="/login"
      >
        Sign in
      </Link>
        <Button 
            className="bg-slate-900 text-white text-sm p-1 w-32 h-8 rounded-lg button-shadow">
                <Link href="/register">Get Started</Link>
            </Button>
    </div>
  );
};