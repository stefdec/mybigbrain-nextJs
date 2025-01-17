import { getFaces } from '@lib/actions/contacts/get-faces';
import { getContacts } from '@lib/actions/contacts/get-contacts';
import Photobar from '@components/dashboard/contacts/photo-bar';
import { Contact } from '@/types/types';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge"
import { FaRegEdit } from "react-icons/fa";



const Contacts = async () => {
  const response = await getFaces();

  if (!response.ok) {
    throw new Error('Failed to fetch process list');
  }

  const { faces, numPhotos } = await response.json();

  const contactListJSON = await getContacts();
  const contactList = await contactListJSON.json();

  console.log("Contacts ", contactList);

  return (
    <main className='flex flex-col p-8 space-y-4 overflow-scroll'>

      { numPhotos > 0 &&
      <Photobar faces={faces} numPhotos={numPhotos} />
    }

      <span className='text-2xl'>All Contacts</span>

      <div className='flex flex-col gap-4'>
       {contactList.contacts.map((contact: Contact) => (
          <div className='flex flex-row gap-2 p-4 border-b justify-between items-center' key={contact.id}>
            <div className='flex flex-row items-center gap-2 w-56'>
              <div>
                <Image src={contact.picture} alt={contact.first_name} width={50} height={50} className='rounded-full' />
              </div>
              <div className='font-bold'>
                {contact.first_name} {contact.last_name}
              </div>
            </div>
            <div className='w-48'>
              <span>
                {!contact.email ||  contact.email.toLowerCase().includes("noemailprovided") ? "-" : contact.email}
              </span>
            </div>
            <div>
              <Badge className="bg-gray-400">Familyy</Badge>
            </div>
            <div>
              <button className='flex flex-row items-center'>
                <FaRegEdit className='w-5 h-5 opacity-50' />
              </button>
            </div>

          </div>
      ))}
    </div>

    </main>
  );
};

export default Contacts;
