'use client';
import { getAttributes, getModelesByid } from '@/lib/req/ghost';
import { Attribute,modeles } from '@/lib/types/types';
import { useEffect, useState } from 'react';
import Loader from '@/lib/loaders/Loader';
import MaxMinInputPrice from '../ads/max-min-inputPrice';
import ModelesDropdown from './modeles-dropdown';
import { FilterDto } from '@/lib/validation/all.schema';
import { useFormContext } from 'react-hook-form';
import CheckDropdown from '../ads/check-dropdown';
import MaxMinInput from '../ads/max-min-input';


export default function Filter({goBack,displayBrands,typeId,brandsId,handleSubmit}:{
    goBack:()=>void,
    typeId:number
    handleSubmit:()=>void,
    displayBrands:Boolean
    brandsId:number[]
  }) {
  const [attributes,setAttributes] = useState<Attribute>();
  const [modeles,setModeles] = useState<{modeles:modeles,isloding:boolean}>({modeles:[],isloding:true});
  const [loader,setLoader] = useState(true);
  const { setValue } = useFormContext<FilterDto>();

  useEffect(() => {
    const  getAttrbuites=async ()=>{
        const data = await getAttributes(typeId); 
        if(data){
          setAttributes(data)
        }
    }
    const  getModeles=async ()=>{
        if(!brandsId||brandsId.length===0)return;
        const data = await getModelesByid(brandsId); 
        if(data){
          setModeles({modeles:data,isloding:false});
        }
    }
    getAttrbuites()
      .then(() => getModeles().then(()=>setModeles(prv=>({...prv,isloding:false}))))
      .finally(() => setLoader(false));
    },[]);

  useEffect(() => {
    if(!attributes|| attributes.data.length==0)return;
        const attrValues = attributes?.data?.map(attr => {
          return {
            attributeId: attr.id,
            value:(attr.type==='SELECT'?[]:{ min: undefined, max: undefined }), // default to empty if not matched
          };
        });
        setValue('attributes', attrValues )
  }, [attributes]);

  if(loader)
    return(
    <div className="animate-pulse flex flex-col pb-36 px-4">
      {/* Title */}
      <div className="h-6 w-1/4 mb-6 bg-gray-300 rounded" />

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div className="flex flex-col border-r-2 pr-2">
          <div className="h-4 w-20 mb-2 bg-gray-300 rounded" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>

        {/* Models */}
        <div className="flex flex-col border-l-2 pl-2">
          <div className="h-4 w-24 mb-2 bg-gray-300 rounded" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>

        {/* Repeat for attributes (simulate 4 attributes for demo) */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              idx % 2 === 1 ? "border-l-2 pl-2" : "border-r-2 pr-2"
            }`}
          >
            <div className="h-4 w-28 mb-2 mt-2 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="grid sticky bg-white bottom-0 p-2 grid-cols-2 mt-6">
        <div className="w-full flex justify-start">
          <div className="h-10 w-28 bg-gray-300 rounded-full" />
        </div>
        <div className="w-full flex justify-end">
          <div className="h-10 w-32 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
    )

  return (
    
    <form noValidate  onSubmit={handleSubmit} className='flex relative flex-col pb-36'>
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">{attributes?.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 px-2 ">
      <div className='border-r-2 pr-2 flex flex-col '>
       <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 ${false?'border-colorOne':''}`}>Price</label>
         <MaxMinInputPrice
            min={0}
            unit={'€'}
          />
      </div>
      {displayBrands&&<div className='border-l-2 pl-2 flex flex-col '>
       <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 ${false?'border-colorOne':''}`}>Models</label>
          <ModelesDropdown modeles={modeles.modeles} isLoading={modeles.isloding} />
      </div>}
    {attributes?.data?.map((attribute,idx) => 
    (<div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'border-l-2 pl-2' : 'border-r-2 pr-2'}`}>
      {attribute.type!=='SELECT'?(
      <div className='flex flex-col gap-x-2'>
        <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${false?'border-colorOne':''}`}>{attribute.name}</label>
        <MaxMinInput
          min={attribute.min || undefined}
          index={idx}
          max={attribute.max || undefined}
          step={attribute.step || undefined}
          unit={attribute.unit || ''}
        />
      </div>
      ):(
      <div className='flex flex-col gap-2'>
        <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${false?'border-colorOne':''}`}>{attribute.name}</label>
        <CheckDropdown
          attributeId={attribute.id}
          attributeIndex={idx}
          options={attribute.options.map((option) => ({
            id: option.id,name: option.value
          }))}
          placeholder={attribute.name}
        /> 
      </div>
      )}
      </div>
      ))
    }</div>

    <div className="grid sticky bg-background rounded-lg bottom-0 p-2 grid-cols-2 mt-6">
        <span className="w-full flex justify-start">
        <button type="button" onClick={goBack} className="bg-gray-300 rounded-4xl p-3 rounded-full font-semibold ">Retour</button>
        </span>
        <span className="w-full flex justify-end">
        <button type="submit" className="bg-colorOne rounded-4xl p-3 rounded-full font-semibold text-white">Recherché</button>
        </span>
        </div>
    </form>
  );
}
