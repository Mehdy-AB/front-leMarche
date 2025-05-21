"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiretFormData, siretSchema } from "@/lib/validation/all.schema";
import { getSiret } from "@/lib/req/ghost";
import { SiretInfo } from "@/lib/types/types";
import { useEffect } from "react";
import Loader from "@/lib/loaders/Loader";


export function SiretInput({ onSubmit }: { onSubmit: (siretInfo: SiretInfo) => void }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors ,isSubmitting},
  } = useForm<SiretFormData>({
    resolver: zodResolver(siretSchema),
  });

  const handleFormSubmit = async (data: SiretFormData) => {
    const siret = await getSiret(data.siret);
    if (siret) onSubmit(siret);
    
    else setError('siret', { type: 'manual', message: 'Le numéro SIRET saisi est invalide. Veuillez vérifier et réessayer.' });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-md mx-auto space-y-4 text-start">
      <div className="mt-6">
        <label className="block  font-medium mb-1">SIRET</label>
        <p className="text-xs text-gray-500 mb-2">Veuillez entrer votre numéro SIRET à 14 chiffres</p>
        <input
          type="text"
          {...register("siret")}
          autoComplete="off"
          className="w-full border border-gray-300 focus:border-gray-500 rounded-xl px-3 py-2 outline-none text-sm"
        />
        {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret.message}</p>}
      </div>
      <button disabled={isSubmitting} type="submit" className="bg-orange-400 disabled:bg-gray-200 w-full rounded-4xl py-2 rounded-full mt-6 font-semibold text-white">
        {isSubmitting?<Loader/>:'Vérifier'}
      </button>
    </form>
  );
}