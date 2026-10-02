'use client';
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import Tooltip from './tooltip';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface IBreadcrumb {
  label: string;
  href?: string;
  tooltip?: string;
  dropdownItems?: Array<{
    label: string;
    href: string;
  }>;
}

interface BreadcrumbProps {
  items: IBreadcrumb[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Check if current URL matches any of the dropdown items
    items.forEach((item) => {
      if (item.dropdownItems) {
        item.dropdownItems.forEach((dropdownItem) => {
          if (dropdownItem.href === pathname) {
            setSelectedDropdown(dropdownItem.label);
          }
        });
      }
    });
  }, [pathname, items]);

  const handleDropdownSelect = (href: string, label: string) => {
    setSelectedDropdown(label);
    router.push(href);
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.dropdownItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex items-center gap-1 outline-none'>
                    <Tooltip
                      content={item.tooltip || item.label}
                      aria-label={item.tooltip}
                    >
                      <span
                        className={cn('', {
                          'text-muted-foreground': !item.dropdownItems.some(
                            (dropdownItem) => dropdownItem.href === pathname
                          ),
                          'font-semibold text-foreground':
                            item.dropdownItems.some(
                              (dropdownItem) => dropdownItem.href === pathname
                            ),
                        })}
                      >
                        {selectedDropdown || item.label}
                      </span>
                    </Tooltip>
                    <ChevronDown className='h-4 w-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                      <DropdownMenuItem
                        key={dropdownIndex}
                        onSelect={() =>
                          handleDropdownSelect(
                            dropdownItem.href,
                            dropdownItem.label
                          )
                        }
                      >
                        {dropdownItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip
                  content={item.tooltip || item.label}
                  aria-label={item.tooltip}
                >
                  <BreadcrumbLink
                    className={cn({
                      underline: item.href ? true : false,
                      'text-muted-foreground': item.href !== pathname,
                      'font-semibold text-foreground': item.href === pathname,
                    })}
                    href={item.href}
                  >
                    {item.label.length > 15
                      ? `${item.label.substring(0, 15)}...`
                      : item.label}
                  </BreadcrumbLink>
                </Tooltip>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
