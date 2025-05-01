import { categories, types, brands,modeles } from "@/lib/types/types";
import SingleSelect from "../ui/singleSelect";
import { useEffect, useState } from "react";
import { getAllCategories, getBrandsByid, getModelesByid, getTypesByid } from "@/lib/req/ghost";
import Loader from "@/lib/loaders/Loader";

export default function Category({categorieId,setCategorieId,typeId,setTypeId,brandId,setBrandId,modeleId,setModeleId}:{
    categorieId:number,
    setCategorieId:(CategorieId:number)=>void,
    typeId:number,
    setTypeId:(typeId:number)=>void,
    brandId:number,
    setBrandId:(brandId:number)=>void,
    modeleId:number,
    setModeleId:(modeleId:number)=>void
}
) {
    const [categories,setCategories] = useState<categories>([]);
    const [types,setTypes] = useState<types>([]);
    const [brands,setBrands] = useState<brands>([]);
    const [modele,setModele] = useState<modeles>([]);
    const [isLoading,setIsLoading] = useState(true);
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
                    setCategorieId(1)
            })
        }
        , []);

    useEffect(() => {
        setTypes([])
        setBrands([])
        setModele([])
        console.log(categorieId)
        const fetchTypes = async () => {
            if(categorieId){
                const types = await getTypesByid(categorieId);
                if(types)
                setTypes(types)
                console.log(types)
            }
        };
        fetchTypes();
        }
        , [categorieId]);
    
    useEffect(() => {
        setBrands([])
        setModele([])
        const fetchBrands = async () => {
            if(typeId){
                const brands = await getBrandsByid(typeId);
                if(brands)
                setBrands(brands)
            }
        };
        fetchBrands();
        }
        , [typeId]);
    
    useEffect(() => {
        setModele([])
        const fetchModele = async () => {
            if(brandId){
                const modele = await getModelesByid(brandId);
                if(modele)
                setModele(modele)
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
            <label className="block border-l-4 pl-1 border-colorOne font-medium text-gray-700 mb-1">Localisation</label>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <SingleSelect
                options={categories.map((category) => ({
                    id: category.id,name: category.name
                }))}
                selected={categories.find((category) => category.id === categorieId)}
                onChange={(selected) => setCategorieId(selected?.id || 0)}
                placeholder={"Categories"}
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Types</label>
            <SingleSelect
                options={types.map((type) => ({
                    id: type.id,name: type.name
                }))}
                selected={types.find((type) => type.id === typeId)}
                onChange={(selected) => setTypeId(selected?.id || 0)}
                placeholder={"Types"}
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Marques</label>
            <SingleSelect
                options={brands.map((brand) => ({
                    id: brand.id,name: brand.name
                }))}
                selected={brands.find((brand) => brand.id === brandId)}
                onChange={(selected) => setBrandId(selected?.id || 0)}
                placeholder={"Marques"}
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Modeles</label>
            <SingleSelect
                options={modele.map((model) => ({
                    id: model.id,name: model.name
                }))}
                selected={modele.find((model) => model.id === modeleId)}
                onChange={(selected) => setModeleId(selected?.id || 0)}
                placeholder={"Modeles"}
            />
            
        </>);

}