'use client';

import { useEffect, useState } from 'react';
import {  FormProvider, useForm } from 'react-hook-form';
import {  FilterDto, filterDtoSchema } from '@/lib/validation/all.schema';
import {  getRegions, getTypesByid } from '@/lib/req/ghost';
import {  region, types } from '@/lib/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SingleSelect from '@/components/ui/singleSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useSearchParams } from 'next/navigation';
import { filterFromQueryParams } from '@/lib/functions';
import LocationDropdown from '../ads/LocationDropdown';

export default function    VerticalFilter({
  handleSubmitData
}: {
  handleSubmitData: (data: FilterDto) => void
}) {
  const form = useForm<FilterDto>({resolver: zodResolver(filterDtoSchema as any)});
  const { reset,getValues,watch,setValue,register ,handleSubmit} = form;
  const [types, setTypes] = useState<{types:types,isloading:boolean}>({types:[],isloading:true});
  const searchParams = useSearchParams();
  const [region, setRegion] = useState<region>([]);
  

  useEffect(() => {
    const parsedFilter = filterFromQueryParams(searchParams);
    if (parsedFilter) reset(parsedFilter);
    const fetchCategories = async () => {
      const data = await getTypesByid(1);
      if (data) setTypes(prv=>({...prv,types:data}));
    };
    fetchCategories().then(()=>setTypes(prv=>({...prv,isloading:false})));

    const fetchRegion = async () => {
      const regionData =await getRegions()
      if (regionData){
        setRegion(regionData);
      }
    };
    fetchRegion();
    
  }, []);

  const selectedType = types.types.find(t=>t.id===watch('type.id'))||null;

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
        <div className="w-full ">
          <div className="grid gap-4 grid-cols-1">
            {/* Search */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Recherche</label>
              <input
                {...register("search")}
                type="text"
                placeholder="Rechercher un véhicule..."
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-colorOne"
              />
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Categories</label>
              <SingleSelect placeholder='Select une category' options={types.types.map(t => ({ id: t.id, name: t.name }))} selected={selectedType??null} onChange={(data)=>{if(data){setValue('type.id',data?.id)}else{setValue('type',undefined);}} } />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 border-l-4 pl-2">Région</label>
              <LocationDropdown regions={region} />
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

        {/* Bottom Buttons */}
        <div className=" sticky bg-background rounded-lg bottom-0 p-2 ">
          <span className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-colorOne w-[75%] rounded-4xl p-2 rounded-full font-semibold text-white"
            >
              Rechercher
            </button>
          </span>
        </div>
      </form>
      </FormProvider>
  );
}
