
"use client"
//import { Button } from "@components/ui/button";
//import { useRouter } from 'next/navigation';

export default function Home() {
    //const router = useRouter();
    //router.push('/login');

  return (
    <div className='w-screen flex flex-col flex-1 justify-center items-center h-full gap-10 px-40'>
      
      <div className="gradient-border-mask w-72 p-3 text-center">
        <p>New AI face recognition</p>
      </div>
      <div className="flex flex-col text-center gap-4">
        <p className="text-6xl font-black">
          Unlock Your <br />
          Photographic Memory <br />
          with&nbsp;
          <span className="italic bg-gradient-to-r from-[#6bd9fb] via-[#6391ff] to-[#7d50ff] bg-clip-text text-transparent pe-1">
          My Big Brain  
          </span> 
        </p>
        <p>
        Effortlessly sync your apps and let My Big Brain’s AI organise, retrieve, and deliver everything you need—when you need it. From conversations to documents, contacts to calendars, <br /> My Big Brain remembers it all.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <button className="bg-slate-900 text-white p-2 rounded-lg w-40 button-shadow">Get Started</button>
        <button className="border-2 border-slate-900 text-slate-900 p-2 rounded-lg w-40">Learn More</button>
      </div>
    </div>
  );
}
