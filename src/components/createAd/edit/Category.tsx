import {brands,modeles } from "@/lib/types/types";
import { useState } from "react";
import {  getModelesByid } from "@/lib/req/ghost";
import Loader from "@/lib/loaders/Loader";
import { useFormContext } from "react-hook-form";
import { CreateAdsFormValues } from "@/lib/validation/all.schema";
import SingleSelect from "@/components/ui/singleSelect";

export default function Category({category,
type,
brands,
mod}:{
category:string
type:string
brands:brands
mod:modeles}) {
    const {watch,setValue,clearErrors} = useFormContext<CreateAdsFormValues>();
    const [modele,setModele] = useState<modeles>(mod);
    const [isLoadingT,setIsLoadingT] = useState(0);
    const brandId = watch('brandId');
    const modeleId = watch('modelId');

    const fetchModele = async (brandId: number) => {
        
        setIsLoadingT(3);
        setValue('modelId',-1)
        setModele([]);
        if(brandId===-1)return;
        if (brandId) {
            const modele = await getModelesByid(brandId);
            if (modele) setModele(modele);
        }
        setIsLoadingT(0);
    };

    return (<>
            <label className="block border-l-4 pl-1 border-colorOne font-medium text-gray-700 mb-1">Type</label>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <div  className="text-sm border px-3 py-2 rounded shadow-xs cursor-not-allowed">{category}</div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Types</label>
            <div className="text-sm border px-3 py-2 rounded shadow-xs cursor-not-allowed" >{type}</div>  
            {brands.length>0&&<><label className="block text-sm font-medium text-gray-700 mb-1">Marques</label>
                {isLoadingT===2?
            <span className="flex justify-center items-center py-1">
                <Loader/>
            </span>
            :<SingleSelect
                options={brands.map((brand) => ({
                    id: brand.id, name: brand.name
                }))}
                selected={brandId?{
                    id: brandId,
                    name: brands.find((brand) => brand.id === brandId)?.name || ""
                }:null}
                onChange={(selected) => {setValue('brandId',selected?.id || -1);fetchModele(selected?.id||-1)}}
                placeholder={"Marques"}
            />}</>}
            {brandId&&modele.length>0&&<><label className="block text-sm font-medium text-gray-700 mb-1">Modeles</label>
                {isLoadingT===3?
                    <span className="flex justify-center items-center py-1">
                        <Loader/>
                    </span>
                    :<SingleSelect
                        options={modele.map((model) => ({
                            id: model.id,name: model.name
                        }))}
                        selected={modeleId?{id:modeleId,name:modele.find((model) => model.id === modeleId)?.name || ""}:null}
                        onChange={(selected) => {
                            setValue('modelId', selected?.id || -1);
                            clearErrors('modelId');
                            clearErrors('brandId');
                            clearErrors('typeId');
                            clearErrors('categoryId');
                        }}
                        placeholder={"Modeles"}
                    />}
            </>}
            
        </>);

}