'use client';

import { useEffect, useState } from 'react';
import {  FormProvider, useForm } from 'react-hook-form';
import {  FilterDto, filterDtoSchema } from '@/lib/validation/all.schema';
import MaxMinInput from './max-min-input';
import MaxMinInputPrice from '@/components/search/ads/max-min-inputPrice';
import CheckDropdown from './check-dropdown';
import ModelesDropdown from '@/components/search/quickSearch/modeles-dropdown';
import { getAttributes, getBrandsByid, getModelesByid, getRegions, getTypesByid } from '@/lib/req/ghost';
import { Attribute, brands, modeles, region, types } from '@/lib/types/types';
import BrandDropdown from './BrandDropdown';
import LocationDropdown from './LocationDropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SingleSelect from '@/components/ui/singleSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { filterFromQueryParams } from '@/lib/functions';

export default function FullFilter({
  handleSubmitData
}: {
  handleSubmitData: (data: FilterDto) => void
}) {
  const form = useForm<FilterDto>({mode: "onChange",resolver: zodResolver(filterDtoSchema as any)});
  const { reset,getValues,watch,setValue,register ,handleSubmit} = form;
  const [brands, setBrands] = useState<{brands:brands,isloading:boolean}>({brands:[],isloading:true});
  const [types, setTypes] = useState<{types:types,isloading:boolean}>({types:[],isloading:true});
  const [modeles, setModeles] = useState<{modeles:modeles,isloding:boolean}>({modeles:[],isloding:true});
  const [collapsed, setCollapsed] = useState(true);
  const searchParams = useSearchParams();
  const [region, setRegion] = useState<region>([]);
  const [displayBrands,setDisplayBrands]=useState(false)
  const [attributes, setAttributes] = useState<Attribute>({ title: 'Attributes', data: [] });
  const [selectedType, setSelectedType] = useState<{
    id: number;
    name: string;
    url: string;
    categoryId: number;
}|null>(null);

  useEffect(() => {
    const parsedFilter = filterFromQueryParams(searchParams);
    if (parsedFilter) reset(parsedFilter);
    const fetchCategories = async () => {
      const data = await getTypesByid(1);
      if (data) setTypes(prv=>({...prv,types:data}));
      if(data&&parsedFilter?.type?.id){
        const type = data.find(t=>t.id===parsedFilter?.type?.id)||null;
        setSelectedType(type)
        if(type?.includeBrands)
          setDisplayBrands(true)
      }
    };
    fetchCategories().then(()=>setTypes(prv=>({...prv,isloading:false})));

    const fetchRegion = async () => {
      const regionData =await getRegions()
      if (regionData){
        setRegion(regionData);
      }
    };
    fetchRegion();

    const fetchDataType=async()=>{
      if(parsedFilter?.type?.id){
        const attrData = await getAttributes(parsedFilter.type.id);
        setValue('type.id',parsedFilter?.type?.id)
        if (attrData) setAttributes(attrData);
      }
      const data = await getBrandsByid(parsedFilter?.type?.id||0);
      if (data) setBrands({isloading:false,brands:data});
    }    
    fetchDataType();
    
  }, []);

  useEffect(() => {
    const parsedFilter = filterFromQueryParams(searchParams);    
    const attrValues = attributes?.data?.map(attr => {
      const matched = parsedFilter?.attributes?.find(
        f => f.attributeId === attr.id
      );

      return {
        attributeId: attr.id,
        value: matched?.value || (attr.type==='SELECT'?[]:{ min: undefined, max: undefined }), // default to empty if not matched
      };
    });
    setValue('attributes', attrValues )
  }, [attributes]);

  const selectedbrands = watch('type.brand') || [];

  const selectedBrandIds = selectedbrands.map(b => b.id);
  
  useEffect(() => {
    const fetchModeles = async () => {
      setModeles({modeles:[],isloding:true})
      if (selectedBrandIds.length === 0) return;
  
      const models = await getModelesByid(selectedBrandIds);
      if (models) setModeles({modeles:models,isloding:false});else setModeles({modeles:[],isloding:false});
  
      const currentBrands = selectedbrands.map((brand) => ({ id:brand.id, modeles:brand.modeles||[] }));
  
      // Only update if values are different (prevents infinite loop)
      const shouldUpdate = selectedbrands.some((b, idx) => b.id !== currentBrands[idx]?.id || b.modeles);
      if (shouldUpdate) {
        setValue('type.brand', currentBrands);
      }
    };
  
    fetchModeles().then(()=>setModeles(prv=>({...prv,isloding:false})));
  }, [selectedBrandIds.join(','), setValue]);

  const [selectedTypeId2,setSelectedTypeId2] =useState<number|null>()
  const selectedTypeId = watch('type.id');

  useEffect(() => {
    setSelectedTypeId2(selectedTypeId)
  }, [selectedTypeId, setValue]);

  useEffect(() => {
    setBrands({isloading:true,brands:[]})
    setModeles({isloding:true,modeles:[]})
    setValue('type.brand',undefined)
    const type = types.types.find(t=>t.id===selectedTypeId)||null
    setSelectedType(type);
    if(!selectedTypeId2)return;
    if(type?.includeBrands)
          setDisplayBrands(true)
    setAttributes({ title: 'Attributes', data: [] });
    const fetchDataType=async()=>{
      const attrData = await getAttributes(selectedTypeId);
      if (attrData) setAttributes(attrData);
      const data = await getBrandsByid(selectedTypeId);
      if (data) setBrands({isloading:false,brands:data});
    }    
    setCollapsed(true)
    fetchDataType();
  }, [selectedTypeId2]);

  const options = [
    { id: 1, name: "plus recent" },
    { id: 2, name: "plus cher" },
    { id: 3, name: "moins cher" },
    { id: 4, name: "plus ancien" }
  ];
  
  const onSubmit = (data: FilterDto) => {handleSubmitData(data)};


  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {/* Top Filter Bar */}
        <div className="w-full bg-white border rounded-md shadow-sm px-3 py-2">
        <div className="w-full bg-white border rounded-md shadow-sm px-3 py-2">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Brand */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Categories</label>
              <SingleSelect placeholder='Select une category' options={types.types.map(t => ({ id: t.id, name: t.name }))} selected={selectedType??null} onChange={(data)=>{if(data){setValue('type.id',data?.id)}else{setValue('type',undefined);setSelectedTypeId2(null)}} } />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Région</label>
              <LocationDropdown regions={region} />
            </div>
            {/* Price */}
            <div className='flex flex-col'>
                <label className="font-semibold text-sm mb-1 block border-l-4 pl-2 ">Prix</label>
                <MaxMinInputPrice min={0} unit="€" />
            </div>
            {/* Trier par (Sort) */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Trier par</label>
              <Select
                value={watch('tri') ?? "plus recent"}
                onValueChange={(value) => {
                  const option = options.find((option) => option.name === value);
                  if (option) setValue("tri", option.name as "plus recent" | "plus cher" | "moins cher" | "plus ancien"); // keep form synced
                }}
              >
                <SelectTrigger className="border border-gray-300 rounded-md text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-colorOne">
                  <SelectValue placeholder="Sélectionner un tri" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.name ?? ""}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

          {attributes?.data?.length>0&&(<><div className="flex flex-wrap w-full items-center justify-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-sm flex items-center gap-1 font-medium text-colorOne hover:underline"
          >
            {collapsed ? 'Afficher les filtres' : 'Masquer'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="size-4">
              <path
                fillRule="evenodd"
                d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z"
                clipRule="evenodd" />
            </svg>
          </button>
        </div><div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? 'max-h-0' : 'max-h-[1000px]'}`}
        >

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {displayBrands&&<div className='grid col-span-1 sm:col-span-2 grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1 border-l-4 pl-2 ">Marque</label>
                  <BrandDropdown brands={brands} />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1 block border-l-4 pl-2">Modèles</label>
                  <ModelesDropdown isLoading={modeles.isloding} modeles={modeles.modeles} />
                </div>
                
              </div>}
              {attributes.data.map((attribute, idx) => (
                <div key={attribute.id} className="flex flex-col">
                  <label className={`text-sm font-semibold mb-1 border-l-4 pl-2 `}>
                    {attribute.name}
                  </label>
                  {attribute.type !== 'SELECT' ? (
                    <MaxMinInput
                      min={attribute.min || undefined}
                      max={attribute.max || undefined}
                      step={attribute.step || undefined}
                      index={idx}
                      unit={attribute.unit || ''} />
                  ) : (
                    <CheckDropdown
                      attributeId={attribute.id}
                      attributeIndex={idx}
                      options={attribute.options.map((opt) => ({
                        id: opt.id,
                        name: opt.value,
                      }))}
                      placeholder={'Sélectionner'} />
                  )}
                </div>
              ))}
            </div>
          </div></>)}
        </div>

        {/* Bottom Buttons */}
        <div className=" sticky bg-background rounded-lg bottom-0 p-2 ">
          <span className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-colorOne w-[40%] rounded-4xl p-2 rounded-full font-semibold text-white"
            >
              
              Rechercher
            </button>
          </span>
        </div>
      </form>
      </FormProvider>
  );
}
