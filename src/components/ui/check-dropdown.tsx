'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils'; // Make sure you have the cn() function (shadcn base)

type Option = {
  id: number;
  name: string;
};

type CheckDropdownProps = {
  options: Option[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
};

export default function CheckDropdown({ options, selected, onChange, placeholder = "Select options" }: CheckDropdownProps) {
  const [open, setOpen] = useState(false);
  const [expandItems, setExpandItems] = useState(false);
  const handleToggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedNames = options
    .filter((opt) => selected.includes(opt.id))
    .map((opt) => opt.name)
    .join(', ');

  return (
    <div className="relative flex flex-col w-full">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-fit truncate whitespace-normal break-words justify-between"
        >
          {selected.length > 0 ? selectedNames : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="flex flex-col gap-2 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
              onClick={() => handleToggle(option.id)}
            >
              <Checkbox
                checked={selected.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
                id={`checkbox-${option.id}`}
              />
              <label
                htmlFor={`checkbox-${option.id}`}
                className="text-sm font-medium cursor-pointer leading-none"
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
    {options.length<8&&
      <div className='flex flex-wrap truncate items-center gap-2 mt-2'>
        {options.slice(0, expandItems ? options.length : 3).map(option => (
          <div key={option.id} onClick={() => handleToggle(option.id)} className="flex border items-center gap-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer">
            <Checkbox
              checked={selected.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
              id={`checkbox-${option.id}`}
            />
            <label
              className="text-sm font-medium cursor-pointer leading-none"
            >
              {option.name}
            </label>
          </div>
        ))}
        {!expandItems && options.length > 3 &&
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rounded-full p-1 hover:bg-gray-100 border cursor-pointer" onClick={() => setExpandItems(true)}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>              
        }
      </div>
    }
    </div>
  );
}
