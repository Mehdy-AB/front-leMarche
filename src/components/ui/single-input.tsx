'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SingleInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  unit?: string|null;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
};

export default function SingleInput({ placeholder, value,unit, onChange, type = 'number' }: SingleInputProps) {
  return (
    <div className="flex flex-col relative gap-2 w-full">
      {unit && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                {unit}
              </div>
            )}
      <Input
        type={type}
        min={0}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full border border-gray-300 rounded-md py-3 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          unit ? "pr-12":'pl-4'
        )}
      />

    </div>

  );
}
