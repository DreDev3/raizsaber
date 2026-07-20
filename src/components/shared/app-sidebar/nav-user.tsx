'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useClerk, useUser } from '@clerk/nextjs';
import { BadgeCheck, ChevronsUpDown, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { NotificatiionsPopover } from './notifications-popover';
import { cn } from '@/lib/utils';

export const NavUser = () => {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { isMobile, open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {user
          ? (
            <div className={cn(
              'flex items-center gap-2',
              !open && 'flex-col-reverse'
            )}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  >
                    <Avatar src={user.imageUrl} fallback={user.fullName} />
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user.fullName}
                      </span>
                      <span className='truncate text-xs'>
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <ChevronsUpDown className='ml-auto size4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar src={user.imageUrl} fallback={user.fullName} />
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {user.fullName}
                        </span>
                        <span className='truncate text-xs'>
                          {user.primaryEmailAddress?.emailAddress}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => openUserProfile()}>
                      <BadgeCheck />
                      <span>Gerenciar conta</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
                      <LogOut />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <NotificatiionsPopover />
            </div>
          )
          : (
            <>
              {!isLoaded
                ? (
                  <Skeleton />
                )
                : (
                  <div className='p-2'>
                    <Link href='/auth/sign-in' passHref className='w-full'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='w-full bg-primary text-white hover:bg-primary/90 hover:text-white '
                      >
                        <LogIn />
                        <span
                          className='sm:hidden group-data-[state=expanded]:block'
                        >
                          Entrar
                        </span>
                      </Button>
                    </Link>
                  </div>
                )}
            </>
          )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};