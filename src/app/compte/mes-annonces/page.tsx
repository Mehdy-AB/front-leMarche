'use client'

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import VerticalFilter from "@/components/search/compte/VerticalFilter";
import { Button } from "@/components/ui/button";
import { filterFromQueryParams, filterToQueryParams } from "@/lib/functions";
import { getMyAds } from "@/lib/req/user";
import { MesAds } from "@/lib/types/types";
import { FilterDto } from "@/lib/validation/all.schema";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);


export default function ProductsPage() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 0
  const [page, setPage] = useState(initialPage)
  const [ads, setAds] = useState<MesAds>([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(()=>{
      const parsedFilter = filterFromQueryParams(searchParams); 
      if(!session||!session.data?.user.id){
        if(session.status==='loading')return
        router.back();
        return;
      }
      getMyAds(parsedFilter??{}, 33,page*32).then((ads) => {
        setAds(ads);
        setLoading(false);
      });
    },[session]) 
  
    const recharche = (data: FilterDto) => {
      if(!session||!session.data?.user.id){
        if(session.status==='loading')return
        router.back();
        return;
      }
      const query = filterToQueryParams(data);
      router.push(`/compte/mes-annonces?${query}`);
      setPage(0);
      getMyAds(data, 33,0).then((ads) => {
        setAds(ads || []);
        setLoading(false);
      });
    };

    useEffect(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set('page', String(page))
      router.replace(`?${params.toString()}`)
    }, [page])

  return (
    <main className="font-poppins bg-gray-50 min-h-screen">
      <Header session={session?.data} />

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main Ads Section */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Mes Annonces</h2>

          {ads.length>0?ads.map((ad) => (
            <div key={ad.id} className="relative">
              <Link
                href={`http://localhost:3000/ad/${ad.id}`}
                key={ad.id}
                className="bg-white group cursor-pointer border rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row overflow-hidden relative group"
              >
                {/* Image with overlay actions */}
                <div className="relative w-full sm:w-64 h-52 sm:h-auto">
                  <Image
                    fill
                    src={ad.media[0].media.url}
                    alt={ad.title}
                    className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2 text-white" />

                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex group-hover:text-colorOne justify-between items-start gap-2">
                      <h3 className="font-semibold text-lg  line-clamp-1">{ad.title}</h3>
                      <span className={`text-xs bg-green-100 ${ad.status === 'Active' ? 'text-green-700' : 'text-yellow-300'} px-2 py-0.5 rounded font-medium`}>
                        {ad.status}
                      </span>
                    </div>

                    <p className="text-xl text-colorOne font-bold mt-1">
                      {ad.price.toLocaleString()} €
                    </p>

                    {/* <div className="flex flex-wrap gap-2 mt-2 text-xs">
      {ad.isPro && (
        <span className="inline-flex items-center border px-2 py-0.5 rounded text-blue-600 border-blue-600 font-medium">
          🏢 Pro
        </span>
      )}
      {ad.isRecent && (
        <span className="inline-flex items-center bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-medium">
          🔥 Occasion récente
        </span>
      )}
    </div> */}

                    <div className="grid grid-cols-2 sm:grid-cols-4 text-sm text-gray-600 mt-4 gap-y-1">
                      {ad.attributes
                        .filter(attr => [1, 2, 3, 5].includes(attr.attribute.id))
                        .map((attr, idx) => attr.attribute.type === 'SELECT' && attr.option
                          ? (<p key={idx} className="flex flex-col"><strong>{attr.attribute.name}</strong> {attr.option.value}</p>)
                          : (<p key={idx} className="flex flex-col"><strong>{attr.attribute.name}</strong> {`${attr.value}${attr.attribute.unit ? ` ${attr.attribute.unit}` : ''}`}</p>)
                        )}
                    </div>

                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p>Publié le  {new Date(ad.createdAt).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p>Modifié le {new Date(ad.updatedAt).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Actions + Views */}
                  <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                    <div className="grid grid-cols-2 text-center gap-2 text-sm text-gray-500">
                      <div>
                        <strong>Vues</strong>
                        <div>{ad?.views}</div>
                      </div>
                      <div>
                        <strong>Favoris</strong>
                        <div>{ad?._count.favoritesBy}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
              <div className="absolute bottom-2 right-2 z-20">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="p-1" onClick={(e) => { e.stopPropagation(); } }>
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-2 bg-white shadow-md border rounded z-10 space-y-1">
                    <button className="flex items-center gap-2 w-full text-colorOne hover:text-white hover:bg-colorOne p-2 rounded transition-all text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>

                      Modifier
                    </button>
                    <button className="flex items-center gap-2 w-full text-red-500 hover:text-white hover:bg-red-500 p-2 rounded transition-all text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>

                      Supprimer
                    </button>
                    <button className="flex items-center gap-2 w-full text-blue-600 hover:text-white hover:bg-blue-600 p-2 rounded transition-all px-2 py-1 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Renouveler
                    </button>
                    <button className="flex items-center gap-2 w-full text-yellow-600 hover:text-white hover:bg-yellow-600 p-2 rounded transition-all px-2 py-1 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Pause
                    </button>
                  </PopoverContent>
                </Popover>
              </div>

            </div>
          )):
          loading?
           [1,2].map((_,idx)=><div key={idx} className="bg-white border rounded-xl shadow-sm flex flex-col sm:flex-row overflow-hidden animate-pulse">
              {/* Image Placeholder */}
              <div className="relative w-full sm:w-64 h-52 sm:h-auto bg-gray-200">
                <Skeleton className="w-full h-full" />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-6 w-3/5 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>

                  <Skeleton className="h-6 w-24 mt-2 rounded" />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-24 rounded" />
                    ))}
                  </div>

                  <div className="mt-4 space-y-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="grid grid-cols-2 text-center gap-2">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </div>)
          :<div className="max-w-5xl mx-auto mt-16 mb-24 flex flex-col items-center text-center px-6">
                        <div className="flex items-center gap-4">
                          <Image alt="no-result" width={400} height={400} src='/images/no-result.png' className="h-full"/>
                          <div className="text-left">
                            <h2 className="text-2xl font-bold text-gray-800">Oups ! Aucune annonce trouvée</h2>
                            <p className="text-gray-600 mt-2 max-w-md">
                              Nous n’avons trouvé aucun véhicule correspondant à vos critères. Essayez de modifier vos filtres pour élargir la recherche.
                            </p>
                            <button
                              onClick={() => recharche({})}
                              className="mt-6 bg-colorOne text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                            >
                              Réinitialiser les filtres
                            </button>
                          </div>
                        </div>
                      </div>}
          {!loading&&<nav className="flex items-center justify-center gap-2 mt-8">

                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(p - 1, 0))}
                  className="px-4 py-2 text-sm disabled:opacity-50 disabled:pointer-events-none rounded-lg border bg-white text-gray-800 hover:bg-gray-100"
                >
                  Précédent
                </button>

                {[0, 1, 2].map((offset) => {
                  const p = page === 0 ? page + offset : page - 1 + offset;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      disabled={(page !== p && ads.length < 33)}
                      className={`px-3 py-2 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none border ${p === page ? 'bg-colorOne text-white' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      {p + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={ads.length < 33}
                  className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Suivant
                </button>
              </nav>}
        </div>

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 bg-white p-4 border rounded-xl h-fit shadow-sm">
          <VerticalFilter handleSubmitData={recharche} />
        </aside>
      </div>

      <Footer />
    </main>
  );
}
