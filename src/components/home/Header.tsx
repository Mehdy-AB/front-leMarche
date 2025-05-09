import { Session } from "next-auth";
import Image from 'next/image'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserAvatar } from "../all/UserAvatar";
export default function Header({session,router}: {session: Session|null,router:AppRouterInstance}) {

    return (
        <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 onClick={() => router.push("/")} className="text-colorOne cursor-pointer text-3xl font-bold">leMarché</h1>
            
            <div className="relative w-fit">
              <input
                type="text"
                placeholder="Rechercher sur leboncoin"
                className="pl-4 pr-10 py-2 rounded-full bg-gray-100 focus:outline-none w-96"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-8 right-2 top-1/2 -translate-y-1/2 text-white bg-colorOne p-1.5 rounded-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>

            </div>
          </div>
          <div className="flex items-end space-x-6 text-sm ">
            <div className="h-full items-center flex my-auto">
              <button onClick={() => router.push("/compte/new")} className="bg-colorOne text-white px-4 py-2 rounded-full font-medium hover:bg-[#e64a19] transition-all duration-300">
                  + Déposer une annonce
              </button>
            </div>
            
            {session&&(<>
            <div className="text-center cursor-pointer hover:text-colorOne duration-300 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 px-auto w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>

              <p>Favoris</p>
            </div>
            <div className="text-center cursor-pointer hover:text-colorOne duration-300 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 px-auto w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <p>Messages</p>
              </div></>)}

            {!session?<div onClick={()=>router.push('/api/auth/signin')} className="text-center cursor-pointer hover:text-colorOne duration-300 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 px-auto w-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
              <p>Se connecter</p>
            </div>:
            <div onClick={()=>router.push('/api/auth/signin')} className="text-center cursor-pointer hover:text-colorOne duration-300 transition-all">
                {session.user.image?.url ? (
                <Image
                  height={100}
                  width={100}
                  src={session.user.image.url}
                  alt="User"
                  className="rounded-full cursor-pointer mx-auto object-cover"
                />
              ) : (
                  <UserAvatar height={32} userName={session.user.username} />
              )}
              {session?<p>{session.user.username}</p>:<p>Se connecter</p>}
            </div>}
          </div>
        </div>
        {/* <nav className="border-t border-gray-100 bg-white text-sm overflow-x-hidden whitespace-nowrap scrollbar-hide">
          <div className="flex gap-20 px-4 py-2 w-max">
            {[
              "Voitures",
              "Motos",
              "Caravaning",
              "Utilitaires",
              "Vélos",
              "Engin",
              "Équipement auto",
              "Équipement moto",
              "Équipement caravaning",
              "Équipement vélos",
              "Équipement nautisme",
              "Services de réparations mécaniques"
            ].map((name, index) => (
              <a key={index} href="#" className="hover:text-[#ff5722]">
                {name}
              </a>
            ))}
          </div>
        </nav> */}
      </header>
    );
}