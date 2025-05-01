export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm font-poppins">
          
          {/* Logo and About */}
          <div>
            <h2 className="text-2xl font-bold text-colorOne mb-2">Le Marché</h2>
            <p className="text-gray-600">
              La plateforme dédiée à l’achat et la vente de véhicules en Algérie.
              Simple, rapide, sans commission.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-colorOne transition">Accueil</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Publier une annonce</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Connexion</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Catégories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-colorOne transition">Voitures</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Motos</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Utilitaires</a></li>
              <li><a href="#" className="hover:text-colorOne transition">Vélos</a></li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Contact</h3>
            <p>Email: contact@lemarche.dz</p>
            <p className="mb-4">Téléphone: +213 555 123 456</p>
            
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Le Marché. Tous droits réservés.
        </div>
      </footer>
    );
}