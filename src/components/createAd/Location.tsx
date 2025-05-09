import { cities, department, region } from "@/lib/types/types";
import SingleSelect from "../ui/singleSelect";
import { useEffect, useState } from "react";
import { getCities, getDepartments, getRegions } from "@/lib/req/ghost";
import Loader from "@/lib/loaders/Loader";
import { useFormContext } from "react-hook-form";
import { CreateAdsFormValues } from "@/lib/validation/all.schema";

export default function Location() {
    const {watch,setValue,clearErrors} = useFormContext<CreateAdsFormValues>();
    const locationId = watch('locationId');

    const [region,setRegion] = useState<region>([]);
    const [regionId,setRegionId] = useState<number|null>(null);
    const [departmentId,setDepartmentId] = useState<number|null>(null);
    const [departments,setDepartments] = useState<department>([]);
    const [cities,setCities] = useState<cities>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [isLoadingT,setIsLoadingT] = useState(0);
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
        setIsLoadingT(1)
        setDepartments([])
        setCities([])
        const fetchDepartments = async () => {
            if(regionId){
                const departments = await getDepartments(regionId);
                if(departments)
                setDepartments(departments)
                setIsLoadingT(0)
                        }
        };
        fetchDepartments();
        }, [regionId]);

    useEffect(() => {
        setIsLoadingT(2)
        setCities([])
        const fetchCities = async () => {
            if(departmentId){
                const cities = await getCities(departmentId);
                if(cities)
                setCities(cities)
                setIsLoadingT(0)
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
                selected={region.find((region) => region.id === regionId)||null}
                onChange={(selected) => setRegionId(selected?.id || 0)}
                placeholder={"region"}
            />
            {(regionId)&&<><label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                {isLoadingT===1?
            <span className="flex justify-center items-center py-1">
                <Loader/>
            </span>
            :<SingleSelect
                options={departments.map((department) => ({
                    id: department.id,name: department.name
                }))}
                selected={departments.find((department) => department.id === departmentId)||null}
                onChange={(selected) => setDepartmentId(selected?.id || 0)}
                placeholder={"departement"}
            />}</>}
            {departmentId&&<><label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                {isLoadingT===1?
            <span className="flex justify-center items-center py-1">
                <Loader/>
            </span>
            :<SingleSelect 
                options={cities.map((city) => ({
                    id: city.id,name: city.name
                }))}
                selected={cities.find((city) => city.id === locationId)||null}
                onChange={(selected) => {setValue('locationId',selected?.id || 0);clearErrors('locationId')}}
                placeholder={"ville"}
            />}</>}
        </>);

}