"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'


  interface PhotoBarProps {
    numPhotos: number | 0;
    userId: string;
    photos: string[];
}

const PhotoBar = ({ numPhotos, userId, photos }: PhotoBarProps) => {
    
  return (
    <div className="flex flex-row justify-between items-center p-6 border rounded-xl w-full">
        <div className="flex flex-col gap-3">
            <div className='text-xl font-bold'>{numPhotos} Unlabeled Contacts Detected</div>
            <div className="text-sm">Use the Face Identifier tool to quickly name, tag, and organize your contacts</div>
        </div>
        <div>
        {numPhotos > 0 &&
          photos.map((photo, index) => (
            <Image
              key={index}
              src={photo.imageUrl}
              alt={`Unlabeled contact ${index + 1}`}
              width={50}
              height={50}
              className="rounded-full border"
            />
          ))
        }
        </div>
        <div>
        <Button asChild>
            <Link href="/login">Go to Face Identifier</Link>
        </Button>
        </div>
    </div>
  )
}

export default PhotoBar