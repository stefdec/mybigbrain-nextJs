"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Chatbot",
    url: "#",
    icon: "chat",
  },
  {
    title: "Apps & Integrations",
    url: "apps",
    icon: "apps",
  },
  {
    title: "People & Contacts",
    url: "#",
    icon: "people",
  },
  {
    title: "Settings",
    url: "#",
    icon: "settings",
  },
]

export function AppSidebar() {

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const currenPath = usePathname();
    // Function to determine if link is active
    const isActive = (path: string): boolean => currenPath === path;

  return (
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
        <div className={`flex items-center justify-between flex-row ${collapsed ? 'pb-6' : 'pb-4'}`}>
          {!collapsed && (
            <Link href='/'>
              <Image src='/assets/logo/my_big_brain_logo.png' alt='logo' width={150} height={26} />
            </Link>
          )}
          <SidebarTrigger onClick={toggleCollapse} />
        </div>
        {collapsed && (
          
            <Link href='/'>
              <Image src='/assets/logo/mybigbrain-logo-only.svg' alt='logo' width={30} height={30} />
            </Link>
    
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={`mb-5 rounded-lg p-[1px] hover:bg-gradient-to-r from-[#6BD9FB] via-[#6391FF] to-[#7D50FF] ${isActive(`/${item.title.toLowerCase()}`) ? 'bg-gradient-to-r from-[#6BD9FB] via-[#6391FF] to-[#7D50FF]' : ''}`}>
                  <SidebarMenuButton asChild className={isActive(`/${item.title.toLowerCase()}`)? `bg-white`: ''}>
                    <Link href={item.url}> 
                      <Image src={`/assets/icons/${item.icon}.svg`} alt='' width={22} height={22} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem className='mb-5 rounded-lg p-[1px] hover:bg-gradient-to-r from-[#6BD9FB] via-[#6391FF] to-[#7D50FF]'>
                    <SidebarMenuButton asChild>
                    <Link href='/'> 
                        <Image src={`/assets/icons/info.svg`} alt='' width={22} height={22} />
                        <span>Help & Information</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu> 
        </SidebarFooter>
    </Sidebar>
  )
}
