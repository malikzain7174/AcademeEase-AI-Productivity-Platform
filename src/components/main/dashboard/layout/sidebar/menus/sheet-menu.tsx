import Link from 'next/link';
import { Airplay, MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Menu } from './menu';
import { getMenuList } from '@/lib/menu-list';

interface SheetMenuProps {
  menuList: ReturnType<typeof getMenuList>;
}

export function SheetMenu({ menuList }: SheetMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-8' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='sm:w-72 px-3 h-full flex flex-col' side='left'>
        <SheetHeader>
          <SheetTitle className='sr-only'>Mobile Menu</SheetTitle>
          <SheetDescription className='sr-only'>
            Mobile Navigation for Dashboard
          </SheetDescription>
          <Button
            className='flex justify-center items-center pb-2 pt-1'
            variant='link'
            asChild
          >
            <Link href='/dashboard' className='flex items-center gap-2'>
              <Airplay className='w-6 h-6 mr-1' />
              <h1 className='font-bold text-lg'>
                AcademEase
                <span className='text-primary text-xs font-semibold'>
                  .{process.env.NEXT_PUBLIC_LOGO_SUBSCRIPT}
                </span>
              </h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu menuList={menuList} isOpen />
      </SheetContent>
    </Sheet>
  );
}
