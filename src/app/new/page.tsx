'use client';
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Loader from "@/lib/loaders/LineLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ImageDnD from "@/components/imageDnD/ImageDnD";
import { CreateAdsFormValues, createAdsSchema } from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DisplayAtt from "@/components/createAd/DisplayAtt";
import Location from "@/components/createAd/Location";
import SingleSelectString from "@/components/ui/singleSelectString";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Category from "@/components/createAd/Category";
const newAd = () => {
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [session]);
    const {
         register,
         handleSubmit,
         setError,
         getValues,
         setValue,
         formState: { errors,isSubmitting,isValid },
       } = useForm<CreateAdsFormValues>({resolver:zodResolver(createAdsSchema)})

    if (session.status === "loading" || session.status === "unauthenticated") return <Loader />;
    else
    return (
        <main>
        <Header session={session.data} router={router}/>
        <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl border-l-8 pl-1 border-colorOne font-bold mb-8">Déposer une annonce</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column - main form */}
            <div className="lg:col-span-2 space-y-6">

            {/* Title */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input {...register('title')} type="text" placeholder="Ex: Toyota Corolla 2020" className="w-full p-3 border border-gray-300 rounded-md" />
                {errors.title ? (
                        <span className="text-red-500 text-xs">
                          {errors.title.message}
                        </span>
                      ):
                <p className="text-xs text-gray-500 mt-1">Soyez clair et précis.</p>}
            </div>

            {/* Description */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} rows={5} placeholder="Décrivez votre véhicule..." className="w-full p-3 border border-gray-300 rounded-md" />
                {errors.description ? (
                        <span className="text-red-500 text-xs">
                          {errors.description.message}
                        </span>
                      ):
                 <p className="text-xs text-gray-500 mt-1">Ajoutez les détails importants (kilométrage, état, options...).</p>}
                
            </div>

            {/* Media */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                <ImageDnD />
            </div>
            
                
                {/* Attributes */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <DisplayAtt/>
            </div>
            </div>

            {/* Right column - status & org */}
            <div className="space-y-6">

            <div className="border p-4 rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <SingleSelectString
                    
                    options={["ACTIVE", "SOLD", "HIDDEN"]}
                    selected={getValues().status}
                    onChange={(selected) => setValue('status', selected as "ACTIVE"| "SOLD"|"HIDDEN")}
                    placeholder={"Statut"}
                />
            </div>
            
            {/* Pricing */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <div className="flex flex-col relative gap-2 w-full">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">€</div>        
                <Input {...register('price')} min={0} type="number" placeholder="Prix" className={cn(
                          "w-full border bg-white border-gray-300 rounded-md py-3 p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500")} />
                </div>
                {errors.price ? (
                        <span className="text-red-500 text-xs">
                          {errors.price.message}
                        </span>
                      ):
                <p className="text-xs text-gray-500 mt-1">Indiquez le prix de votre véhicule.</p>}
            </div>

            <div className="border p-4 rounded-lg bg-gray-50">
                <Location cityId={getValues().locationId} setCityId={(city)=>setValue('locationId',city)} />
            </div>

            {/* Category */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <Category 
                 categorieId={getValues().categoryId}
                 setCategorieId={(id) => setValue('categoryId', id)}
                    typeId={getValues().typeId}
                    setTypeId={(id) => setValue('typeId', id)}
                    brandId={getValues().brandId}
                    setBrandId={(id) => setValue('brandId', id)}
                    modeleId={getValues().modelId}
                    setModeleId={(id) => setValue('modelId', id)}
                 />
                <p className="text-xs text-gray-500 mt-1">Cela aide à mieux classer votre annonce.</p>
            </div>

            <button disabled={!isValid} className="w-full disabled:bg-gray-300 bg-colorOne text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                Publier l’annonce
            </button>
            </div>
        </div>
        </section>

        <Footer/>
        </main>
    );
}
export default newAd;