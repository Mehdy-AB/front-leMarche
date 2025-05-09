'use client';
import { getAttributes, getModelesByid } from '@/lib/req/ghost';
import { Attribute,modeles } from '@/lib/types/types';
import { useEffect, useState } from 'react';
import Loader from '@/lib/loaders/Loader';
import MaxMinInput from './max-min-input';
import CheckDropdown from './check-dropdown';
import MaxMinInputPrice from './max-min-inputPrice';
import ModelesDropdown from './modeles-dropdown';


export default function Filter({goBack,typeId,brandsId,handleSubmit}:{
    goBack:()=>void,
    typeId:number
    handleSubmit:()=>void,
    brandsId:number[]
  }) {
  const [data,setData] = useState<Attribute>();
  const [modeles,setModeles] = useState<{modeles:modeles,isloding:boolean}>({modeles:[],isloding:true});
  const [loader,setLoader] = useState(true);
  
  useEffect(() => {
    const  getAttrbuites=async ()=>{
        const data = await getAttributes(typeId); 
        if(data){
          setData(data)
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

  if(loader)
    return(
    <div className="flex justify-center items-center py-20">
      <Loader/>
    </div>
    )

  return (
    
    <form onSubmit={handleSubmit} className='flex relative flex-col pb-36'>
      <h2 className="text-xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">{data?.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 px-2 ">
      <div className='border-r-2 pr-2 flex flex-col '>
       <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 ${false?'border-colorOne':''}`}>Price</label>
         <MaxMinInputPrice
            min={0}
            unit={'€'}
          />
      </div>
      <div className='border-l-2 pl-2 flex flex-col '>
       <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 ${false?'border-colorOne':''}`}>Models</label>
          <ModelesDropdown modeles={modeles.modeles} isLoading={modeles.isloding} />
      </div>
    {data?.data.map((attribute,idx) => 
    (<div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'border-r-2 pr-2' : 'border-l-2 pl-2'}`}>
      {attribute.type!=='SELECT'?(
      <div className='flex flex-col gap-x-2'>
        <label className={`text-sm font-semibold border-l-4 pl-1 mb-1 mt-2 ${false?'border-colorOne':''}`}>{attribute.name}</label>
        <MaxMinInput
          attributeId={attribute.id}
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
