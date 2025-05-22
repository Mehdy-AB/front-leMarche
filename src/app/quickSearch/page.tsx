'use client'

import { getBrandsByname, getRegions, getTypesByid, getTypesByname } from "@/lib/req/ghost"
import { brands, region } from "@/lib/types/types"
import { BrandAndLocation } from "@/components/search/quickSearch/BrandAndlocation"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FilterDto, filterDtoSchema } from "../../lib/validation/all.schema"
import Filter from "@/components/search/quickSearch/Filter"
import LineLoader from "../../lib/loaders/LineLoader"
import Digitone from "@/assets/svg/Digitone.svg";
import Digittwo from "@/assets/svg/Digittwo.svg";
import Digitthree from "@/assets/svg/Digitthree.svg";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { filterToQueryParams } from "@/lib/functions"
import { useMediaQuery } from "@/components/hooks/useMediaQuery"

export default function QuickSearch() {
    const searchParams = useSearchParams();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const form = useForm<FilterDto>({
        mode: "onChange",
        resolver: zodResolver(filterDtoSchema) as any,
        defaultValues: {
            tri: 'plus recent',
        },
    });
    
    const { handleSubmit, setValue, getValues, formState: { errors } } = form;
    const type = searchParams.get('type'); 
    const router = useRouter()
    const [brands, setBrands] = useState<brands>([]);
    const [region, setRegion] = useState<region>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [etape, setEtape] = useState<0|1>(0)
    const [typeId, setTypeId] = useState<number|null>(null)
    const [displayBrands, setDisplayBrands] = useState(false)

    const onSubmit = (data: FilterDto) => {
        const param = filterToQueryParams(data)
        router.push(`/search?${param}`)
    }

    const components = [
        <BrandAndLocation 
            key={0} 
            displayBrands={displayBrands} 
            submit={(data) => {
                if (!typeId) {
                    router.push('/')
                    return;
                }
                setValue('locationIds', data.locationIds);
                setValue('type', {id: typeId, brand: data.brand})
                setEtape(1);
            }} 
            goBack={() => router.push('/')} 
            brands={brands as brands} 
            region={region as region}
        />,
        <Filter 
            key={1} 
            displayBrands={displayBrands} 
            brandsId={getValues('type')?.brand?.map(b => b.id) || []} 
            typeId={typeId || 1} 
            handleSubmit={handleSubmit(onSubmit)} 
            goBack={() => setEtape(0)} 
        />
    ]

    const pageDescription = [
        'Indiquez votre région et la marque du véhicule pour voir les annonces les plus pertinentes près de chez vous.'
    ]
  
    useEffect(() => {
        if (!type) {
            router.push('/');
            return;
        }
        const fetchdata = async () => {
            const fetchType = async () => {
                const data = await getTypesByid(1);
                if (data) {
                    const typess = data.find(t => t.name == type) || null;
                    if (!typess) {
                        router.back();
                        return;
                    }
                    setTypeId(typess?.id)
                    if (typess?.includeBrands)
                        setDisplayBrands(true)
                }
            };
            const fetchCategories = async () => {
                const brands = await getBrandsByname(type);
                if (brands && brands.length > 0) {
                    setBrands(brands);
                    setTypeId(brands[0].typeId)
                }
            };
            const fetchDepartment = async () => {
                const region = await getRegions();
                if (region)
                    setRegion(region)
            };
            await fetchType();
            await fetchCategories();
            await fetchDepartment();
        };
        fetchdata().then(() => setIsLoading(false))
    }, []);

    if (isLoading)
        return <LineLoader />

    return (
        <FormProvider {...form}>
            <section className="flex flex-col w-full items-center pt-[5%] pb-8 md:h-screen px-4">
                <div className="flex flex-col w-full max-w-[40rem] items-center">
                    <h1 className="text-2xl md:text-4xl font-semibold text-gray-700 text-center">
                        Recherche rapide
                    </h1>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 w-full">
                        <div className="grid grid-cols-2 justify-start gap-8 px-4 md:px-[100px]">
                            <span className="flex w-full">
                                <span className="w-full transition-all duration-500 bg-orange-400 h-[2px]"/>
                            </span>
                            
                            <span className="flex w-full">
                                <span className={`${etape === 0 ? 'w-0' : 'w-full'} transition-all duration-500 bg-orange-400 h-[2px]`}/>
                                <span className={`${etape === 0 ? 'w-full' : 'w-0'} transition-all duration-500 bg-gray-400 h-[2px]`}/>
                            </span>
                        </div>
                        
                        <div className="grid gap-4 md:gap-16 grid-cols-3 mt-2">
                            <div className="flex flex-col justify-center items-center">
                                <span>
                                    <Digitone className="size-4 md:size-5" />
                                </span>
                                <span className="text-xs text-center hidden md:block">
                                    Choisissez une catégorie pour commencer
                                </span>
                            </div>
                            
                            <div className={`flex flex-col justify-center items-center ${etape === 0 && 'text-orange-400'}`}>
                                <span>
                                    <Digittwo className="size-4 md:size-5" />
                                </span>
                                <span className="text-xs text-center hidden md:block">
                                    Sélectionnez votre localisation et la marque
                                </span>
                            </div>
                            
                            <div className={`flex flex-col justify-center items-center ${etape > 0 ? 'text-orange-400' : 'text-gray-300'}`}>
                                <span>
                                    <Digitthree className="size-4 md:size-5" />
                                </span>
                                <span className="text-xs text-center hidden md:block">
                                    Choisissez le modèle et les critères spécifiques
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <h4 className="text-sm text-gray-500 mt-4 md:mt-6 text-center">
                        {pageDescription[etape]}
                    </h4>
                </div>
             
                <div className="flex relative flex-col text-gray-600 w-full max-w-[50rem] items-center h-auto md:h-[32rem] mt-4 md:mt-0 px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={etape}
                            initial={{ x: isMobile ? 200 : 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: isMobile ? -200 : -400, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full h-full flex flex-col gap-1"
                        >
                            {components[etape]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </FormProvider>
    )
}