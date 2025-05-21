import { categories, types, brands,modeles } from "@/lib/types/types";
import SingleSelect from "../ui/singleSelect";
import { useEffect, useState } from "react";
import { getAllCategories, getBrandsByid, getModelesByid, getTypesByid } from "@/lib/req/ghost";
import Loader from "@/lib/loaders/Loader";
import { useFormContext } from "react-hook-form";
import { CreateAdsFormValues } from "@/lib/validation/all.schema";

export default function Category() {
    const {watch,setValue,clearErrors} = useFormContext<CreateAdsFormValues>();
    const [categories,setCategories] = useState<categories>([]);
    const [types,setTypes] = useState<types>([]);
    const [brands,setBrands] = useState<brands>([]);
    const [displayBrands,setDisplayBrands]=useState(false)
    const [modele,setModele] = useState<{
        id: number;
        name: string;
    }[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [isLoadingT,setIsLoadingT] = useState(0);
    const categorieId = watch('categoryId');
    const typeId = watch('typeId');
    const brandId = watch('brandId');
    const modeleId = watch('modelId');
    useEffect(() => {
            const fetchdata= async () => {
                const fetchCategories= async () => {
                    const categories = await getAllCategories();
                    if(categories)
                    setCategories(categories)
                };
                await fetchCategories();
            };
            fetchdata().then(()=>{
                    setIsLoading(false);
            })
            setValue('categoryId',0)
        }
        
        , []);

    useEffect(() => {
        setIsLoadingT(1)
        setTypes([])
        setBrands([])
        setModele([])
        const fetchTypes = async () => {
            if(categorieId){
                const types = await getTypesByid(categorieId);
                if(types)
                setTypes(types)
                setIsLoadingT(0)
            }
        };
        fetchTypes();
        
        }
        , [categorieId]);
    
    useEffect(() => {
        setIsLoadingT(2)
        setBrands([])
        setModele([])
        const fetchBrands = async () => {
            if(typeId){
                const brands = await getBrandsByid(typeId);
                if(brands)
                setBrands(brands)
                setIsLoadingT(0)
            }
        };
        const type=types.find(t=>t.id===typeId);
        if(type && type?.includeBrands){
            setDisplayBrands(true)
            fetchBrands();
        }else{setDisplayBrands(false)}
        
        }
        , [typeId]);
    
    useEffect(() => {
        setIsLoadingT(3)
        setModele([])
        const fetchModele = async () => {
            if(brandId){
                const modele = await getModelesByid(brandId);
                if(modele&&modele[0])
                setModele(modele[0].models)
                setIsLoadingT(0)
            }
        };
        fetchModele();
        }
        , [brandId]);

    if(isLoading)
        return(
            <div className="flex justify-center items-center py-4">
                <Loader/>
            </div>
        )
    return (<>
            <label className="block border-l-4 pl-1 border-colorOne font-medium text-gray-700 mb-1">Type</label>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <SingleSelect
                options={categories.map((category) => ({
                    id: category.id, name: category.name
                }))}
                selected={categorieId?{
                    id: categorieId,
                    name: categories.find((category) => category.id === categorieId)?.name || ""
                }: null}
                onChange={(selected) => {
                    if(selected)setValue('categoryId',selected?.id );
                    else {
                        setValue('categoryId',undefined );
                        setValue('typeId',undefined );
                        setValue('brandId',undefined );
                        setValue('modelId',undefined );
                        setBrands([])
                        setModele([])
                    }
                }}
                placeholder={"Categories"}
            />
            {!!categorieId&&(<><label className="block text-sm font-medium text-gray-700 mb-1">Types</label>
                {isLoadingT===1?
                <span className="flex justify-center items-center py-1">
                    <Loader/>
                </span>
                :<SingleSelect
                    options={types.map((type) => ({
                        id: type.id, name: type.name
                    }))}
                    selected={typeId?{
                        id: typeId,
                        name: types.find((type) => type.id === typeId)?.name || ""
                    }:null}
                    onChange={(selected) => {
                        if(selected)setValue('typeId',selected?.id );
                    else {
                        setValue('typeId',undefined );
                        setValue('brandId',undefined );
                        setValue('modelId',undefined );
                        setBrands([])
                        setModele([])
                    }
                    }}
                    placeholder={"Types"}
                />}</>)}
            {typeId&&displayBrands&&<><label className="block text-sm font-medium text-gray-700 mb-1">Marques</label>
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
                onChange={(selected) => {
                    if(selected)setValue('brandId',selected.id );
                    else {
                        setValue('brandId',undefined );
                        setValue('modelId',undefined );
                        setBrands([])
                        setModele([])
                    }
                }}
                placeholder={"Marques"}
            />}</>}
            {brandId&&displayBrands&&typeId&&categorieId&&<><label className="block text-sm font-medium text-gray-700 mb-1">Modeles</label>
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
                    
                    if(selected){
                        setValue('modelId', selected?.id);
                        clearErrors('modelId');
                        clearErrors('brandId');
                        clearErrors('typeId');
                        clearErrors('categoryId');
                    }
                    else {
                        setValue('modelId',undefined );
                    }
                }}
                placeholder={"Modeles"}
            />}</>}
            
        </>);

}