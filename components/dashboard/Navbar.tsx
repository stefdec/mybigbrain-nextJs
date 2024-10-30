"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // Utility for conditionally joining classNames

const Navbar = () => {

  const currenPath = usePathname();
    // Function to determine if link is active
  const isActive = (path: string): boolean => currenPath === path;

 

  return (
    <div className='flex flex-col min-h-screen p-5'>
      <div className="flex items-center justify-between flex-row pb-10">
        <Link href='/'>
          <Image src='/assets/logo/my_big_brain_logo.png' alt='logo' width={150} height={26} />
        </Link>
        <button>
          <Image src='/assets/icons/menu_opened.svg' alt='menu' width={22} height={22} />
        </button>
      </div>

      <div className='flex-1 ps-1'>
        <div className={clsx(' my-3', 'navbar_border', { 'navbar_border-gradient': isActive('/chatbot') })}>
          <Link href='/chatbot' className='navbar_item'>
            <Image src='/assets/icons/chat.svg' alt='' width={22} height={22} />
            <span>AI Chatbot</span> 
          </Link>
        </div>
        <div className={clsx(' my-3', 'navbar_border', { 'navbar_border-gradient': isActive('/apps') })}>
          <Link href='/apps' className='navbar_item'>
            <Image src='/assets/icons/apps.svg' alt='' width={22} height={22} /> 
            <span>Apps & Integrations</span>
          </Link>
        </div>
        <div className={clsx(' my-3', 'navbar_border', { 'navbar_border-gradient': isActive('/contacts') })}>
          <Link href='/contacts' className='navbar_item'>
            <Image src='/assets/icons/people.svg' alt='' width={22} height={22} /> 
            <span>People & Contacts</span>
          </Link>
        </div>
        <div className={clsx(' my-3', 'navbar_border', { 'navbar_border-gradient': isActive('/settings') })}>
          <Link href='/settings' className='navbar_item'>
            <Image src='/assets/icons/settings.svg' alt='' width={22} height={22} /> 
            <span>Settings</span>
          </Link>
        </div>
      </div>

      <div className='flex-0 ps-1'>
        <Link href='/settings' className='navbar_item'>
            <Image src='/assets/icons/info.svg' alt='' width={22} height={22} /> 
            <span>Help & Information</span>
          </Link>
      </div>

    </div>
  )
}

export default Navbar