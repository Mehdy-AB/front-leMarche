import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { getAttributes } from '@/lib/req/ghost';

import { CreateAdsFormValues } from '@/lib/validation/all.schema';
import ControlledAttributeField from './ControlledAttributeField';
import { Attribute } from '@/lib/types/types';

export default function DisplayAtt({data }: { data: Attribute }) {
  const { control } = useFormContext<CreateAdsFormValues>();
  const { fields } = useFieldArray({
    control,
    name: 'attributes',
  });

  return (
    <div className="flex relative flex-col pb-4">
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">{data?.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 px-2">
      {fields.map((field, idx) => {
        const originalAttr = data?.data.find((a) => a.id === field.attributeId);

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
      </div>
    </div>
  );
}
