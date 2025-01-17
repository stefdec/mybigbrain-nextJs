"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button'

import { FiUsers } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { LiaUserTagSolid } from "react-icons/lia";


import { saveContact, deleteFace } from "@/lib/actions/contacts/face-identifier";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


type Faces = {
    id: number;
    media_id: string;
    image_path: string;
  };
  
  type Props = {
    faces: Faces[];
    numPhotos: number;
  };


const Photobar: React.FC<Props> = ({ faces, numPhotos }) => {
    const router = useRouter();
    const [selectedFace, setSelectedFace] = useState<Faces | null>(faces[0]||null);
    const [status, setStatus] = useState<string | null>(null);

    console.log(status)

    useEffect(() => {
        if (!selectedFace && faces.length > 0) {
          setSelectedFace(faces[0]);
        }
      }, [faces, selectedFace]);

    const handleSubmit =async (formData: FormData) => {
        const result = await saveContact(formData);

        if (result.success) {
          setStatus("Contact saved successfully!");
          router.refresh();
          setSelectedFace(null);
        } else {
          setStatus("Failed to save contact");
        }
    }

    const handleDeleteFace = async (id:number) => {
      const result = await deleteFace(id);
      if (result.success) {
        setStatus("Face deleted successfully!");
        router.refresh();
      }
    }

  return (
    <div className='w-full rounded-xl bg-gradient-to-r from-[#6BD9FB] via-[#6391FF] to-[#7D50FF] p-[1px]'>
      <div className="flex flex-row justify-between items-center p-6 border rounded-xl w-full bg-gradient-to-r from-blue-100 via-sky-100 to-purple-100">
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
                className={`h-50 w-50 rounded-full border-1 border-gray-600 ${index !== 0 ? '-ml-3' : ''}`}
              />
            ))
          }
          {numPhotos > 3 && (
            <div className="h-[50px] w-[50px] rounded-full border-1 border-gray-600 -ml-3 bg-white text-lg text-gray-500 flex items-center justify-center text-center font-extrabold">
              +{numPhotos - 3}
            </div>
          )}
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Face Identifier</Button>
            </DialogTrigger>
            <DialogContent
              className='w-2/6 h-3/4 overflow-hidden'
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
              { selectedFace && (
              <div className='flex flex-row gap-x-4 justify-stretch items-stretch '>
                <div className="flex items-stretch">
                  <Image 
                    src={selectedFace.image_path}
                    alt={`Unlabeled contact`} 
                    width={230} 
                    height={230} 
                    className="rounded-xl border object-cover h-full"
                  />
                </div>
                
                <form action={handleSubmit} className="flex flex-col justify-between">
                  <input type="hidden" name="pictureId" value={selectedFace.id} />
                  
                  <div className='flex flex-col gap-1 justify-between h-[100%]'>
                    <div className='border-s-2 border-black ps-2 font-bold text-[20px]'>Who&apos;s this?</div>
                    
                    <div className='flex flex-row items-center gap-2 pb-4 border-b-2'>
                      <FaRegUser className='text-gray-400 w-[18px] h-[18px]' />
                      <input 
                        type="text" 
                        name="firstName" 
                        className="border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent p-1" 
                        placeholder="First name" 
                      />
                    </div>
                    
                    <div className='flex flex-row items-center gap-2 pb-4 border-b-2'>
                      <FiUsers className='text-gray-400 w-[18px] h-[18px]' />
                      <input 
                        type="text" 
                        name="lastName" 
                        className="border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent p-1" 
                        placeholder="Last Name" 
                      />
                    </div>

                    <div className='flex flex-row items-center gap-2 pb-4 '>
                      <LiaUserTagSolid className='text-gray-400 w-[18px] h-[18px]' />
                      <input 
                        type="text" 
                        name="nickName" 
                        className="border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent p-1" 
                        placeholder="Nickname" 
                      />
                    </div>
                    
                    <div className='flex justify-between p-0 m-0'>
                      <Button size="sm" className='w-full'>Save</Button>
                    </div>
                  </div>
                </form>
              </div>
              
              )}
              </div>

              <div className="grid grid-cols-4 gap-3 overflow-scroll">
                {faces.map((photo: Faces, index: number) => (
                  <div key={index} className="relative group">
                    <Image 
                      src={photo.image_path} 
                      alt={`Unlabeled contact ${index + 1}`} 
                      width={124} 
                      height={124} 
                      className={`rounded-xl border w-full cursor-pointer ${selectedFace?.id === photo.id ? 'border-[#6391FF] border-4' : 'border-gray-300'}`}
                      onClick={() => setSelectedFace(photo)}
                    />
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                      onClick={() => handleDeleteFace(photo.id)}
                    >
                      <FaTimes />
                    </div>
                  </div>
                ))}
              </div>

              
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>
  )
}

export default Photobar