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
import { favoriteAd, unfavoriteAd } from "@/lib/req/user";
import { array } from "zod";
export default function ProductsPage() {
  const session = useSession();
  const router = useRouter();
  const ad = 
    {
      id: 1,
      title: "iPhone 13 Pro Max 256GB",
      image: "https://res.cloudinary.com/du6pu6foq/image/upload/v1746369582/mgwk5mloiy0tycm10gpr.jpg",
      views: 123,
      price: 950,
      date: "2025-04-22",
    }
    // Add more ads here
  return (
    <main className="font-poppins">
      <Header session={session?.data} router={router} />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Main Ads Section */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Mes Annonces</h2>

        {Array.from({ length: 12 }).map((_,idx) => (
          <div key={idx} className="flex border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-32 h-32 object-cover"
            />
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{ad.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Publié le {ad.date}</p>
              </div>
              <p className="text-colorOne font-bold">{ad.price} €</p>
            </div>
            <div className="w-40 bg-gray-50 p-4 border-l text-sm text-gray-600 flex flex-col justify-between">
              <p><span className="font-medium">Vues:</span> {ad.views}</p>
              <div className="space-x-2 text-sm text-blue-600">
                <button className="hover:underline">Modifier</button>
                <button className="text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-50 p-4 border rounded-xl h-fit">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Filtres</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select className="w-full border rounded p-2 text-sm">
              <option>Tous</option>
              <option>Actifs</option>
              <option>Inactifs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tri</label>
            <select className="w-full border rounded p-2 text-sm">
              <option>Plus récent</option>
              <option>Plus de vues</option>
              <option>Prix décroissant</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
      <Footer />
    </main>
  );
}
