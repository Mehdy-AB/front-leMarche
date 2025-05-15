'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function ProfileSettingsFr() {
  const [profile, setProfile] = useState({
    fullName: "Tom Cook",
    email: "tom.cook@example.com",
    phone: "+33 6 12 34 56 78",
    bio: "Passionné par les ressources humaines et le développement des talents.",
  });

  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto px-4 py-6">
      <section>
        <h2 className="text-xl font-semibold mb-1">Profil</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Ces informations seront visibles publiquement sur votre profil.
        </p>

        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border shadow">
            <Image
              src={image || "/default-user.png"}
              alt="Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Changer l’image</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Nom complet</label>
            <Input
              value={profile.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Adresse email</label>
            <Input
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="nom@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Téléphone</label>
            <Input
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+33 6 12 34 56 78"
              type="tel"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Parlez-nous un peu de vous..."
              rows={4}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button>Enregistrer les modifications</Button>
        </div>
      </section>
    </div>
  );
}
