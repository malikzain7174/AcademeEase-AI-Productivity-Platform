import { Popover } from '@/components/global/popover';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Filter, Group, MoreVertical, SortAsc } from 'lucide-react';
import React from 'react';

type Props = {};

const Filters = (props: Props) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center flex-1'>
        <Input className='' placeholder='Search' />
      </div>
      <Separator orientation='vertical' className='h-6 mx-2 border-gray-300' />
      <div className='flex items-center space-x-4'>
        <Popover content={<>Filters by...</>}>
          <span className='flex items-center gap-2 cursor-pointer'>
            <Filter size={16} />
            Filter
          </span>
        </Popover>
        <Popover content={<>Sort by...</>}>
          <span className='flex items-center gap-2 cursor-pointer'>
            <SortAsc size={16} />
            Sort by
          </span>
        </Popover>
        <Popover content={<>Group by...</>}>
          <span className='flex items-center gap-2 cursor-pointer'>
            <Group size={16} />
            Group by
          </span>
        </Popover>
        <Popover content={<>More options...</>}>
          <span className='flex items-center gap-2 cursor-pointer'>
            <MoreVertical size={16} />
          </span>
        </Popover>
      </div>
    </div>
  );
};

export default Filters;
