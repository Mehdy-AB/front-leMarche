'use client'
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { getAd } from "@/lib/req/ghost";
import { OneAdType } from "@/lib/types/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GalleryLightbox from "@/components/all/GalleryLightbox";
import { UserAvatar } from "@/components/all/UserAvatar";
import { favoriteAd, sendMessage, unfavoriteAd } from "@/lib/req/user";
import { useLocalSearchStorage } from "@/components/hooks/useLocalSearchStorage";

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, ""); 
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{3})$/);
  return match ? `${match[2]}-${match[3]}-${match[4]}` : phone;
};


export default function AdPage() {
  const session = useSession();
  const { saveViewedAd } = useLocalSearchStorage();
  const router = useRouter();
  const [isLoading,setIsLoading]=useState(true);
  const params = useParams();
  const id = params?.id;
  const [ad,setAd]=useState<OneAdType|null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryImages, setgalleryImages] = useState<{ src: any; alt: string; }[]>([]);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [messageText, setMessageText] = useState("Bonjour, je suis intéressé par votre annonce.");

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const popup = document.getElementById("divMessage");

    if (
      showMessagePopup &&
      popup &&
      !popup.contains(event.target as Node) 
    ) {
      setShowMessagePopup(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showMessagePopup]);


  useEffect(()=>{
    if(!id||!Number(id)){
      router.back();
      return;
    }
    saveViewedAd(+id)
    const fetchAd=async()=>{
      const ad = await getAd(+id)
      setAd(ad)
      if(ad){
        setgalleryImages(ad.media.map((m: any) => ({
          src: m.media.url,
          alt: ad.title,
        })))
      }
      setIsLoading(false)
    }
    fetchAd();
  },[])

  const addfavoriteAd=(id:number,favorite :boolean)=>{
        if(!session||session.status!=='authenticated')return;
    
        if(favorite){
          setAd((prv) => {
            if (!prv) return null;
            return {
              ...prv,
              favoritesBy: prv.favoritesBy.filter(f => f.id !== session.data?.user.id),
            };
          });
          unfavoriteAd(id)
        }
        else{
          setAd((prv) => {
            if (!prv) return null;
            return {
              ...prv,
              favoritesBy: [...prv.favoritesBy,{id:session.data?.user.id}],
            };
          });
          favoriteAd(id)
        }
      }

  return (
    <main className="font-poppins">
      <Header session={session?.data}/>

      {(isLoading||(!ad))?
       <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
       <div className="grid md:grid-cols-3 gap-6">
         {/* Left: Image + Info */}
         <div className="col-span-2 hidden lg:flex flex-col space-y-4">
           <div className="space-y-2 mt-6">
             <div className="w-2/3 h-8 bg-gray-300 rounded"></div>
             <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
             <div className="flex gap-3">
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
             </div>
             <div className="w-full h-4 bg-gray-200 rounded mt-1"></div>
             <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
           </div>
 
           <div className="grid grid-cols-3 gap-2 mt-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="w-full h-40 bg-gray-300 rounded-lg"></div>
             ))}
           </div>
 
           <div className="mt-2 w-40 h-8 bg-gray-300 rounded-full mx-auto"></div>
         </div>
 
         {/* Right: Seller Info */}
         <aside className="border rounded-2xl p-4 shadow-lg space-y-4 bg-white">
           <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
           <div className="w-2/3 h-5 bg-gray-300 rounded mx-auto"></div>
           <div className="w-1/3 h-4 bg-gray-200 rounded mx-auto"></div>
           <div className="w-1/3 h-3 bg-gray-200 rounded mx-auto"></div>
 
           <div className="flex justify-around py-2 text-center">
             {[1, 2, 3].map((i) => (
               <div key={i} className="space-y-1">
                 <div className="w-6 h-4 bg-gray-300 rounded mx-auto"></div>
                 <div className="w-12 h-3 bg-gray-200 rounded mx-auto"></div>
               </div>
             ))}
           </div>
 
           <div className="space-y-2">
             <div className="w-full h-10 bg-gray-300 rounded-xl"></div>
             <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
           </div>
         </aside>
       </div>
 
       {/* Description */}
       <div className="mt-6 border-b pb-6">
         <div className="w-40 h-6 bg-gray-300 mb-2 rounded"></div>
         <div className="space-y-2">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-full h-3 bg-gray-200 rounded"></div>
           ))}
         </div>
       </div>
 
       {/* Characteristics */}
       <div className="mt-6">
         <div className="w-40 h-6 bg-gray-300 mb-2 rounded"></div>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="flex justify-between py-2">
               <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
               <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
             </div>
           ))}
         </div>
       </div>

       <div className="col-span-2 flex lg:hidden flex-col space-y-4">
           <div className="space-y-2 mt-6">
             <div className="w-2/3 h-8 bg-gray-300 rounded"></div>
             <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
             <div className="flex gap-3">
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
               <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
             </div>
             <div className="w-full h-4 bg-gray-200 rounded mt-1"></div>
             <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
           </div>
 
           <div className="grid grid-cols-3 gap-2 mt-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="w-full h-40 bg-gray-300 rounded-lg"></div>
             ))}
           </div>
 
           <div className="mt-2 w-40 h-8 bg-gray-300 rounded-full mx-auto"></div>
        </div>
     </div>
      :<div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-3 gap-6 relative">
        {/* Image + Info */}
        <div className="col-span-2 flex flex-col">
          {/* Title & Price */}
          <div className="mt-6">
            <h1 className="text-4xl font-bold mb-1 border-l-[10px] pl-2 border-colorOne">
              {ad.title}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-colorOne">
                {ad.price.toLocaleString("fr-FR").replaceAll(",", " ")} €
              </p>
              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-colorOne" title="Favori">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={(e)=>{
                    addfavoriteAd(ad.id,!!ad.favoritesBy.find(f=>f.id===session.data?.user.id))}} strokeWidth={1.5} stroke="currentColor" className={`size-7 text-colorOne cursor-pointer hover:fill-colorOne ${ad.favoritesBy.find(f=>f.id===session.data?.user.id)?'fill-colorOne':''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                </button>
                <button className="text-gray-500 hover:text-colorOne" title="Partager">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                </button>
                <button className="text-gray-500 hover:text-colorOne" title="Partager">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {ad.region?.name} • {ad.attributes.find(a => a.attribute.name === "Année modèle")?.value} • {ad.attributes.find(a => a.attribute.name === "Kilométrage")?.value} km • {
                ad.attributes.find(a => a.attribute.name === "Énergie")?.option?.value
              }
            </p>
            <p className="text-xs text-gray-400">
              Publié le {new Date(ad.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
    
          {/* Gallery */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {ad.media.slice(0, 3).map((m: any, i: number) => (
              <img
                key={i}
                src={m.media.url}
                className="rounded-lg w-full h-40 object-cover cursor-pointer"
                alt="Vehicle"
                onClick={() => {
                  setPhotoIndex(i);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>

          <button
            className="mt-2 mx-auto px-3 py-1 text-sm text-white bg-colorOne rounded-full font-medium"
            onClick={() => {
              setPhotoIndex(0);
              setLightboxOpen(true);
            }}
          >
            Voir les photos
          </button>

          <GalleryLightbox
            images={galleryImages}
            open={lightboxOpen}
            setOpen={setLightboxOpen}
            index={photoIndex}
            setIndex={setPhotoIndex}
          />
        </div>
        {/* Seller Info */}
        

        <aside className="border hidden lg:block rounded-2xl p-4 shadow-lg space-y-4 text-center bg-white">
        <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className=" cursor-pointer">
          {ad.user.image?.url ? (
            <Image
              height={100}
              width={100}
              src={ad.user.image.url}
              alt="User"
              className="rounded-full cursor-pointer mx-auto object-cover"
            />
          ) : (
              <UserAvatar height={100} userName={ad.user.username} />
            
          )}
          </div>

          <div>
            <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className="text-xl cursor-pointer font-bold text-gray-800">{ad.user.fullName}</div>
            <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className="text-sm cursor-pointer underline text-gray-500">@{ad.user.username}</div>
            <div className="text-xs text-gray-400 mt-1">
              Actif 6 min ago
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around text-center text-sm text-gray-700 border rounded-lg py-2">
            <div>
              <div className="font-semibold text-base">{ad.user._count.followers || 0}</div>
              <div className="text-xs text-gray-500">Abonnés</div>
            </div>
            <div>
              <div className="font-semibold text-base">{ad.user._count.following||0}</div>
              <div className="text-xs text-gray-500">Abonnements</div>
            </div>
            <div>
              <div className="font-semibold text-base">{ad.user._count.ads || 1}</div>
              <div className="text-xs text-gray-500">Annonces</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <div className="relative">
            {session.data?.user.id!==ad.user.id&&<><button
              
              onClick={() => {
                setShowMessagePopup((prev) => !prev);
              }}
              className="w-full relative bg-colorOne text-white rounded-xl py-2 hover:opacity-95 flex items-center justify-center "
            >
              Envoyer un message
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="size-6 ml-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </button>
            {showMessagePopup && (
              <>
                {/* Backdrop for mobile/tablet */}
                <div
                  onClick={() => setShowMessagePopup(false)}
                  className="fixed inset-0 z-40 bg-black/30 sm:hidden"
                />

                <div
                  id="divMessage"
                  className={`z-50 bg-white border shadow-xl p-4
                    absolute  -translate-x-[95%] translate-y-[5%] inset-0 max-w-md w-[90vw] h-fit rounded-2xl flexsm:flex-col justify-center`}
                >
                  <h3 className="font-semibold text-lg mb-2">Que souhaitez-vous demander ?</h3>

                  {/* Default message buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      "Le véhicule est-il toujours disponible ?",
                      "Quel est le kilométrage exact ?",
                      "Est-ce que le prix est négociable ?",
                      "Le contrôle technique est-il à jour ?",
                      "Pouvez-vous m’envoyer plus de photos ?",
                      "Le véhicule a-t-il eu des accidents ?",
                    ].map((text, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setMessageText((prev) =>
                            prev.includes(text) ? prev : prev + (prev ? "\n" : "") + text
                          )
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-xs px-3 py-1 rounded-full border text-gray-700"
                      >
                        {text}
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full border rounded-md p-2 text-sm resize-none"
                    placeholder="Écrivez votre message ici..."
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => {
                      if (session.status !== 'authenticated') {
                        router.push("/api/auth/signin");
                        return;
                      }
                      sendMessage({
                        reciverId: ad.user.id,
                        content: messageText,
                        adId: ad.id,
                      }).then(() => router.push("/compte/chat"));
                      setShowMessagePopup(false);
                    }}
                    className="mt-3 bg-colorOne text-white w-full py-2 rounded-md hover:opacity-95 text-sm"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}
            </>}
            </div>
            <button className="w-full shadow-md font-semibold text-xl border rounded-xl py-2 ">
              +33 {formatPhone(ad.user.phone)}
            </button>
          </div>
        </aside>
      </div>
    
      {/* Description */}
      <div className="mt-6 border-b pb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 text-sm whitespace-pre-line">{ad.description}</p>
      </div>
    
      {/* Characteristics */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Caractéristiques</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {ad.attributes.map((attr: any, i: number) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span className="text-gray-500">{attr.attribute.name}</span>
              <span className="font-medium">
                {attr.option?.value || `${attr.value}${attr.attribute.unit || ""}`}
              </span>
            </div>
          ))}
        </div>
      </div>
      <aside className="border block lg:hidden mt-4 rounded-2xl p-4 shadow-lg space-y-4 text-center bg-white">
        <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className=" cursor-pointer">
          {ad.user.image?.url ? (
            <Image
              height={100}
              width={100}
              src={ad.user.image.url}
              alt="User"
              className="rounded-full cursor-pointer mx-auto object-cover"
            />
          ) : (
              <UserAvatar height={100} userName={ad.user.username} />
            
          )}
          </div>

          <div>
            <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className="text-xl cursor-pointer font-bold text-gray-800">{ad.user.fullName}</div>
            <div onClick={()=>{router.push(`/user/${ad.user.id}`)}} className="text-sm cursor-pointer underline text-gray-500">@{ad.user.username}</div>
            <div className="text-xs text-gray-400 mt-1">
              Actif 6 min ago
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around text-center text-sm text-gray-700 border rounded-lg py-2">
            <div>
              <div className="font-semibold text-base">{ad.user._count.followers || 0}</div>
              <div className="text-xs text-gray-500">Abonnés</div>
            </div>
            <div>
              <div className="font-semibold text-base">{ad.user._count.following||0}</div>
              <div className="text-xs text-gray-500">Abonnements</div>
            </div>
            <div>
              <div className="font-semibold text-base">{ad.user._count.ads || 1}</div>
              <div className="text-xs text-gray-500">Annonces</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <div className="relative">
            {session.data?.user.id!==ad.user.id&&<><button
              
              onClick={() => {
                setShowMessagePopup((prev) => !prev);
              }}
              className="w-full relative bg-colorOne text-white rounded-xl py-2 hover:opacity-95 flex items-center justify-center "
            >
              Envoyer un message
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="size-6 ml-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </button>
             {showMessagePopup && (
              <>
                {/* Backdrop for mobile/tablet */}
                <div
                  onClick={() => setShowMessagePopup(false)}
                  className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                />

                <div
                  id="divMessage"
                  className={`z-50 bg-white border rounded-xl shadow-xl p-4 w-80 max-w-[90vw]
                    absolute sm:fixed sm:inset-0 sm:m-auto sm:max-w-md sm:w-[90vw] sm:h-fit sm:rounded-2xl sm:flex sm:flex-col sm:justify-center`}
                >
                  <h3 className="font-semibold text-lg mb-2">Que souhaitez-vous demander ?</h3>

                  {/* Default message buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      "Le véhicule est-il toujours disponible ?",
                      "Quel est le kilométrage exact ?",
                      "Est-ce que le prix est négociable ?",
                      "Le contrôle technique est-il à jour ?",
                      "Pouvez-vous m’envoyer plus de photos ?",
                      "Le véhicule a-t-il eu des accidents ?",
                    ].map((text, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setMessageText((prev) =>
                            prev.includes(text) ? prev : prev + (prev ? "\n" : "") + text
                          )
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-xs px-3 py-1 rounded-full border text-gray-700"
                      >
                        {text}
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full border rounded-md p-2 text-sm resize-none"
                    placeholder="Écrivez votre message ici..."
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => {
                      if (session.status !== 'authenticated') {
                        router.push("/api/auth/signin");
                        return;
                      }
                      sendMessage({
                        reciverId: ad.user.id,
                        content: messageText,
                        adId: ad.id,
                      }).then(() => router.push("/compte/chat"));
                      setShowMessagePopup(false);
                    }}
                    className="mt-3 bg-colorOne text-white w-full py-2 rounded-md hover:opacity-95 text-sm"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}</>}
            </div>
            <button className="w-full shadow-md font-semibold text-xl border rounded-xl py-2 ">
              +33 {formatPhone(ad.user.phone)}
            </button>
          </div>
        </aside>
    </div>
    }
      <Footer/>
    </main>
  );
}
