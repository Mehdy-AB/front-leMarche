"use client"

type CompanyInfo = {
  nom: string;
  siret: string;
  siren: string;
  date_creation: string;
  etat_administratif: string;
  activite_principale: string;
  adresse: string;
};

export function SiretConfirmation({
  company,
  onConfirm,
  onReject,
}: {
  company: CompanyInfo;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      
      <div className="border rounded-xl p-4 py-10 mt-4 text-left text-sm bg-gray-50">
        <h2 className="text-lg text-center font-semibold">Est-ce votre entreprise ?</h2>
        <p className="text-sm text-gray-500 mb-2 text-center">Les informations suivantes ont été trouvées :</p>
        <p><strong>Nom :</strong> {company.nom}</p>
        <p><strong>SIRET :</strong> {company.siret}</p>
        <p><strong>Date de création :</strong> {company.date_creation}</p>
        <p><strong>Adresse :</strong> {company.adresse}</p>
        <p><strong>Statut :</strong> {company.etat_administratif==='A'?'Active':'Disactive'}</p>
        <p><strong>Activité principale :</strong> {company.activite_principale}</p>
        
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={onReject} className="bg-gray-300 px-4 hover:bg-gray-200 py-2 w-[20%] hover:w-[50%] duration-300 transition-all rounded-xl text-sm">Non</button>
        <button onClick={onConfirm} className="bg-colorOne hover:bg-colorOne/70 text-white px-4 py-2 w-[30%] hover:w-[50%] duration-300 rounded-xl text-sm">Oui, Suivant</button>
      </div>
    </div>
  );
}