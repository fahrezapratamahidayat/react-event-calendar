'use client';

import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { docsConfig } from '@/configs/docs';
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <UISidebar className="border-none bg-transparent">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/docs">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">React Event Calendar</span>
                  <span className="">Docs</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {docsConfig.sidebarNav.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton>
                  <span className="font-medium">{section.title}</span>
                </SidebarMenuButton>
                {section.items?.length ? (
                  <SidebarMenuSub>
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === item.href}
                        >
                          <Link href={item.href}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </UISidebar>
  );
}
