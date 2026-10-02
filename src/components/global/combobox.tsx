import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Item = {
  id: string;
  name: string;
};

interface ComboBoxProps {
  items: Array<Item>;
  onSelect: (item: Item) => void;
  children: React.ReactNode;
  label: string;
  value: string;
}

export default function ComboBox({
  items,
  onSelect,
  children,
  label,
  value,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(value);

  const handleSelect = (item: { id: string; name: string }) => {
    setSelectedItem(item.name);
    onSelect(item);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder={`Search ${label}...`} />
          <CommandList>
            <CommandEmpty>No ${label} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  className='capitalize'
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleSelect(item)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedItem === item.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.name.toLocaleLowerCase()}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
