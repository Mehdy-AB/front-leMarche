import { FilterDto } from '@/lib/validation/all.schema';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type MaxMinInputProps = {
  max?: number;
  min?: number;
  step?: number;
  unit?: string;
};

export default function MaxMinInputPrice({
  min,
  max,
  step,
  unit,
}: MaxMinInputProps) {
  const [focusField, setFocusField] = useState<'min' | 'max' | null>(null);
  const { register,watch,formState:{errors} } = useFormContext<FilterDto>();
  
  return (
    <div className="flex gap-4">
      {/* Min input */}
      <div className='flex flex-col w-full'>
      <div className="relative w-full">
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </div>
        )}
        <input
          type="number"
          {...register(`minPrice`, { valueAsNumber: true,validate: (value) => {
            if (value === undefined || value === null || isNaN(value)) return "Veuillez entrer un nombre valide";
            if (min !== undefined && value < min) return `La valeur minimale est ${min}`;
            if (max !== undefined && value > max) return `La valeur maximale est ${max}`;
            return true;
          }})}
          min={min}
          max={max}
          step={step}
          onFocus={() => setFocusField('min')}
          onBlur={() => setFocusField(null)}
          className="w-full border border-gray-300 rounded-md py-2 pr-3 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          formNoValidate
        />
        <label
          className={`absolute left-3 text-gray-400 text-sm pointer-events-none transition-all ${
            (focusField === 'min'|| watch('minPrice')) ? 'top-0 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2'
          }`}
        >
          Min
        </label>
      </div>
      {errors.minPrice?.message && (
          <p className="mt-1 text-xs text-red-600">
            {errors.minPrice.message}
          </p>
        )}
      </div>

      {/* Max input */}
      <div className='flex flex-col w-full'>
      <div className="relative w-full">
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </div>
        )}
        <input
          type="number"
          {...register(`maxPrice`, { valueAsNumber: true,validate: (value) => {
            if (value === undefined || value === null || isNaN(value)) return "Veuillez entrer un nombre valide";
            if (min !== undefined && value < min) return `La valeur minimale est ${min}`;
            if (max !== undefined && value > max) return `La valeur maximale est ${max}`;
            return true;
          }})}
          min={min}
          max={max}
          step={step}
          onFocus={() => setFocusField('max')}
          onBlur={() => setFocusField(null)}
          className="w-full border border-gray-300 rounded-md py-2 pr-3 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          formNoValidate
        />
        <label
          className={`absolute left-3 text-gray-400 text-sm pointer-events-none transition-all ${
            (focusField === 'max'|| watch('maxPrice')) ? 'top-0 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2'
          }`}
        >
          Max
        </label> 
        
      </div>
      {errors.maxPrice?.message && (
          <p className="mt-1 text-xs text-red-600">
            {errors.maxPrice.message}
          </p>
        )}
      </div>
    </div>
  );
}
