'use client';

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterDto } from "@/lib/validation/all.schema";
import { modeles as ModelesType } from "@/lib/types/types";
import { useEffect, useState } from "react";

type ModelesDropdownProps = {
  modeles: ModelesType;
  placeholder?: string;
  isLoading: boolean;
};

export default function ModelesDropdown({ modeles, isLoading, placeholder = "Sélectionner des modèles" }: ModelesDropdownProps) {
  const { control, setValue } = useFormContext<FilterDto>();
  const [open, setOpen] = useState(false);

  const { fields: brands, update } = useFieldArray({
    control,
    name: "type.brand",
  });

  const watchedBrands = useWatch({
    control,
    name: "type.brand",
  }) || [];

  const toggleModel = (brandIndex: number, modelId: number) => {
    const brand = watchedBrands[brandIndex];
    const selectedModels = brand?.modeles || [];
    const updatedModels = selectedModels.includes(modelId)
      ? selectedModels.filter((id: number) => id !== modelId)
      : [...selectedModels, modelId];

    update(brandIndex, { ...brand, modeles: updatedModels });
  };

  const clearAll = () => {
    watchedBrands.forEach((brand, index) => {
      if (brand.modeles&&brand.modeles?.length > 0) {
        update(index, { ...brand, modeles: [] });
      }
    });
  };

  const selectedModelNames = modeles.flatMap((brand, brandIndex) =>
    brand.models.filter(model =>
      watchedBrands[brandIndex]?.modeles?.includes(model.id)
    ).map(model => model.name)
  );

  if (!isLoading && modeles.length > 0) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full truncate max-h-16 text-left flex justify-between items-center"
            title={selectedModelNames.join(', ')}
          >
            <span className="truncate">
              {selectedModelNames.length > 0 ? selectedModelNames.join(', ') : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2 ">
          <div className="flex flex-col gap-4 overflow-auto max-h-96">
            {modeles.map((brand, brandIndex) => {
              const selectedModels = watchedBrands[brandIndex]?.modeles || [];
              return (
                <div key={brand.id} className="border-b pb-2">
                  <div className="font-semibold mb-1">{brand.name}</div>
                  <div className="flex flex-col gap-2 pl-2">
                    {brand.models.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-1 cursor-pointer"
                        onClick={() => toggleModel(brandIndex, model.id)}
                      >
                        <Checkbox
                          checked={selectedModels.includes(model.id)}
                          onCheckedChange={() => toggleModel(brandIndex, model.id)}
                          id={`model-${brand.id}-${model.id}`}
                        />
                        <label className="text-sm cursor-pointer font-medium leading-none">
                          {model.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedModelNames.length > 0 && (
            <div className="mt-2 text-right">
              <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">
                Réinitialiser la sélection
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="bg-gray-200 w-full font-bold transition animate-pulse text-gray-400 text-center p-3 rounded">
      Select une marque
    </div>
  );
}
