
import React from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from '@components/ui/button';
import { getProcesses, pullData } from "@lib/actions/apis/api-processes"
import {getTokens} from "@lib/actions/tokens/get-tokens"
import { redirect } from 'next/navigation'
import Image from 'next/image';

type Provider = {
  provider_id: number;
  provider_name: string;
  provider_logo: string;
  processes: Process[];
};

type Process = {
  process_id: number;
  process_name: string;
  process_description: string;
  process_logo: string;
  process_scope: string;
  is_user_linked: number;
};

const page = async () => {
  const provider_id = 1;

  const response = await getProcesses(provider_id.toString())
  
  if (!response.ok) {
    throw new Error('Failed to fetch process list');
  }

  const providers: Provider[] = await response.json();

  return (
    <main className='p-8'>
      <form action={async () => {
            "use server"
            await getTokens()
          }
        }
      >
        <Button type='submit'>click</Button>
      </form>
      <form action={async (formData: FormData) => {
            "use server"
            const url = await pullData(formData)
            redirect(url)
          }}
        >
        <input type="hidden" name='providerId' value={provider_id} />
        <div className="flex fleox-row w-full justify-between pb-5">
          <span className=' text-2xl'>Connect Apps</span>

            <Button variant="outline" type='submit'>Launch Data Pull</Button>
          
        </div>
        <div className='flex flex-col gap-5'>
          {providers.map((provider) =>
              provider.processes.map((process) => (
                <div className='flex flex-1 flex-row justify-between items-center gap-5' key={process.process_id}>
                  <div className='flex flex-0'>
                    <Image
                      width={56}
                      height={56}
                      src={`/assets/icons/apis/${process.process_logo}.svg`}
                      alt={process.process_name}
                      className="width-[56px] height-[56px]"
                    />
                  </div>
                  
                  <div className='flex flex-col flex-1'>
                    <div className='font-bold'>{process.process_name}</div>
                    <div className='text-sm'>{process.process_description}</div>
                    
                    
                  </div>
                  <div className='flex'>
                    <Switch
                        id={`process-${process.process_id}`}
                        name='process'
                        value={process.process_scope}
                      />
                  </div>
                </div>
              
              ))
            )}
        </div>
      </form>
    </main>
  )
}

export default page