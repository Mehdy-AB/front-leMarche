import { unfavoriteAd, favoriteAd } from "@/lib/req/user";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Ads } from "@/lib/types/types";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./UserAvatar";

export const OneAd = ({ ad, setAds }: { ad: Ads[number], setAds: Dispatch<SetStateAction<Ads>> }) => {
  const session = useSession();
  const router = useRouter();

  const addFavoriteAd = (id: number, isFavorite: boolean) => {
    if (session.status !== 'authenticated') {
      router.push("/api/auth/signin");
      return;
    }

    if (isFavorite) {
      setAds(prev => prev.map(a => a.id === id
        ? { ...a, favoritesBy: a.favoritesBy.filter(f => f.id !== session.data?.user.id) }
        : a));
      unfavoriteAd(id);
    } else {
      setAds(prev => prev.map(a => a.id === id
        ? { ...a, favoritesBy: [...a.favoritesBy, { id: session.data?.user.id }] }
        : a));
      favoriteAd(id);
    }
  };

  const isFavorite = !!ad.favoritesBy.find(f => f.id === session.data?.user.id);

  return (
    <a
      href={`/ad/${ad.id}`}
      className="block border border-gray-200 hover:bg-gray-100  relative rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Favorite Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        onClick={(e) => {
          e.preventDefault(); // prevent <a> navigation
          e.stopPropagation();
          addFavoriteAd(ad.id, isFavorite);
        }}
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-8 bg-black/30 rounded-full p-1 text-white cursor-pointer hover:bg-black/40 absolute top-2 right-2 ${isFavorite ? 'fill-colorOne' : ''}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>

      {/* Image */}
      <Image
        width={300}
        height={300}
        src={ad.media[0].media.url.replace(
          "/upload/",
          "/upload/w_300,h_300,c_fill,f_auto,q_auto/"
        )}
        alt="Produit"
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{ad.title}</h3>
        <p className="text-sm text-gray-600">
          {ad.attributes
            .filter(attr => [1, 2, 3, 5].includes(attr.attribute.id))
            .map(attr =>
              attr.attribute.type === 'SELECT' && attr.option
                ? attr.option.value
                : `${attr.value}${attr.attribute.unit ? ` ${attr.attribute.unit}` : ''}`
            )
            .join(' · ')}
        </p>
        <p className="text-colorOne font-bold mt-2">{ad.price.toLocaleString()} €</p>
      </div>

      {/* User Info */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/user/${ad.user.id}`);
        }}
        className="absolute hover:shadow-md hover:scale-105 duration-200 transition-all bottom-14 right-2 flex items-center gap-2 bg-white bg-opacity-80 px-2 py-1 rounded-lg shadow-sm"
      >
        {ad?.user?.image?.url ? (
          <Image
            src={"/images/mehdi.jpg"}
            alt={ad.user.username}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <UserAvatar height={30} userName={ad.user?.username || 'A'} />
        )}
        <div className="text-xs text-gray-700">
          <p className="font-semibold">{ad.user.username}</p>
          <p className="text-[10px] text-gray-500">{ad.user.userType}</p>
        </div>
      </div>

      {/* Voir l'annonce Button */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/ad/${ad.id}`);
        }}
        className="border border-colorOne text-colorOne mb-4 mx-auto w-[90%] px-3 py-1 text-lg text-center rounded-full shadow hover:brightness-110 transition"
      >
        Voir l'annonce
      </div>
    </a>
  );
};
