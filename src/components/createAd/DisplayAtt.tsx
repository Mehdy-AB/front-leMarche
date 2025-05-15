import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { getAttributes } from '@/lib/req/ghost';

import { CreateAdsFormValues } from '@/lib/validation/all.schema';
import ControlledAttributeField from './ControlledAttributeField';

export default function DisplayAtt() {
  const { control, watch } = useFormContext<CreateAdsFormValues>();
  const typeId = watch('typeId');
  const [data, setData] = useState<any>();
  const [loader, setLoader] = useState(true);

  const { fields, replace } = useFieldArray({
    control,
    name: 'attributes',
  });

  useEffect(() => {
    setData(null)
    const fetchAttributes = async () => {
      const result = await getAttributes(typeId);
      if (result?.data) {
        setData(result);
        const initialAttributes = result.data.map((attribute) => ({
          attributeId: attribute.id,
          value: undefined,
          name: attribute.name,
          required: attribute.required,
          attributeCollectionId: attribute.collectionId,
        }));
        replace(initialAttributes);
        setLoader(false);
      }
    };
    fetchAttributes();
  }, [typeId, replace]);

  return (
    <div className="flex relative flex-col pb-4">
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Attributes</h2>
      {!data?
      <div className=' flex justify-center items-center'>
        <span className=''>Sélectionner une catégorie pour accès au attributes .</span>
      </div>
      :<div className="grid grid-cols-1 md:grid-cols-2 px-2">
      {fields.map((field, idx) => {
        const originalAttr = data?.data?.find((a) => a.id === field.attributeId);

        return (
          <ControlledAttributeField
            key={field.id}
            control={control}
            index={idx}
            field={field}
            originalAttr={originalAttr}
          />
        );
      })}
      </div>}
    </div>
  );
}
