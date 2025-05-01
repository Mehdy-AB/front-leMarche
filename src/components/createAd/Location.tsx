import { cities, department, region } from "@/lib/types/types";
import SingleSelect from "../ui/singleSelect";
import { useEffect, useState } from "react";
import { getCities, getDepartments, getRegions } from "@/lib/req/ghost";
import Loader from "@/lib/loaders/Loader";

export default function Location({cityId,setCityId}:{
    cityId:number,
    setCityId:(cityId:number)=>void
}) {
    const [region,setRegion] = useState<region>([]);
    const [regionId,setRegionId] = useState<number|null>(null);
    const [departmentId,setDepartmentId] = useState<number|null>(null);
    const [departments,setDepartments] = useState<department>([]);
    const [cities,setCities] = useState<cities>([]);
    const [isLoading,setIsLoading] = useState(true);
    useEffect(() => {
            const fetchdata= async () => {
                const fetchRegion= async () => {
                    const region = await getRegions();
                    if(region)
                    setRegion(region)
                };
                await fetchRegion();
            };
            fetchdata().then(()=>setIsLoading(false))
        }, []);

    useEffect(() => {
        setDepartments([])
        setCities([])
        const fetchDepartments = async () => {
            if(regionId){
                const departments = await getDepartments(regionId);
                if(departments)
                setDepartments(departments)
            }
        };
        fetchDepartments();
        }, [regionId]);

    useEffect(() => {
        setCities([])
        const fetchCities = async () => {
            if(departmentId){
                const cities = await getCities(departmentId);
                if(cities)
                setCities(cities)
            }
        };
        fetchCities();
    }, [departmentId]);

    if(isLoading)
        return(
            <div className="flex justify-center items-center py-4">
                <Loader/>
            </div>
        )
    return (<>
            <label className="block border-l-4 pl-1 border-colorOne font-medium text-gray-700 mb-1">Localisation</label>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <SingleSelect
                options={region.map((region) => ({
                    id: region.id,name: region.name
                }))}
                selected={region.find((region) => region.id === regionId)}
                onChange={(selected) => setRegionId(selected?.id || 0)}
                placeholder={"region"}
            />
            {(regionId&&departments.length>0)&&<><label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <SingleSelect
                options={departments.map((department) => ({
                    id: department.id,name: department.name
                }))}
                selected={departments.find((department) => department.id === departmentId)}
                onChange={(selected) => setDepartmentId(selected?.id || 0)}
                placeholder={"departement"}
            /></>}
            {departmentId&&cities.length>0&&<><label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <SingleSelect
                options={cities.map((city) => ({
                    id: city.id,name: city.name
                }))}
                selected={cities.find((city) => city.id === cityId)}
                onChange={(selected) => setCityId(selected?.id || 0)}
                placeholder={"ville"}
            /></>}
            <p className="text-xs text-gray-500 mt-1">Sélectionnez la localisation de votre annonce.</p>
        </>);

}