'use client'

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Filter from "@/components/search/ads/Filter";
import { filterFromQueryParams, filterToQueryParams } from "@/lib/functions";
import { searchAds } from "@/lib/req/ghost";
import { Ads } from "@/lib/types/types";
import { FilterDto } from "@/lib/validation/all.schema";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { OneAd } from "@/components/all/OneAd";
import { useLocalSearchStorage } from "@/components/hooks/useLocalSearchStorage";
export default function ProductsPage() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSearch, saveSearchHistory } = useLocalSearchStorage();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const initialPage = Number(searchParams.get('page')) || 0
  const [page, setPage] = useState(initialPage)
  const [ads, setAds] = useState<Ads>([]);
  const [save, setSave] = useState<Boolean>(true);
  const [showSave, setShowSave] = useState<Boolean>(false);
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('page', String(page))
    router.replace(`?${params.toString()}`)
  }, [page])

  useEffect(()=>{
    const parsedFilter = filterFromQueryParams(searchParams); 
    saveSearchHistory(parsedFilter??{})
    const fetchAds=async()=>{
      await searchAds(parsedFilter, 33,page*32).then((ads) => {
        setAds(ads || []);
        setLoading(false);
      });
    }
    fetchAds();
  },[])

  const recharche = (data: FilterDto) => {
    saveSearchHistory(data)
    setSave(true)
    const query = filterToQueryParams(data);
    router.push(`/search?${query}`);
    setPage(0);
    searchAds(data, 33,0).then((ads) => {
      setAds(ads || []);
      setLoading(false);
    });
  };

  const saveCurrentrecharche = () => {
    const parsedFilter = filterFromQueryParams(searchParams); 
    saveSearch(parsedFilter??{},title)
    setShowSave(false)
  };

  return (
    <main className="font-poppins relative">
      {save&&
      <div className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2">
        <button onClick={()=>{setShowSave(true)}} className=" relative group rounded-full text-white items-center flex shadow-md justify-between bg-colorOne py-2 px-3 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          Enregistrer cette recherche
          <svg onClick={(e)=>{e.stopPropagation(); setSave(false)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 opacity-0 group-hover:opacity-100 duration-200 transition-all rounded-full bg-white p-[1px] text-gray-600 absolute top-0 right-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>}
      {showSave&&
        <div onClick={()=>{setShowSave(false)}} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div onClick={(e)=>{e.stopPropagation()}} className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-start border-l-4  border-colorOne pl-2">
            Enregistrer cette recherche
          </h2>

          <label className="block text-sm font-medium mb-1 text-gray-600">
            Titre de la recherche
          </label>
          <input
            type="text"
            placeholder="Par ex. Voiture Peugeot <10k€"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-colorOne"
          />

          <div className="flex justify-between gap-2 mt-6">
            <button
              onClick={()=>{setShowSave(false)}}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-full font-medium"
            >
              Annuler
            </button>
            <button
              onClick={saveCurrentrecharche}
              disabled={!title.trim()}
              className="w-full bg-colorOne hover:brightness-110 text-white py-2 rounded-full font-medium disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>}
      <Header session={session?.data} />
        {/* Page Header */}
        <section className="border-b border-blue-100 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-colorOne">Annonces de véhicules</h1>
            <p className="text-gray-600 mt-2">Découvrez notre sélection de véhicules disponibles en France</p>
          </div>
        </section>

        {/* Filters */}
        <Filter handleSubmitData={recharche} />
      {/* Results Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">
            Annonces de véhicules: France
          </h2>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="border border-gray-300 rounded-xl shadow-sm animate-pulse overflow-hidden">
                  <div className="w-full h-40 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-5 bg-gray-300 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="max-w-5xl mx-auto mt-16 mb-24 flex flex-col items-center text-center px-6">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.slice(0, 32).map((ad, idx) => (
                <OneAd key={idx} ad={ad} setAds={setAds}/>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {!loading && (
        <nav className="flex items-center justify-center gap-2 mt-8">
           
            <button
            disabled={page ===0 }
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
                disabled={(page!==p&&ads.length < 33)}
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
        </nav>
      )}
      <Footer />
    </main>
  );
}
