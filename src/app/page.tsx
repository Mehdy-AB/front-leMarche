"use client"
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import LineLoader from "../lib/loaders/LineLoader";


export default function Home() {
  const session = useSession();
  const [isloading] = [session.status === "loading"];
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const categories = [
    "Voitures","Utilitaires", "Motos","Équipement auto",
    "Équipement moto","vélos et Équipement", "Caravaning et Équipement", "nautisme et Équipement", "Engin",
     "Services de réparations mécaniques"
  ];
  const adImages=['https://img.leboncoin.fr/api/v1/lbcpb1/images/da/9a/fc/da9afcf7637f4c0271e7c6c64202398efe5f434b.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/57/7a/6d/577a6d799564b4df02e3e4712e7ea933d652ad28.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/a0/b3/96/a0b3962d310b01a86d4a0ee983023ae736a3f54f.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/97/89/8e/97898ee2ea5d02c604f0a56eb238f1dfd9f706e2.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/6e/22/43/6e224315eb3406b3c6ee45df58a09fcd60023ecf.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/b2/11/2a/b2112a9ae95dda72b32b81bbd187635ae75e0f32.jpg?rule=ad-large',
  ]

  const motosImages=['https://img.leboncoin.fr/api/v1/lbcpb1/images/d4/99/5c/d4995c3da6a7f402d7dd033b405889d686bd68bc.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/73/bd/f0/73bdf010ab427a9d9360d770d0bb2e18e3bea6ab.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/62/56/db/6256dbd7e8ffcd7bcc42d76862bcaf476424d329.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/4f/3b/83/4f3b839b7b952992f467c98bf875aeae7dd3e15f.jpg?rule=ad-large'
  ]
  if (isloading) return(<LineLoader/>); 
  return (
    <main className="font-poppins bg-white ">
    <Header session={session?.data} router={router}/>
    {/* Hero Section */}
    <section className="bg-colorOne/10 rounded-xl mt-4 py-16 text-center relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-colorOne">
          Trouvez votre prochain véhicule en un clic !
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Explorez nos meilleures offres.
        </p>

        <div className="relative md:mx-40">
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 max-w-6xl overflow-x-auto scroll-smooth hide-scroll-bar"
          >
            {categories.map((category, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/quickSearch?type=${category}`)}
                className="min-w-[150px] relative shadow-lg rounded-xl group cursor-pointer"
              >
                <img
                  src={`/images/CategoriesVoitures/${category}.jpg`}
                  alt="Category"
                  className="rounded-xl h-28 w-full object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/0 group-hover:bg-colorOne group-hover:opacity-40 opacity-100 transition duration-500 rounded-xl" />
                <span className="absolute inset-0 flex flex-col justify-end p-2 text-white font-semibold transition duration-500">
                  <span className="text-lg text-start">{category}</span>
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>

          </button>
        </div>
      </section>

  
    {/* Annonces Populaires */}
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Annonces populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3,4].map((_, idx) => (
            <div key={idx} className="bg-white hover:bg-gray-100 duration-300 cursor-pointer p-4 rounded-xl shadow">
              <Image
                  src={adImages[idx]}
                  width={500}
                  height={500}
                  className="rounded-xl shadow-md h-40"
                  alt="Picture of the author"
                />
              <h3 className="font-semibold text-lg mt-2">Renault Clio - 2020</h3>
              <p className="text-fontgray text-sm">Paris • 85 000 km • Diesel</p>
              <p className="text-colorOne font-bold mt-2">20 350 €</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Les marques les plus populaires */}
    <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Les marques les plus populaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {["Renault", "Peugeot", "Audi", "Mercedes", "Bmw", "Volkswagen"].map((brand) => (
              <div key={brand} className="relative cursor-pointer flex items-center gap-3 p-4 text-center rounded-xl shadow overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <Image
                  src={`/images/marques/${brand}.png`}
                  width={50}
                  height={50}
                  alt="Picture of the author"
                />
                <p className=" font-semibold">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Dernières Annonces */}
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Dernières annonces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3,4,5,6].map((_, idx) => (
            <div key={idx} className="bg-white cursor-pointer p-4 rounded-xl shadow">
              <Image
                  src={adImages[idx]}
                  width={500}
                  height={500}
                  className="rounded-xl shadow-md h-50"
                  alt="Picture of the author"
                />
              <h3 className="font-semibold mt-2 text-lg">Peugeot 208 - 2019</h3>
              <p className="text-fontgray text-sm">Marseille • 120 000 km • Essence</p>
              <p className="text-colorOne font-bold mt-2">20 200 €</p>
            </div>
          ))}
        </div>
        <span className="flex justify-center mt-6 items-center gap-1">
          <span className="flex items-center gap-1 px-3 shadow-sm py-1 hover:bg-gray-100 duration-300 rounded-xl group cursor-pointer">
            <h6>Voir plus</h6>
            <img src="/svg/arrow.svg" alt="arrow" className="text-foreground group-hover:-rotate-90 duration-300 size-5"/>
          </span>

        </span>
        
      </div>
    </section>

    {/* Les modèles les plus demandés */}
    <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Les modèles les plus demandés</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {["Audi A1", "Peugeot 208", "Audi A3", "Golf 7", "Peugeot 308", "BMW X1"].map((model) => (
              <div key={model} className="relative cursor-pointer grid grid-rows-[auto_auto] items-center justify-center p-4 text-center rounded-xl shadow overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <Image
                src={`/images/voitures/${model}.png`}
                width={120}
                height={120}
                alt="Picture of the author"
              />
              <p className="font-semibold">{model}</p>
            </div>
            ))}
          </div>
        </div>
    </section>
    
    {/* CTA Section */}
    <section className=" relative text-white text-center">
    <Image
                src={`/images/home/adDesktop.jpg`}
                className="w-full z-0 h-full object-cover absolute inset-0"
                width={500}
                height={500}
                alt="Picture of the author"
              />
      <div className="py-24 z-10 w-full bg-colorOne/40 relative">
        <h2 className="text-2xl font-semibold mb-4">Vous avez un véhicule à vendre ?</h2>
        <p className="mb-6">Publiez votre annonce gratuitement en quelques clics.</p>
        <button className="bg-white text-colorOne hover:bg-colorOne hover:text-white px-6 py-3 rounded-full font-medium transition-colors duration-500 ease-in-out">
          Déposer une annonce
        </button>

      </div>
      
    </section>
    
    {/* Annonces Populaires */}
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 pl-2 border-colorOne">Annonces Motos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3,4,5,6,7,8].map((_, idx) => (
            <div key={idx} className="bg-white hover:bg-gray-100 duration-300 cursor-pointer p-4 rounded-xl shadow">
              <Image
                  src={motosImages[idx%4]}
                  width={500}
                  height={500}
                  className="rounded-xl object-cover shadow-md h-40"
                  alt="Picture of the author"
                />
              <h3 className="font-semibold text-lg mt-2">Renault Clio - 2020</h3>
              <p className="text-fontgray text-sm">Paris • 85 000 km • Diesel</p>
              <p className="text-colorOne font-bold mt-2">20 350 €</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Feature Section with Image */}
    <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <Image
              src={`/images/home/Features.png`}
              className="object-cover h-full w-full rounded-xl shadow-md inset-0"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-6 border-l-4 pl-4 border-colorOne">Pourquoi choisir notre plateforme ?</h2>
            <div className="grid grid-cols-2 gap-6 text-base">
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-colorOne">
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Interface intuitive</h3>
                  <p className="text-gray-600 text-sm">Navigation facile pour tous les utilisateurs.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-colorOne">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>

                <div>
                  <h3 className="font-semibold text-lg">Annonces vérifiées</h3>
                  <p className="text-gray-600 text-sm">Contenu fiable et mis à jour régulièrement.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-colorOne">
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
              </svg>
                <div>
                  <h3 className="font-semibold text-lg">Recherche rapide</h3>
                  <p className="text-gray-600 text-sm">Filtrage efficace par type, marque et localisation.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-colorOne">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">Sans commission</h3>
                  <p className="text-gray-600 text-sm">Aucune charge sur les transactions entre utilisateurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
  </main>
  );
}
