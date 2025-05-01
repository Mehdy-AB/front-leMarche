'use client'
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const session = useSession();
    const router = useRouter();
  const adImages=['https://img.leboncoin.fr/api/v1/lbcpb1/images/da/9a/fc/da9afcf7637f4c0271e7c6c64202398efe5f434b.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/57/7a/6d/577a6d799564b4df02e3e4712e7ea933d652ad28.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/a0/b3/96/a0b3962d310b01a86d4a0ee983023ae736a3f54f.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/97/89/8e/97898ee2ea5d02c604f0a56eb238f1dfd9f706e2.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/6e/22/43/6e224315eb3406b3c6ee45df58a09fcd60023ecf.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/b2/11/2a/b2112a9ae95dda72b32b81bbd187635ae75e0f32.jpg?rule=ad-large',
  ]
    return (
      <main className="font-poppins">
        <Header session={session?.data} router={router}/>
        
        {/* Page Header */}
        <section className="border-b border-blue-100 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-colorOne">Annonces de véhicules</h1>
            <p className="text-gray-600 mt-2">Découvrez notre sélection de véhicules disponibles en France</p>
          </div>
        </section>
  
        {/* Filters Bar */}
        <section className="bg-gray-50 py-4 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 justify-evenly items-center">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Rechercher un véhicule..."
              className="px-4 py-2 rounded-lg border border-blue-700/10 w-full md:w-1/4"
            />

            {/* Type Select */}
            <select className="px-4 py-2 rounded-lg border border-blue-700/10 w-full md:w-auto">
              <option>Type</option>
              <option>Voiture</option>
              <option>Moto</option>
              <option>Utilitaire</option>
            </select>

            {/* Region Select */}
            <select className="px-4 py-2 rounded-lg border border-blue-700/10 w-full md:w-auto">
              <option>Région</option>
              <option>Alger</option>
              <option>Oran</option>
              <option>Constantine</option>
            </select>

            {/* Sort By */}
            <select className="px-4 py-2 rounded-lg border border-blue-700/10 w-full md:w-auto">
              <option>Trier par</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="recent">Plus récentes</option>
            </select>

            {/* Filter Button */}
            <button className="px-4 flex py-2 border border-blue-700/10 hover:bg-gray-100 rounded-lg transition w-full items-center md:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
              Filtres
            </button>

            {/* Search Button */}
            <button className="px-6 py-2 bg-colorOne text-white rounded-full hover:bg-orange-600 transition w-full md:w-auto">
              Rechercher
            </button>
          </div>
        </section>
  
        {/* Products Grid */}
        <section className="py-10">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Annonces de véhicules: France</h2>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(32)].map((_, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <img src={adImages[idx%6]} alt="Produit" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">Peugeot 208</h3>
                  <p className="text-sm text-gray-600">Essence · 2022 · 30,000 km</p>
                  <p className="text-colorOne font-bold mt-2">20 100 €</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <nav className="flex items-center w-full justify-center gap-x-1" aria-label="Pagination">
          <button type="button" className="min-h-9.5 shadow-md min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous">
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="sr-only">Previous</span>
          </button>
          <div className="flex items-center gap-x-1">
            <button type="button" className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-b-lg border-t-2 border-t-colorOne focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" aria-current="page">1</button>
            <button type="button" className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg  focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">2</button>
            <button type="button" className="min-h-9.5 min-w-9.5 flex justify-center items-center border border-gray-200 text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">3</button>
          </div>
          <button type="button" className="min-h-9.5 shadow-md min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" aria-label="Next">
            <span className="sr-only">Next</span>
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </nav>
        <Footer/>
      </main>
    );
  }
  