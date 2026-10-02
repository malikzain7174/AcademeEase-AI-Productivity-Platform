'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { ModalLink } from '@/components/ui/modal';
import { USER_PREFERENCES_MODAL_ROUTE } from './user-preferences-modal';

export function UserNavMenu() {
  const { data: session, status, update } = useSession();
  const user = session?.user;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  };

  // Force session update when component mounts
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Try to update the session
      update();
    }
  }, [status, update]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Button
        variant='outline'
        className='relative h-10 w-10 rounded-full'
        disabled
      >
        <Avatar className='h-10 w-10'>
          <AvatarFallback className='bg-transparent animate-pulse'>
            ...
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Only render menu if session is authenticated
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='relative h-10 w-10 rounded-full'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={user?.image || ''} alt='Avatar' />
                  <AvatarFallback className='bg-transparent'>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal' asChild>
          <Link href='/account' className='flex items-center'>
            <div className='flex flex-col space-y-2'>
              <div className='flex space-x-2 items-center'>
                <Avatar className='h-9 w-9 border-1'>
                  <AvatarImage src={user?.image || ''} alt='Avatar' />
                  <AvatarFallback className='bg-transparent'>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <p className='text-sm font-medium leading-none'>
                  {user?.name || 'User'}
                </p>
              </div>
              <p className='text-xs leading-none text-muted-foreground'>
                {user?.email || 'No email available'}
              </p>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <Link href='/dashboard' className='flex items-center'>
              <LayoutGrid className='w-4 h-4 mr-3 text-muted-foreground' />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <ModalLink
              href={`?${USER_PREFERENCES_MODAL_ROUTE}`}
              className='flex items-center'
            >
              <User className='w-4 h-4 mr-3 text-muted-foreground' />
              Preferences
            </ModalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='hover:cursor-pointer'
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className='w-4 h-4 mr-3 text-muted-foreground' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
