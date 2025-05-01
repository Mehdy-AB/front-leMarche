'use client'
import { getBrandsByTypeName, getRegions } from "@/lib/req/ghost"
import { brands, filterAttrbuites, region } from "@/lib/types/types"
import { BrandAndlocation } from "@/components/home/quickSearch/BrandAndlocation"
import { AnimatePresence, motion } from "framer-motion"
import {  useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { filterEtape2Dto } from "../../lib/validation/all.schema"
import Filter from "@/components/home/quickSearch/Filter"
import LineLoader from "../../lib/loaders/LineLoader"
import Digitone from "@/assets/svg/Digitone.svg";
import Digittwo from "@/assets/svg/Digittwo.svg";
import Digitthree from "@/assets/svg/Digitthree.svg";

export default function QuickSearch(){
    const searchParams = useSearchParams();

    const type = searchParams.get('type'); 
    const router = useRouter()
    const [brands,setBrands] = useState<brands>([]);
    const [region,setRegion] = useState<region>([]);
    const [filters, setFilters] = useState<filterAttrbuites>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [etape,setEtape] = useState(0)

    const addParams = (data: filterEtape2Dto) => {
      const params = new URLSearchParams(searchParams.toString())
    
      if (data.brand) {
        params.set('brand',JSON.stringify(data.brand))
      }
    
      if (data.locationIds) {
        params.set('locationIds', JSON.stringify(data.locationIds))
      }
    
      router.push(`?${params.toString()}`)
      setEtape(etape + 1)
    }
    
    const recharche = () => {
      const params = new URLSearchParams(searchParams.toString())
    
      if (filters.length > 0) {
        const filterParams = filters.filter(f=> !!f.value)
        params.set('locationIds', JSON.stringify(filterParams))
      }
    
      router.push(`?${params.toString()}`)
      setEtape(etape + 1)
    }

    const components = [
            <BrandAndlocation submit={addParams} goBack={()=>router.push('/')} brands={brands as brands} region={region as region}/>,
            <Filter submit={()=>{console.log(filters);recharche()}} goBack={()=>router.push('/')} filters={filters} setFilter={setFilters} />
        ]
    const pageDescription =['Indiquez votre région et la marque du véhicule pour voir les annonces les plus pertinentes près de chez vous.']
    
    useEffect(() => {
        if( !type ){
            router.push('/');
            return;
        }
        const fetchdata= async () => {
            const fetchCategories = async () => {
                const brands = await getBrandsByTypeName(type);
                 if (!brands|| brands.length ===0) router.push('/');
                 else setBrands(brands)
            };
            const fetchDepartment= async () => {
                const region = await getRegions();
                if(region)
                setRegion(region)
            };
            await fetchCategories();
            await fetchDepartment();
        };
        fetchdata().then(()=>setIsLoading(false))
    }, []);

    if(isLoading)
        return(<LineLoader/>)
    else
    return(<>
    <section className="flex flex-col w-full items-center pt-[5%] h-screen">
    <div className="flex flex-col  w-[40rem] items-center">
      <h1 className="text-4xl font-semibold text-gray-700">Recherche rapide</h1>
        <div className="mt-4">
          <div className="grid grid-cols-2 justify-start gap-8 px-[100px]">
            <span className="flex w-full">
              <span className={`w-full transition-all duration-500 bg-orange-400 h-[2px]`}/>
            </span>
            
            <span className="flex w-full">
              <span className={`${etape===0?'w-0':'w-full'} transition-all duration-500 bg-orange-400 h-[2px]`}/>
              <span className={`${etape===0?'w-full':'w-0'} transition-all duration-500 bg-gray-400 h-[2px]`}/>
            </span>
          </div>
          <div className="grid gap-16 grid-cols-3">
            <div className={`flex flex-col justify-center items-center`}>
              <span>
                <Digitone className="size-5" />
              </span>
              <span className="text-xs text-center">Choisissez une catégorie pour commencer</span>
            </div>
            <div className={`flex flex-col justify-center items-center text-orange-400`}>
              <span>
                <Digittwo className="size-5" />
              </span>
              <span className="text-xs text-center">Sélectionnez votre localisation et la marque</span>
            </div>
            <div className={`flex flex-col justify-center items-center ${etape>0?'text-orange-400':'text-gray-300'}`}>
              <span>
                <Digitthree className="size-5" />
              </span>
              <span className="text-xs text-center">Choisissez le modèle et les critères spécifiques</span>
            </div>
          </div>
        </div>
        <h4 className="text-sm text-gray-500 mt-6 text-center">{pageDescription[etape]}</h4>

        </div>
        <div className="flex relative flex-col text-gray-600 w-[50rem] items-center h-[32rem]">
        <AnimatePresence mode="wait">
              <motion.div
                key={etape}
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -400, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute w-full h-full flex  flex-col gap-1"
              >
                {components[etape]}
              </motion.div>
        </AnimatePresence>
        </div>
        
    </section>
    </>)
}