"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const uploadSchema = z.object({
  kbis: z.instanceof(FileList).refine((files) => files.length > 0, "Fichier requis"),
  id: z.instanceof(FileList).refine((files) => files.length > 0, "Fichier requis"),
  address: z.instanceof(FileList).refine((files) => files.length > 0, "Fichier requis"),
});

type UploadData = z.infer<typeof uploadSchema>;

export function SiretProofUpload({ onSubmit }: { onSubmit: (data: { kbis: File; id: File; address: File }) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadData>({
    resolver: zodResolver(uploadSchema),
  });

  const handleFormSubmit = (data: UploadData) => {
    onSubmit({
      kbis: data.kbis[0],
      id: data.id[0],
      address: data.address[0],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-md mx-auto space-y-6 text-sm">
      <div>
        <label className="block font-medium mb-1">Extrait KBIS</label>
        <p className="text-xs text-gray-500 mb-1">Justificatif officiel de l'enregistrement de l'entreprise</p>
        <input type="file" {...register("kbis")} className="w-full" />
        {errors.kbis && <p className="text-red-500 text-xs">{errors.kbis.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1">Pièce d'identité du propriétaire</label>
        <p className="text-xs text-gray-500 mb-1">Carte d'identité ou passeport</p>
        <input type="file" {...register("id")} className="w-full" />
        {errors.id && <p className="text-red-500 text-xs">{errors.id.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1">Justificatif de domicile</label>
        <p className="text-xs text-gray-500 mb-1">Facture récente ou quittance de loyer</p>
        <input type="file" {...register("address")} className="w-full" />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>
      <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm">
        Envoyer les documents
      </button>
    </form>
  );
}