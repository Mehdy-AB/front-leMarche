'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { brands as BrandsType } from '@/lib/types/types';
import { FilterDto } from '@/lib/validation/all.schema';

export default function BrandDropdown({ brands }: { brands: {brands:BrandsType,isloading:boolean} }) {
  const { setValue, getValues } = useFormContext<FilterDto>();
  const [selected, setSelected] = useState<number[]>([]);
  const [filtered, setFiltered] = useState<BrandsType>(brands.brands);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Load default selected brands from form values
  useEffect(() => {
    const defaultBrands = getValues('type.brand');
    if (defaultBrands && defaultBrands.length > 0) {
      setSelected(defaultBrands.map(b => b.id));
    }
  }, []);

  // Update form values when selected brands change
  useEffect(() => {
    setValue('type.brand', selected.map(id => ({ id })));
  }, [selected, setValue]);

  // Reset filtered brands when the list updates
  useEffect(() => {
    setFiltered(brands.brands);
  }, [brands.brands]);

  // Toggle brand selection
  const toggle = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter brands based on search input
  const filterBrands = (text: string) => {
    setSearch(text);
    if (!text) {
      setFiltered(brands.brands);
    } else {
      setFiltered(
        brands.brands.filter(b =>
          b.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  // Clear selected brands
  const clearSelection = () => {
    setSelected([]);
  };

  // Display selected brand names with truncation
  const selectedNames = brands.brands
    .filter(b => selected.includes(b.id))
    .map(b => b.name)
    .join(', ');
  if(!brands.isloading)
    return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full truncate max-h-16 text-left flex justify-between items-center"
          title={selectedNames} // Show full names on hover
        >
          <span className="truncate">
            {selected.length > 0 ? selectedNames : 'Sélectionner une marque'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        {/* Search input */}
        <input
          type="text"
          placeholder="Rechercher une marque"
          className="border px-3 py-2 mb-2 w-full rounded text-sm"
          value={search}
          onChange={e => filterBrands(e.target.value)}
        />

        {/* Brands list */}
        <div className="flex flex-col gap-2 max-h-60 overflow-auto">
          {filtered.map(brand => (
            <div
              key={brand.id}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
              onClick={() => toggle(brand.id)}
            >
              <Checkbox
                checked={selected.includes(brand.id)}
                onCheckedChange={() => toggle(brand.id)}
                id={`brand-${brand.id}`}
              />
              <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                {brand.name}
              </label>
            </div>
          ))}
        </div>

        {/* Clear selection button */}
        {selected.length > 0 && (
          <div className="mt-2 text-right">
            <button onClick={clearSelection} className="text-xs text-gray-500 hover:underline">
              Réinitialiser la sélection
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
  return (
    <div className="bg-gray-200 w-full font-bold transition animate-pulse text-gray-400 text-center p-3 rounded">
      Select une category
    </div>
  );
}
