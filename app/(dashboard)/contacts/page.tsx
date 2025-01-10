import { getFaces } from '@lib/actions/contacts/get-faces';
import Image from 'next/image';
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { HiOutlineMail } from "react-icons/hi";
import { CiPhone } from "react-icons/ci";
import { HiOutlineTag } from "react-icons/hi2";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"


type Faces = {
  id: number;
  media_id: string;
  image_path: string;
};

const contacts = async () => {
  //const numPhotos = 5
  const response = await getFaces()
  
  if (!response.ok) {
    throw new Error('Failed to fetch process list');
  }

  const { faces, numPhotos } = await response.json();
  //const faces: Faces[] = await response.json();

  console.log('API Response:', faces); 
  return (
    <main className='p-8'>

      <div className="flex flex-row justify-between items-center p-6 border rounded-xl w-full">
        <div className="flex flex-col gap-3">
            <div className='text-xl font-bold'>{numPhotos} Unlabeled Contacts Detected</div>
            <div className="text-sm">Use the Face Identifier tool to quickly name, tag, and organize your contacts</div>
        </div>
        <div className='flex flex-row items-center'>
        {numPhotos > 0 &&
              faces.slice(0, 3).map((photo: Faces, index: number) => (
              <Image
          key={index}
          src={photo.image_path}
          alt={`Unlabeled contact ${index + 1}`}
          width={50}
          height={50}
          className="rounded-full border"
              />
              ))
            }
        {numPhotos > 3 && (
          <div className="ps-2 text-sm text-gray-500">
            +{numPhotos - 3} more
          </div>
        )}
        </div>
        <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Go to Face Identifier</Button>
          </DialogTrigger>
          <DialogContent
            className='w-2/6 h-3/4 overflow-scroll'
          >
            <DialogHeader>
              <DialogTitle>Face Identifier</DialogTitle>
              <DialogDescription>
                Click a photo to add a name
              </DialogDescription>
            </DialogHeader>
            <div
              className='
                visible'
            >
              <div className='flex flex-row gap-x-4'>
                <div>
                <Image 
                  src="https://bb-faces-test-b.s3.us-east-1.amazonaws.com/google_photos_106117210796623775541/rekognition/25414e35-9d4d-4edd-a24d-c157bec29f80.jpg"
                  alt={`Unlabeled contact`} 
                  width={248} 
                  height={248} 
                  className="rounded-xl border" />
                </div>
                <div className='flex flex-col gap-4 justify-between'>
                  <div className='border-s-2 border-black ps-2 font-bold text-[20px]'>Who&apos;s this?</div>
                  <div className='flex flex-row items-center gap-2 pb-4 border-b-2'>
                    <HiOutlineMail
                      className='text-gray-400 w-[18px] h-[18px]'

                    />
                    <input type="email" className=" border-gray-300 rounded-md w-full" placeholder="Add email" />
                  </div>
                  <div className='flex flex-row items-center gap-2 pb-4 border-b-2'>
                    <CiPhone
                      className='text-gray-400 w-[18px] h-[18px]'

                    />
                    <input type="email" className=" border-gray-300 rounded-md w-full" placeholder="Add phone" />
                  </div>
                  <div className='flex flex-row items-center gap-2 pb-4 border-b-2'>
                    <HiOutlineTag
                      className='text-gray-400 w-[18px] h-[18px]'

                    />
                    <input type="email" className=" border-gray-300 rounded-md w-full" placeholder="Assign tag" />
                  </div>
                  <div className='flex-flex-row justify-between border'>
                    <Badge variant="destructive">Destructive</Badge>
                    <Link
                      href='/'
                      className='text-blue-400'
                    >dfff</Link>
                  </div>
                </div>
              </div>
              <div>other pictures</div>
            </div>
            <div className='flex flex-row gap-3 flex-wrap items-center justify-center'>
            {faces.slice(0, 12).map((photo: Faces, index: number) => (
              <Image 
                key={index} 
                src={photo.image_path} 
                alt={`Unlabeled contact ${index + 1}`} 
                width={124} 
                height={124} 
                className="rounded-xl border" />
            ))}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
      <div>CONTACTS</div>
    </main>

  )
}

export default contacts