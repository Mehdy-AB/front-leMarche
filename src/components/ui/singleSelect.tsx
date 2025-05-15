'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {  useState } from 'react';
type Option = {
    id: number;
    name: string|null;
  };
  
  type SingleSelectProps = {
    options: Option[];
    selected: Option | null;
    onChange: (selected: Option|undefined) => void;
    placeholder?: string;
  };

export default function SingleSelect({ options, selected, onChange, placeholder = "Select options" }: SingleSelectProps) {
    const [expandItems, setExpandItems] = useState(false);

  return (
    <div className='flex flex-col w-full'>
        <Select
          value={selected?.name ?? ""}
          onValueChange={(value) => {onChange(options.find(option => option.name === value))}}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <div className='max-h-48 overflow-auto'>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.name??''}>
                {option.name}
              </SelectItem>
            ))}
            </div>
            <div className="mt-2 text-right">
              <button onClick={()=>{onChange(undefined);}} className="text-xs text-gray-500 hover:underline">
                Réinitialiser la sélection
              </button>
            </div>
          </SelectContent>
        </Select>

          {options.length<8&&
            <div className='flex flex-wrap truncate items-center gap-2 mt-2'>
              {options.slice(0, expandItems ? options.length : 3).map(option => (
                <div key={option.id} onClick={() => onChange(option)} className={`flex text-sm font-medium leading-none border items-center gap-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer ${selected?.id === option.id ? 'border-2 border-colorOne/40' : ''}`}>
                    {option.name}
                </div>
              ))}
              {!expandItems && options.length > 3 &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rounded-full p-1 hover:bg-gray-100 border cursor-pointer" onClick={() => setExpandItems(true)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>              
              }
            </div>
          }</div>
  );
}
