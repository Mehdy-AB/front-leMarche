import { useEffect, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterDto } from "@/lib/validation/all.schema";

type Option = {
  id: number;
  name: string;
};

type CheckDropdownProps = {
  options: Option[];
  placeholder?: string;
  attributeId: number;
  attributeIndex:number
};

export default function CheckDropdown({ options, placeholder = "Select options",attributeIndex, attributeId }: CheckDropdownProps) {
  const [open, setOpen] = useState(false);
  const { setValue, getValues, control } = useFormContext<FilterDto>();

  const { fields, append, update } = useFieldArray({
    control,
    name: "attributes",
  });
  const watchedAttributeValue = useWatch({
    control,
    name: `attributes.${attributeIndex}.value`,
  }) as number[] ||[];
  
  useEffect(() => {
      setValue(`attributes.${attributeIndex}`, {attributeId:attributeId,value:[]});
    }, [attributeIndex, attributeId, setValue]);

    const selected  = Array.isArray(watchedAttributeValue) ? watchedAttributeValue : [];


  const handleToggle = (id: number) => {
    let updated: number[];

    if (selected.includes(id)) {
      updated = selected.filter((item) => item !== id);
    } else {
      updated = [...selected, id];
    }
      update(attributeIndex, { attributeId, value: updated });
  };

  const selectedNames = options
    .filter((opt) => selected.includes(opt.id))
    .map((opt) => opt.name)
    .join(", ");

  return (
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
                  className="text-sm font-medium cursor-pointer leading-none"
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

    
  );
}
