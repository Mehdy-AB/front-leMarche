"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadData, uploadSchema } from "@/lib/validation/all.schema";

export function SiretProofUpload({ onSubmit }: { onSubmit: (data: { kbis: File; id: File; address: File }) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadData>({
    resolver: zodResolver(uploadSchema),
  });

  const kbis = watch("kbis")?.[0];
  const id = watch("id")?.[0];
  const address = watch("address")?.[0];

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>, name: keyof UploadData) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue(name, e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = async (data: UploadData) => {
    onSubmit({
      kbis: data.kbis,
      id: data.id,
      address: data.address,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-2xl p-4 mx-auto space-y-2 text-sm md:text-base"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-center">Téléversez vos justificatifs</h2>

      {[
        {
          id: "kbis",
          label: "Extrait KBIS",
          desc: "Justificatif officiel de l'enregistrement de l'entreprise",
          file: kbis,
        },
        {
          id: "id",
          label: "Pièce d'identité du propriétaire",
          desc: "Carte d'identité ou passeport",
          file: id,
        },
        {
          id: "address",
          label: "Justificatif de domicile",
          desc: "Facture récente ou quittance de loyer",
          file: address,
        },
      ].map(({ id, label, desc, file }) => (
        <div key={id}>
          <label className="block font-medium mb-1" htmlFor={id}>{label}</label>
          <p className="text-xs text-gray-500 mb-2">{desc}</p>
          <input id={id} type="file" {...register(id as keyof UploadData)} className="hidden" />
          <label
            htmlFor={id}
            onDrop={(e) => handleDrop(e, id as keyof UploadData)}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-white text-gray-600 hover:border-gray-400 p-4"
          >
            <span className="text-sm">
              {file ? (
                <span className="text-green-600 flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
                {file.name}</span>
              ) : (
                <>
                  Glissez et déposez un fichier ici ou <span className="text-blue-600 underline">parcourir</span>
                </>
              )}
            </span>
          </label>
          {errors[id as keyof UploadData] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[id as keyof UploadData]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div className="text-center">
        <button
          type="submit"
          className="bg-colorOne hover:bg-colorOne/80 rounded-xl w-full text-white px-6 py-2 transition text-sm md:text-base"
        >
          Envoyer les documents
        </button>
      </div>
    </form>
  );
}