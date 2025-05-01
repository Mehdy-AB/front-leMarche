'use client';
import { getAttributes } from '@/lib/req/ghost';
import { Attribute, filterAttrbuites } from '@/lib/types/types';
import { useEffect, useState } from 'react';
import Loader from '@/lib/loaders/Loader';
import MaxMinInput from '@/components/ui/max-min-input';
import CheckDropdown from '@/components/ui/check-dropdown';
import SingleInput from '@/components/ui/single-input';
import SingleSelect from '@/components/ui/singleSelect';

export default function Filter({goBack,submit,setFilter}:{
    goBack:()=>void,
    submit:()=>void,
    setFilter:React.Dispatch<React.SetStateAction<filterAttrbuites>>,
    filters:filterAttrbuites
  }) {
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
    <div className='flex relative flex-col pb-36'>
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">{data?.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 px-2 ">
      <div className='border-r-2 pr-2 flex flex-col '>
      <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 ${filters['Price']?'border-colorOne':''}`}>Price</label>
      <MaxMinInput
          min={filters['Price']?.min || ''}
          max={filters['Price']?.max || ''}
          onChangeMin={(value) => handleChange('Price', value)}
          onChangeMax={(value) => handleChange('Price', value)}
          unit={'€'}
        />
    {
      data?.row1.map((attribute,idx) => attribute.type!=='SELECT'?(<div key={idx} className='flex flex-col gap-x-2'>
        <label key={`${attribute.id}labrow1`} className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}</label>
        {attribute.multiple?<MaxMinInput
          key={`${attribute.id}itemrow1`}
          min={filters[attribute.id]?.min || ''}
          max={filters[attribute.id]?.max || ''}
          onChangeMin={(value) => handleChange(attribute.id, value)}
          onChangeMax={(value) => handleChange(attribute.id, value)}
          unit={attribute.unit || ''}
        />:
        <SingleInput
          placeholder=""
          key={`${attribute.id}itemrow1`}
          value={filters[attribute.id] || ''}
          type='number'
          onChange={(value) => handleChange(attribute.id, value)}
          label={attribute.name}
        />}</div>
      ):(<div key={idx} className='flex flex-col gap-2'>
        <label key={`${attribute.id}labrow1`} className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}</label>
        {attribute.multiple?<CheckDropdown
          key={`${attribute.id}itemrow1`}
          options={attribute.options.map((option) => ({
            id: option.id,name: option.value
          }))}
          selected={filters[attribute.id] ? filters[attribute.id] : []}
          onChange={(selected) => handleChange(attribute.id, selected)}
          placeholder={attribute.name}
        />:<SingleSelect
              key={`${attribute.id}itemrow2`}
              options={attribute.options.map((option) => ({
                id: option.id,name: option.value
              }))}
              selected={filters[attribute.id] ? filters[attribute.id] : undefined}
              onChange={(selected) => {if(selected?.id===filters[attribute.id]?.id)handleChange(attribute.id, undefined); else handleChange(attribute.id, selected)}}
              placeholder={attribute.name}
            />}</div>
      ))}</div>
      <div className='border-l-2 pl-2 flex flex-col'>{
      data?.row2.map((attribute,idx) => attribute.type!=='SELECT'?(<div key={idx} className='flex flex-col gap-2'>
        <label key={`${attribute.id}labrow2`} className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}</label>
        {attribute.multiple?<MaxMinInput
          key={`${attribute.id}itemrow1`}
          min={filters[attribute.id]?.min || ''}
          max={filters[attribute.id]?.max || ''}
          onChangeMin={(value) => handleChange(attribute.id, value)}
          onChangeMax={(value) => handleChange(attribute.id, value)}
          unit={attribute.unit || ''}
        />:
        <SingleInput
          placeholder=""
          key={`${attribute.id}itemrow2`}
          value={filters[attribute.id] || ''}
          type='number'
          onChange={(value) => handleChange(attribute.id, value)}
          label={attribute.name}
        />}</div>
      ):(<div key={idx} className='flex flex-col gap-2'>
        <label key={`${attribute.id}labrow2`} className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${filters[attribute.id]?'border-colorOne':''}`}>{attribute.name}</label>
        {attribute.multiple?<CheckDropdown
          key={`${attribute.id}itemrow2`}
          options={attribute.options.map((option) => ({
            id: option.id,name: option.value
          }))}
          selected={filters[attribute.id] ? filters[attribute.id] : []}
          onChange={(selected) => handleChange(attribute.id, selected)}
          placeholder={attribute.name}
        />:(
            <SingleSelect
              key={`${attribute.id}itemrow2`}
              options={attribute.options.map((option) => ({
                id: option.id,name: option.value
              }))}
              selected={filters[attribute.id] ? filters[attribute.id] : undefined}
              onChange={(selected) => {if(selected?.id===filters[attribute.id]?.id)handleChange(attribute.id, undefined); else handleChange(attribute.id, selected)}}
              placeholder={attribute.name}
            />
            )}</div>
      ))}</div>
    </div>
    <div className="grid sticky bg-background rounded-lg bottom-0 p-2 grid-cols-2 mt-6">
        <span className="w-full flex justify-start">
        <button type="button" onClick={goBack} className="bg-gray-300  rounded-4xl p-3 rounded-full  font-semibold ">Retour</button>
        </span>
        <span className="w-full flex justify-end">
        <button type="submit" onClick={()=>{setFilter( Object.entries(filters).map(
            ([id, value]) => ({ id, value })));submit()}} className="bg-colorOne rounded-4xl p-3 rounded-full font-semibold text-white">Recherché</button>
        </span>
        </div>
    </div>
  );
}
