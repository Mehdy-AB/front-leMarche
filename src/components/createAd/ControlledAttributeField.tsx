import { useController, Control } from 'react-hook-form';
import SingleInput from '@/components/ui/single-input';
import SingleSelect from '@/components/ui/singleSelect';

type Props = {
  control: Control<any>;
  index: number;
  field: any;
  originalAttr: {id:number,name:string,required:boolean,attributeCollectionId:number,type:string,options:{id:number,value:string}[],min?:number,max?:number,step?:number,unit?:string} | undefined;
};

export default function ControlledAttributeField({ control, index, field, originalAttr }: Props) {
  const { field: controllerField } = useController({
    control,
    name: `attributes.${index}.value`,
  });

  return (
    <div className={`flex flex-col ${index % 2 === 0 ? 'border-r-2 pr-2' : 'border-l-2 pl-2'}`}>
      <label className="text-sm font-semibold border-l-4 pl-1 mb-1 mt-2">
        {field.name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {originalAttr?.type !== 'SELECT' ? (
        <SingleInput
          placeholder=""
          max={originalAttr?.max}
          min={originalAttr?.min}
          step={originalAttr?.step}
          index={index}
          type="number"
          unit={originalAttr?.unit}
          onChange={(val) => controllerField.onChange(+val)}
          label={field.name}
        />
      ) : (
        <SingleSelect
          options={originalAttr.options.map((option) => ({
            id: option.id,
            name: option.value,
          }))}
          selected={{
            id: controllerField.value,
            name: (originalAttr.options.find((opt) => opt.id === controllerField.value)?.value) ?? null,
          }}
          onChange={(selected) => controllerField.onChange(selected?.id)}
          placeholder={field.name}
        />
      )}
    </div>
  );
}
