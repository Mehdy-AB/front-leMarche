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
      <h2 className="text-lg font-semibold">Est-ce votre entreprise ?</h2>
      <p className="text-sm text-gray-500">Les informations suivantes ont été trouvées :</p>
      <div className="border rounded p-4 text-left text-sm bg-gray-50">
        <p><strong>Nom :</strong> {company.nom}</p>
        <p><strong>SIRET :</strong> {company.siret}</p>
        <p><strong>Date de création :</strong> {company.date_creation}</p>
        <p><strong>Statut :</strong> {company.etat_administratif}</p>
        <p><strong>Activité principale :</strong> {company.activite_principale}</p>
        <p><strong>Adresse :</strong> {company.adresse}</p>
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={onConfirm} className="bg-gray-800 text-white px-4 py-2 rounded text-sm">Oui</button>
        <button onClick={onReject} className="bg-gray-300 px-4 py-2 rounded text-sm">Non</button>
      </div>
    </div>
  );
}