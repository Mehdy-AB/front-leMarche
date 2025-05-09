import Loader from "@/lib/loaders/Loader";
import { getCities, getDepartments, searchLocation } from "@/lib/req/ghost";
import { brands, region ,department,cities} from "@/lib/types/types";
import { filterEtape2Dto } from "@/lib/validation/all.schema";
import DropDown from "@/components/outher/DropDown";
import { useState } from "react";
import FranceMap from "@/components/map/franceMap";

export const BrandAndlocation=({
    brands,
    region,
    goBack,
    submit
}:{
    brands:brands,
    region:region,
    goBack:()=>void,
    submit:(data:filterEtape2Dto)=>void
})=>{
    
    const [locationViwe,setlocationViwe] =useState<'region'|'departments'|'cities'|'search'>('region')
    const [loaderDPlocation,setLoaderDPLocation] =useState(false)

    const [filteredLocation,setFilteredLocation] =useState<{departments:department,regions:region,cities:cities}|null>(null)

    const [filteredBrand,setFilteredBrand] =useState(brands)
    const [selectedBrand,setSelectedBrand] =useState<brands>([])
    const [selectedLocation,setSelectedLocation] =useState<{id:number,name:string,type:"region"|"city"|"department"}[]>([])
    const [brandDropDown,setBrandDropDown] =useState(false)
    const [locationDropDown,setLocationDropDown] =useState(false)
    const [department,setDepartment] = useState<department>([]);
    const [cities,setCities] = useState<cities>([]);

    const  getCity=async (departmentId:number)=>{
      setLoaderDPLocation(true)
      const cities = await getCities(departmentId)
      if(cities)
      setCities(cities)
      setLoaderDPLocation(false)

    }

    const  getDep=async (regionId:number)=>{
      setLoaderDPLocation(true)
      const department = await getDepartments(regionId)
      if(department)
      setDepartment(department)
      setLoaderDPLocation(false)
    }

    const  searchLoca=async (name:string)=>{
        setLoaderDPLocation(true)
        const data = await searchLocation(name)
        if (data) {
            setFilteredLocation(prv => ({
            ...prv,
            regions: [
                ...(prv?.regions || []),
                ...data.regions.filter(region => !prv?.regions?.some(r => r.id === region.id))
            ],
            departments: [
                ...(prv?.departments || []),
                ...data.departments.filter(department => !prv?.departments?.some(d => d.id === department.id))
            ],
            cities: [
                ...(prv?.cities || []),
                ...data.cities.filter(city => !prv?.cities?.some(c => c.id === city.id))
            ]
            }));
        }
        setLoaderDPLocation(false)
      }

    const filterBrand=(input:string)=>{
        setFilteredBrand(brands.filter(brand => brand.name.toLowerCase().startsWith(input.toLowerCase())));
    }

    const filterLocation=(input:string)=>{
            setFilteredLocation({
                regions:region.filter(r=>r.name.toLowerCase().startsWith(input.toLowerCase())),
                departments:department.filter(d=>d.name.toLowerCase().startsWith(input.toLowerCase())),
                cities:cities.filter(c=>c.name.toLowerCase().startsWith(input.toLowerCase())),
            });
            searchLoca(input)
        }

    return(<>
    <div className="flex flex-col w-full" >
        <div className="grid grid-cols-5">
        <div className="h-64 col-span-2 w-fit">
          <FranceMap/> 
        </div>
        <div className="flex col-span-3 w-full flex-col justify-center">
            <span className="text-lg font-semibold">Où souhaitez-vous acheter votre véhicule</span>
            <div className="flex flex-col relative">
            <input
                id='locationDropDown'
                type="text"
                onChange={(e)=>{if(e.target.value.length>0){filterLocation(e.target.value);setlocationViwe('search')}else setlocationViwe('region')}}
                onFocus={()=>setLocationDropDown(true)}
                placeholder="Sélectionnez votre localisation"
                className="rounded-lg border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
            />
            <div className="flex mt-1 gap-1">{selectedLocation.length>0&&
            selectedLocation.map((reg,index)=>(
            <span key={index} className="rounded-full relative group bg-colorOne px-2 py-1 text-white bg-opacity-50 hover:bg-opacity-80">
                {reg.name}
                <span className="text-xs ml-1">({reg.type})</span>
                <svg onClick={()=>{setSelectedLocation((prv)=>prv.filter((b) => b.id !== reg.id))}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 absolute opacity-0 group-hover:opacity-100 duration-200 transition-all top-0 right-0 cursor-pointer
                bg-white rounded-full text-gray-700 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </span>
            ))
            }</div>
            {locationDropDown&&<DropDown notEff={['locationDropDown']} setIsShow={(data:boolean)=>{setLocationDropDown(data);setlocationViwe('region')}}>
                <div className=" absolute py-2 bg-white w-full flex flex-col max-h-44 overflow-auto border-gray-300 border rounded-lg top-[50px] px-1 shadow-lg">
                    {(!loaderDPlocation||locationViwe==='search')?(<>{locationViwe==='region'&&region.map((reg, index) => (
                            <span key={index} className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>r.id!==reg.id),{type:'region',name:reg.name,id:reg.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{reg.name}</span>
                                <span className="text-sm opacity-0 group-hover:opacity-100 duration-200 transition-opacity w-full flex hover:text-colorOne hover:underline justify-end items-center">
                                    <span className="flex items-center" onClick={(e)=>{e.stopPropagation();getDep(reg.id);setlocationViwe('departments')}}>Aller à department
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        ))}
                    {locationViwe==='departments'&&department.map((dep, index) => (
                            <span key={index} className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>(r.id!==dep.id&&r.name!=='department')),{type:'department',name:dep.name,id:dep.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{dep.name}</span>
                                <span className="text-sm opacity-0 group-hover:opacity-100 duration-200 transition-opacity w-full flex hover:text-colorOne hover:underline justify-end items-center">
                                    <span className="flex items-center" onClick={(e)=>{e.stopPropagation();getCity(dep.id);setlocationViwe('cities')}}>Aller à cities
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        ))}
                    {locationViwe==='cities'&&cities.map((city, index) => (
                            <span key={index} className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>(r.id!==city.id&&r.type!=='city')),{type:'city',name:city.name,id:city.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{city.name}</span>
                            </span>
                        ))}
                    {locationViwe==='search'&&(filteredLocation&&
                        ((filteredLocation?.regions?.length > 0 || filteredLocation?.departments?.length > 0 || filteredLocation?.cities?.length > 0)) ?
                        <>{filteredLocation.regions.map((reg, index) => (
                            <span key={`${index}reg`} className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>r.id!==reg.id),{type:'region',name:reg.name,id:reg.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{reg.name}
                                <span className="text-tiny "> (Region)</span>
                                </span>
                                <span className="text-sm opacity-0 group-hover:opacity-100 duration-200 transition-opacity w-full flex hover:text-colorOne hover:underline justify-end items-center">
                                    <span className="flex items-center" onClick={(e)=>{e.stopPropagation();getDep(reg.id);setlocationViwe('departments')}}>Aller à department
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        ))}
                        {filteredLocation.departments.map((dep, index) => (
                            <span key={`${index}dep`}  className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>(r.id!==dep.id&&r.name!=='department')),{type:'department',name:dep.name,id:dep.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{dep.name}
                                <span className="text-tiny "> (Department)</span>
                                </span>
                                <span className="text-sm opacity-0 group-hover:opacity-100 duration-200 transition-opacity w-full flex hover:text-colorOne hover:underline justify-end items-center">
                                    <span className="flex items-center" onClick={(e)=>{e.stopPropagation();getCity(dep.id);setlocationViwe('cities')}}>Aller à cities
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                </span>
                            </span>
                        ))}
                        {filteredLocation.cities.map((city, index) => (
                            <span key={`${index}city`}  className=" grid grid-cols-2 group rounded-lg px-3 py-1 w-full hover:bg-gray-100 cursor-pointer"
                            onClick={()=>{setSelectedLocation((prv)=>[...prv.filter((r)=>(r.id!==city.id&&r.type!=='city')),{type:'city',name:city.name,id:city.id}]);setLocationDropDown(false);setlocationViwe('region')}}>
                                <span className="text-sm group-hover:text-colorOne group-hover:underline justify-start">{city.name}
                                    <span className="text-tiny "> (City)</span>
                                </span>
                            </span>
                        ))}</>:
                        loaderDPlocation?(<Loader/>):<span className="text-center col-span-3">Cette location n'existe pas</span>
                    
                    )}</>):
                    (<Loader/>)
                    }
                </div>
            </DropDown>}
            </div>
            </div>
        </div>
        
        <span className=" mt-2 text-lg font-semibold">Marque du véhicule</span>
        <div className="relative flex flex-col">
        <input
            id='brandDropDown'
            type="text"
            onChange={(e)=>{filterBrand(e.target.value)}}
            placeholder="Sélectionnez votre marqu"
            onFocus={()=>setBrandDropDown(true)}
            className="rounded-lg border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
        />
        
        <div className="flex mt-1 gap-1">{selectedBrand.length>0&&
        selectedBrand.map((brand,index)=>(
        <span key={index} className="rounded-full relative group bg-colorOne px-2 py-1 text-white bg-opacity-50 hover:bg-opacity-80">
            {brand.name}
            <svg onClick={()=>{setSelectedBrand((prv)=>prv.filter((b) => b.id !== brand.id))}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 absolute opacity-0 group-hover:opacity-100 duration-200 transition-all top-0 right-0 cursor-pointer
             bg-white rounded-full text-gray-700 ">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </span>
        ))
        }</div>
        {brandDropDown&&<DropDown notEff={['brandDropDown']} setIsShow={setBrandDropDown}>
            <div className=" absolute py-2 bg-white w-full grid grid-cols-3 max-h-44 overflow-auto border-gray-300 border rounded-lg top-[50px] px-1 shadow-lg">
            {filteredBrand.length>0?filteredBrand.map((brand, index) => (
                    <span key={index} onClick={()=>{setSelectedBrand((prv)=>[...prv.filter((b)=>b.id!==brand.id),brand]);setBrandDropDown(false)}}
                     className=" flex rounded-lg px-3 py-1 w-full hover:bg-gray-100 hover:underline hover:text-colorOne cursor-pointer">
                        {brand.name}
                    </span>
                )):
                (
                    <span className="text-center col-span-3">Cette marque n'existe pas</span>
                )}
            </div>
        </DropDown>}
        
        </div>
        
        <div className="grid grid-cols-2 mt-6">
        <span className="w-full flex justify-start">
        <button type="button" onClick={goBack} className="bg-gray-300  rounded-4xl p-3 rounded-full  font-semibold ">Retour</button>
        </span>
        <span className="w-full flex justify-end">
        <button type="submit" onClick={()=>submit({locationIds: selectedLocation,brand:selectedBrand.map((b)=>({id:b.id}))})} className="bg-colorOne rounded-4xl p-3 rounded-full font-semibold text-white">Suivant</button>
        </span>
        </div>
        
    </div>
    </>);
}