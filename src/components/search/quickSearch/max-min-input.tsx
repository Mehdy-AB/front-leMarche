import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type MaxMinInputProps = {
  max?: number;
  min?: number;
  step?: number;
  unit?: string;
  index: number;
  attributeId: number;
};

export default function MaxMinInput({
  min,
  max,
  step,
  unit,
  index,
  attributeId,
}: MaxMinInputProps) {
  const [focusField, setFocusField] = useState<'min' | 'max' | null>(null);
  const { register, setValue,watch } = useFormContext();

  useEffect(() => {
    setValue(`attributes.${index}.attributeId`, attributeId);
  }, [index, attributeId, setValue]);

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
          {...register(`attributes.${index}.value.min`, { valueAsNumber: true })}
          min={min}
          max={max}
          step={step}
          onFocus={() => setFocusField('min')}
          onBlur={() => setFocusField(null)}
          className="w-full border border-gray-300 rounded-md py-3 pr-3 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          className={`absolute left-3 text-gray-400 text-sm pointer-events-none transition-all ${
            (focusField === 'min'|| watch(`attributes.${index}.value.min`)) ? 'top-1 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2'
          }`}
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
          {...register(`attributes.${index}.value.max`, { valueAsNumber: true })}
          min={min}
          max={max}
          step={step}
          onFocus={() => setFocusField('max')}
          onBlur={() => setFocusField(null)}
          className="w-full border border-gray-300 rounded-md py-3 pr-3 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          className={`absolute left-3 text-gray-400 text-sm pointer-events-none transition-all ${
            (focusField === 'max'|| watch(`attributes.${index}.value.max`)) ? 'top-1 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2'
          }`}
        >
          Max
        </label>
      </div>
    </div>
  );
}
