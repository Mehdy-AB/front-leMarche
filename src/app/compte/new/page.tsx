'use client';
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import LineLoader from "@/lib/loaders/LineLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageDnD from "@/components/imageDnD/ImageDnD";
import { CreateAdsFormValues, createAdsSchema } from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import DisplayAtt from "@/components/createAd/DisplayAtt";
import Location from "@/components/createAd/Location";
import SingleSelectString from "@/components/ui/singleSelectString";
import { cn } from "@/lib/utils";
import Category from "@/components/createAd/Category";
import axiosClient from "@/lib/req/axiosClient";
import Loader from "@/lib/loaders/Loader";
const newAd = () => {
    const session = useSession();
    const router = useRouter();
    const [fetchError,setFetchError] = useState<string|undefined>();
    useEffect(() => {
        if (session.status === "unauthenticated") {  
            router.push("/api/auth/signin");
        }
        
    }, [session]);
   
    const form = useForm<CreateAdsFormValues>({
        resolver: zodResolver(createAdsSchema),
        defaultValues: {
            status: "Active",
        },
    });
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = form;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: CreateAdsFormValues) => {
        setIsSubmitting(true);
        
        axiosClient.post('/user/ad', { 
            ...data, 
            attributes: data.attributes?.filter(attr => !!attr.value) 
        }).then(async res => {
            if (res.data.error) {
            setFetchError( res.data.message );
            setIsSubmitting(false);
            return;
            }
            router.push("/");
        }).catch(e => {
            setFetchError( e.response?.data?.error || 'information invalide' );
            setIsSubmitting(false);
        });
        
    }

    if (session.status === "loading" || session.status === "unauthenticated") return <LineLoader />;
    else
    return (
        <main>
        <Header session={session.data} router={router}/>
        <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl border-l-8 pl-1 border-colorOne font-bold mb-8">Déposer une annonce</h1>
        {fetchError && <div className="fixed bottom-4 right-4 flex items-center w-[15%] justify-between p-5 leading-normal text-red-600 bg-red-100 rounded-lg" role="alert">
                    <p>{fetchError}</p>

                    <svg onClick={() => setFetchError(undefined)} className="inline w-4 h-4 fill-current ml-2 hover:opacity-80 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
                    </svg>
                </div>}

        <FormProvider {...form}>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
                <ImageDnD setImages={(data)=>setValue('images',data)} />
                {errors.images ? (
                        <span className="text-red-500 text-xs">
                          {errors.images.message}
                        </span>
                      ):
                <p className="text-xs text-gray-500 mt-1">Ajoutez jusqu'à 10 photos de votre véhicule.</p>}
                
            </div>
            
                
                {/* Attributes */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <DisplayAtt/>
                {errors.attributes && Array.isArray(errors.attributes) ? (
                    <span className="text-red-500 text-xs">Le champ 
                        {errors.attributes.map((e, idx) => (
                            <span key={idx}> {e.value.message} </span>
                        ))} est requis.
                    </span>
                ) : (
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez les caractéristiques de votre véhicule.</p>
                )}
            </div>
            </div>

            {/* Right column - status & org */}
            <div className="space-y-6">

            <div className="border p-4 rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <SingleSelectString
                    
                    options={["Active", "Brouillon"]}
                    selected={getValues().status}
                    onChange={(selected) => setValue('status', selected as "Active"| "Brouillon")}
                    placeholder={"Statut"}
                />
            </div>
            
            {/* Pricing */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <div className="flex flex-col relative gap-2 w-full">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">€</div>        
                <input {...register('price', { valueAsNumber: true })} min={0} type="number" placeholder="Prix" className={cn(
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
                <Location />
                {errors.locationId ? (
                        <span className="text-red-500 text-xs">
                          {errors.locationId.message}
                        </span>
                      ):
                <p className="text-xs text-gray-500 mt-1">Sélectionnez la localisation de votre annonce.</p>}
            </div>

            {/* Category */}
            <div className="border p-4 rounded-lg bg-gray-50">
                <Category />
                {(errors.categoryId ||errors.brandId||errors.modelId||errors.typeId)? (
                        <span className="text-red-500 text-xs">
                          {errors.categoryId?.message||errors.typeId?.message||errors.brandId?.message||errors.modelId?.message}
                        </span>
                      ):
                (<p className="text-xs text-gray-500 mt-1">Cela aide à mieux classer votre annonce.</p>)}
            </div>

            <button type="submit" disabled={!!isSubmitting} className="w-full disabled:bg-gray-300 bg-colorOne text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                {!!isSubmitting?<Loader/>:'Publier l’annonce'}
            </button>
            </div>
        </form>
        </FormProvider>
        </section>

        <Footer/>
        </main>
    );
}
export default newAd;