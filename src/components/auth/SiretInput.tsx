"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const siretSchema = z.object({
  siret: z
    .string()
    .min(14, "Le numéro SIRET doit contenir 14 chiffres")
    .max(14)
    .regex(/^\d+$/, "Le numéro SIRET doit contenir uniquement des chiffres"),
});

type SiretFormData = z.infer<typeof siretSchema>;

export function SiretInput({ onSubmit }: { onSubmit: (siret: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiretFormData>({
    resolver: zodResolver(siretSchema),
  });

  const handleFormSubmit = (data: SiretFormData) => {
    onSubmit(data.siret);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-md mx-auto space-y-4 text-center">
      <div>
        <label className="block text-sm font-medium mb-1">Numéro SIRET</label>
        <p className="text-xs text-gray-500 mb-2">Veuillez entrer votre numéro SIRET à 14 chiffres</p>
        <input
          type="text"
          {...register("siret")}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret.message}</p>}
      </div>
      <button type="submit" className="bg-gray-800 px-4 py-2 text-white rounded text-sm">
        Vérifier le SIRET
      </button>
    </form>
  );
}