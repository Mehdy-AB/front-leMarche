'use client';
import { getAttributes } from '@/lib/req/ghost';
import { Attribute } from '@/lib/types/types';
import { useEffect, useState } from 'react';
import Loader from '@/lib/loaders/Loader';
import SingleInput from '@/components/ui/single-input';
import SingleSelect from '@/components/ui/singleSelect';

export default function DisplayAtt() {
  const [data,setData] = useState<Attribute>();
  const [loader,setLoader] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>|Record<number, number[]>>({});

  useEffect(() => {
    const  getAttrbuites=async ()=>{
        const data = await getAttributes(1); 
        if(data)
        setData(data)
        setLoader(false)
    }
    getAttrbuites()
    },[]);
  
  
  const handleChange = (attributeId: number | string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  }


  if(loader)
    return(
    <div className="flex justify-center items-center py-20">
      <Loader/>
    </div>
    )
  return (
    <div className='flex relative flex-col pb-4'>
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">{data?.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 px-2 ">
    {data?.data.map((attribute,idx) => 
      <div key={idx} className={`flex flex-col ${idx%2===0?'border-r-2 pr-2':'border-l-2 pl-2'} `}>
      {attribute.type!=='SELECT'?( 
        <div key={idx} className='flex flex-col gap-x-2'>
          <label className={`text-sm flex font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}
            {attribute.required && <span className='text-red-500'>*</span>}
          </label>
          <SingleInput
            placeholder=""
            value={filters[attribute.id] || ''}
            type='number'
            unit={attribute.unit}
            onChange={(value) => handleChange(attribute.id, value)}
            label={attribute.name}
          /></div>
        ):(
        <div key={idx} className='flex flex-col gap-2'>
          <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}</label>
          <SingleSelect
                options={attribute.options.map((option) => ({
                  id: option.id,name: option.value
                }))}
                selected={filters[attribute.id] ? filters[attribute.id] : undefined}
                onChange={(selected) => {if(selected?.id===filters[attribute.id]?.id)handleChange(attribute.id, undefined); else handleChange(attribute.id, selected)}}
                placeholder={attribute.name}
              />
        </div>
        )}
      </div>)}
      </div>
    </div>
  );
}
