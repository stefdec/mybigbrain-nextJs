import React from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from '@components/ui/button';

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
  is_user_linked: number;
};

const page = async () => {

  const provider_id = 1;

  const response = await fetch(`${process.env.NEXT_BASE_URL}/api/appProviders/listProvider/${provider_id}`, {
    method: 'GET',
    cache: 'no-cache',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch process list');
  }

  const providers: Provider[] = await response.json();

  return (
    <main className='p-8'>
      <div className="flex fleox-row w-full justify-between pb-5">
        <span className=' text-2xl'>Connect Apps</span>
        <Button variant="outline">Launch Data Pull</Button>
      </div>
      <div className='flex flex-col gap-5'>
        {providers.map((provider) =>
            provider.processes.map((process) => (
              <div className='flex flex-1 flex-row justify-between items-center gap-5'>
                <div className='flex flex-0'>
                  <img
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
                      checked={process.is_user_linked == 1 }
                     
                    />
                </div>
              </div>
            
            ))
          )}
      </div>
    </main>
  )
}

export default page