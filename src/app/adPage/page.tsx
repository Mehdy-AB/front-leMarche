'use client'
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AdPage() {
  const session = useSession();
  const router = useRouter();
  
  const adImages=['https://img.leboncoin.fr/api/v1/lbcpb1/images/da/9a/fc/da9afcf7637f4c0271e7c6c64202398efe5f434b.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/57/7a/6d/577a6d799564b4df02e3e4712e7ea933d652ad28.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/a0/b3/96/a0b3962d310b01a86d4a0ee983023ae736a3f54f.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/97/89/8e/97898ee2ea5d02c604f0a56eb238f1dfd9f706e2.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/6e/22/43/6e224315eb3406b3c6ee45df58a09fcd60023ecf.jpg?rule=ad-large','https://img.leboncoin.fr/api/v1/lbcpb1/images/b2/11/2a/b2112a9ae95dda72b32b81bbd187635ae75e0f32.jpg?rule=ad-large',
  ]
  const adsImages=['https://img.leboncoin.fr/api/v1/lbcpb1/images/21/98/e6/2198e6a5f32f44303148d9323483df9b43fe0d99.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/04/02/e4/0402e40dddb69b730e78c69d25fce5acdae24350.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/d9/81/ab/d981ab8b4ff23186d1c100583decce45cfc0d10d.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/7f/70/29/7f7029764e169cc01f225ce0513d81bcc1d71764.jpg?rule=ad-large',
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/86/c6/2f/86c62fb63b484d72de80ea73918370dc4bfd5f99.jpg?rule=ad-large'
  ]
  return (
    <main className="font-poppins">
      <Header session={session?.data} router={router}/>

      {/* Header placeholder */}
      <div className="max-w-7xl mt-16 mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Image gallery */}
          <div className="col-span-2 flex flex-col">
            {/* Ad title, price and metadata */}
            <div className="mt-6">
                <h1 className="text-2xl font-bold mb-1 border-l-[10px] pl-2 border-colorOne ">Audi A6 Allroad 3.0 TDI</h1>
                <p className="text-lg font-semibold text-colorOne">18 490 €</p>
                <p className="text-sm text-gray-600">Annecy • 2013 • 165 500 km • Diesel</p>
                <p className="text-xs text-gray-400">Publié le 20 avril 2024</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((_, i) => (
                <img
                  key={i}
                  src={adsImages[i]}
                  className="rounded-lg w-full h-40 object-cover"
                  alt="Vehicle"
                />
              ))}
            </div>
            <button className="mt-2 mx-auto px-3 py-1 text-sm text-white  bg-colorOne rounded-full font-medium">Voir les photos</button>
          </div>

          {/* Seller Info */}
          <aside className="border rounded-lg p-4 shadow-md">
            <Image height={200} width={200} src='/images/mehdi.jpg' alt="Voiture" className="rounded-full mx-auto object-cover" />
            <div className="font-semibold text-lg">Mehdi Aoune</div>
            <div className="text-sm text-gray-600 mb-2">Répond en moyenne en 6 heures</div>
            <button className="w-full mb-2 bg-colorOne/90 rounded-xl py-2 flex justify-center items-center hover:bg-colorOne text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
              </svg>
              Envoyer un message</button>
            <button className="w-full text-colorOne border-dashed border rounded-xl items-center flex justify-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              Voir le numéro</button>
          </aside>
        </div>

        

        {/* Vehicle characteristics */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {[
            ["Marque", "AUDI"],
            ["Modèle", "A6"],
            ["Année", "2013"],
            ["Kilométrage", "165500 km"],
            ["Énergie", "Diesel"],
            ["Boîte de vitesse", "Automatique"],
            ["Nombre de places", "5"],
            ["Mise en circulation", "09/2013"],
            ["Crit’Air", "2"],
            ["Puissance fiscale", "11 CV"],
            ["Chevaux DIN", "204 Ch"],
            ["Couleur", "Gris"],
          ].map(([key, value], i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span className="text-gray-500">{key}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 text-sm">
            Je vends mon audi a6 allroad 3.0 tdi v6 204ch de 11/2013 avec nombreux extras et en très bon état.
            <br />Voiture qui dort toujours dans le garage.
            <br />Elle est dans un très bon état sans gros parcours.
            <br />Elle dispose d’un différentiel quattro, de sièges chauffants à l’avant et à l’arrière, d’un chauffage stationnaire avec clé…
          </p>
        </div>

        {/* Similaire Ads */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">Ces annonces peuvent vous intéresser</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="border rounded-lg p-2 shadow-sm">
                <img src={adImages[idx]} alt="Voiture" className="rounded-lg w-full h-32 object-cover" />
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">Audi A6 Avant</h4>
                  <p className="text-sm text-colorOne font-bold">17 490 €</p>
                  <p className="text-xs text-gray-600">Paris • 2016 • 130 000 km</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
