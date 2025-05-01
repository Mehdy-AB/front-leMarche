"use client"
import { useSession } from "next-auth/react";


export default function Home() {
  const session = useSession();

  return (
    <main className="font-poppins bg-white text-black">
    {/* Header */}
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-[#ff5722]">Le Marché</h1>
      <div className="flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Rechercher un véhicule..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5722]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-[#ff5722]" title="Notifications">🔔</button>
        <button className="text-gray-600 hover:text-[#ff5722]" title="Messages">💬</button>
        <button className="text-gray-600 hover:text-[#ff5722]" title="Favoris">❤️</button>
        <button className="bg-[#ff5722] text-white px-4 py-2 rounded-full hover:bg-[#e64a19]">Connexion</button>
      </div>
    </header>

    {/* Hero Section */}
    <section className="bg-orange-100 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#ff5722]">
        Trouvez votre prochain véhicule en un clic !
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Voitures, motos, vélos, utilitaires… neufs ou d’occasion partout en Algérie.
      </p>
      <button className="bg-[#ff5722] text-white px-6 py-3 rounded-full hover:bg-[#e64a19] transition">
        Commencer la recherche
      </button>
    </section>

    {/* Type Selection */}
    <section className="py-12 max-w-5xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-8">Recherche rapide</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '🚗', label: 'Voiture' },
          { icon: '🛵', label: 'Moto' },
          { icon: '🚚', label: 'Utilitaire' },
          { icon: '🚲', label: 'Vélo' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center bg-gray-100 hover:bg-orange-50 p-6 rounded-2xl shadow"
          >
            <span className="text-4xl mb-2">{icon}</span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </section>

    {/* Dernières Annonces */}
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Dernières annonces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow">
              <div className="h-40 bg-gray-200 mb-4 rounded"></div>
              <h3 className="font-semibold text-lg">Peugeot 208 - 2019</h3>
              <p className="text-gray-600 text-sm">Alger • 120 000 km • Essence</p>
              <p className="text-[#ff5722] font-bold mt-2">1 200 000 DA</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Annonces Populaires */}
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Annonces populaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow">
              <div className="h-40 bg-gray-200 mb-4 rounded"></div>
              <h3 className="font-semibold text-lg">Renault Clio - 2020</h3>
              <p className="text-gray-600 text-sm">Oran • 85 000 km • Diesel</p>
              <p className="text-[#ff5722] font-bold mt-2">1 350 000 DA</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-[#ff9800] text-white py-12 text-center">
      <h2 className="text-2xl font-semibold mb-4">Vous avez un véhicule à vendre ?</h2>
      <p className="mb-6">Publiez votre annonce gratuitement en quelques clics.</p>
      <button className="bg-white text-[#ff9800] px-6 py-3 rounded-full font-medium hover:bg-orange-100">
        Déposer une annonce
      </button>
    </section>
  </main>
  );
}
