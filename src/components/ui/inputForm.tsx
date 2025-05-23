import * as React from "react"

import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form";

interface InputFormProps extends React.ComponentProps<"input"> {
  index: number;
}

const InputForm = React.forwardRef<HTMLInputElement, InputFormProps>(
  ({ className, type, index, ...props },ref) => {
    const { register} = useFormContext();
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...register(`attributes.${index}.value`, { valueAsNumber: true })}
        {...props}
      />
    )
  }
)
InputForm.displayName = "Input"

export { InputForm }

 