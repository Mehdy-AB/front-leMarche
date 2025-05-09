'use client';

import { InputForm } from '@/components/ui/inputForm';
import { cn } from '@/lib/utils';

type SingleInputProps = {
  label: string;
  placeholder?: string;
  index: number;
  unit?: string|null;
  max?: number;
  min?: number;
  step?: number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
};

export default function SingleInput({ placeholder,max,min,step, index,unit, type = 'number' }: SingleInputProps) {
  return (
    <div className="flex flex-col relative gap-2 w-full">
      {unit && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                {unit}
              </div>
            )}
      <InputForm
        type={type}
        index={index}
        min={min||0}
        max={max||undefined}
        step={step||undefined}
        placeholder={placeholder}
        className={cn(
          "w-full border border-gray-300 rounded-md py-3 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          unit ? "pr-12":'pl-4'
        )}
      />

    </div>

  );
}
