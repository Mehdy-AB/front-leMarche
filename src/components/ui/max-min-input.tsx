'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils'; // Shadcn helper, needed for classNames

type MaxMinInputProps = {
  min: string;
  max: string;
  onChangeMin: (value: {max:string,min:string}) => void;
  onChangeMax: (value: {max:string,min:string}) => void;
  unit?: string;
};

export default function MaxMinInput({ min, max, onChangeMin, onChangeMax, unit }: MaxMinInputProps) {
  const [focusField, setFocusField] = useState<'min' | 'max' | null>(null);

  return (
    <div className="flex gap-4">
      {/* Min input */}
      <div className="relative w-full">
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </div>
        )}
        <input
          type="number"
          value={min}
          onChange={(e) => onChangeMin({min:e.target.value,max:max})}
          onFocus={() => setFocusField('min')}
          onBlur={() => setFocusField(null)}
          className={cn(
            "w-full border border-gray-300 rounded-md py-3 pr-3 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ",
            unit && "pr-12" // adjust padding if unit exists
          )}
        />
        <label
          className={cn(
            "absolute left-3 text-gray-400 text-sm pointer-events-none transition-all",
            min || focusField === 'min' ? "top-1 text-xs text-blue-500" : "top-1/2 -translate-y-1/2"
          )}
        >
          Min
        </label>
      </div>

      {/* Max input */}
      <div className="relative w-full">
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </div>
        )}
        <input
          type="number"
          value={max}
          onChange={(e) => onChangeMax({min:min,max:e.target.value})}
          onFocus={() => setFocusField('max')}
          onBlur={() => setFocusField(null)}
          className={cn(
            "w-full border border-gray-300 rounded-md py-3 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
            unit ? "pr-12":'pl-4'
          )}
        />
        <label
          className={cn(
            "absolute left-3 text-gray-400 text-sm pointer-events-none transition-all",
            max || focusField === 'max' ? "top-1 text-xs text-blue-500" : "top-1/2 -translate-y-1/2"
          )}
        >
          Max
        </label>
      </div>
    </div>
  );
}
