'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  
  type SingleSelectProps = {
    options: string[];
    selected: string;
    onChange: (selected:  undefined|string) => void;
    placeholder?: string;
  };

export default function singleSelectString({ options, selected, onChange, placeholder = "Select options" }: SingleSelectProps) {
  return (
    <div className='flex flex-col w-full'>
        <Select value={selected||undefined} onValueChange={(value) => {onChange(value)}}>
              <SelectTrigger>
                <SelectValue placeholder={selected||placeholder} />
              </SelectTrigger>
              <SelectContent>{options.map((option,idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
              </SelectContent>
          </Select>
          </div>
  );
}
